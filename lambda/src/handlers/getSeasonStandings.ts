import { APIGatewayProxyEvent } from 'aws-lambda';
import { MlbApi, MLBSeason } from '@bp1222/stats-api'
import DynamoClient from '../utils/dynamo';

const mlbApi = new MlbApi()
const db = new DynamoClient()

const getStoredData = async (season: string, league: string): Promise<MLBSeason> => {
  try {
    const s = await mlbApi.getSeason({ sportId: 1, season: season })
  } catch(err) {
    console.error(err)
  }
  return null
}

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('received:', event);

  const season = event.pathParameters.season;
  const league = event.pathParameters.league;
  const key = {season: season, league: league}

  console.log(await db.read({season: season, league: league}))

  const data = {
    dates: [{
      date: "2024-04-12",
      records: [{
        team: "Phils",
      }, { team: "Bravos" }]
    },
    {
      date: "2024-04-13",
      records: [{
        team: "Phils",
      }, { team: "Bravos" }]
    }],
  }
  try {
    //await db.write({season: season, league: league}, data)
  } catch (err) {
    console.error(err)
  }
  return {
    statusCode:200,
  }
 
  const params = {
    TableName: process.env.SEASON_STANDINGS_TABLE,
    Key: { season: season, league: league },
    Item: undefined,
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    const items = data.Item;
    console.log(items)
    items.dates.forEach((d) => console.log(d.records))
  } catch (err) {
    console.log("Error", err);

  }
 
  const response = {
    statusCode: 200,
    body: JSON.stringify({})
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}