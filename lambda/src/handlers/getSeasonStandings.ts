import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import DynamoClient from '../utils/dynamo';
import GetCORSHeaders from '../utils/cors';
import { GetSeason, GetStandings } from './mlb';

const db = new DynamoClient()

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
  // Second: determine the most recent day for which we have a cache
  //
  const standings = await db.ReadStandings(seasonId, leagueId)
  let mostRecentCachedDay = new Date("0000-00-00")
  
  if (Object.keys(standings).length > 0) {
    mostRecentCachedDay = new Date(Object.keys(standings).reduce((a, b) => new Date(a) > new Date(b) ? a : b))
  }

  //
  // Third: discern where we need to start from, then query for and cache away new standings
  //
  const today = new Date()

  const seasonStartDate = new Date(Date.parse(season!.regularSeasonStartDate!))
  const seasonEndDate = new Date(Date.parse(season!.regularSeasonEndDate!))

  // Determine which date we start with, if the season start date is before our cache, use our cache
  const startDate = seasonStartDate < mostRecentCachedDay ? mostRecentCachedDay : seasonStartDate
  const endDate = seasonEndDate < today ? seasonEndDate : today

  console.log("Today is " + today + " will query MLB Data from: " + startDate + " to " + endDate)
  for (let day = startDate; day <= endDate; /* iterates below */) {
    const standingsDate = day.toISOString().substring(0, 10)
    const dayStandings = await GetStandings(seasonId, leagueId, standingsDate)

    if (dayStandings?.records) {
      // Do not cache todays standings, they may still be in processing
      if (today != day) {
        await db.WriteStandings(seasonId, leagueId, standingsDate, dayStandings.records)
      }
      standings[standingsDate] = dayStandings.records
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
    body: JSON.stringify(standings),
    headers: GetCORSHeaders(event),
   }
}