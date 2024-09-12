import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { GetSeason, GetStandings } from '../utils/mlb';
import {ReadStandings, WriteStandings} from "../utils/dynamo";
import GetCorsHeaders from "../utils/cors";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  const seasonId = event.pathParameters.season;
  const leagueId = event.pathParameters.league;

  //
  // First: get the season 
  //
  const season = await GetSeason(seasonId)

  //
  // Second: Pull out cached standings, there's a non-zero chance we may have errored pulling specific days
  //         so we will use keys to discern if we need to requery and cache missing dates
  //
  const standings = await ReadStandings(seasonId, leagueId)
  const standingsDates = Object.keys(standings)
  console.info("Pulled " + standingsDates.length + " standings for " + seasonId + " from cache")

  //
  // Third: discern where we need to start from, then query for and cache away new standings
  //
  const today = new Date()

  const seasonStartDate = new Date(Date.parse(season!.regularSeasonStartDate!))
  const seasonEndDate = new Date(Date.parse(season!.regularSeasonEndDate!))

  // Determine which date we start with, if the season start date is before our cache, use our cache
  const startDate = seasonStartDate
  const endDate = seasonEndDate < today ? seasonEndDate : today

  for (let day = startDate; day <= endDate; /* iterates below */) {
    const standingsDate = day.toISOString().substring(0, 10)

    if (!standingsDates.includes(standingsDate)) {
      const dayStandings = await GetStandings(seasonId, leagueId, standingsDate)
      if (dayStandings?.records) {
        console.info("Pulled standings for " + standingsDate + " from MLB API")
        standings[standingsDate] = dayStandings.records

        // Do not cache todays standings, they may still be in processing
        if (today != day) {
          console.log("Caching standings for", standingsDate)
          await WriteStandings(seasonId, leagueId, standingsDate, dayStandings.records)
        }
      }
    }

    const nextDay = new Date(day)
    nextDay.setDate(day.getDate() + 1)
    day = nextDay
  }

  //
  // Fourth: return standings back to the suer
  //
  return {
    statusCode: 200,
    headers: GetCorsHeaders(event),
    body: JSON.stringify(standings),
   }
}