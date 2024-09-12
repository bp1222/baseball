import { MLBStandings } from '@bp1222/stats-api';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const params = {
  region: process.env.AWS_REGION,
}
if (process.env.DEVELOPMENT === 'true') {
  params['endpoint'] = "http://docker.for.mac.localhost:8000"
}
const docClient = new DocumentClient(params);
const table = process.env.SEASON_STANDINGS_TABLE;

export const ReadStandings = async (season: string, league: string, date: string = null): Promise<{[x: string]: MLBStandings[]}> => {
  const params: DocumentClient.QueryInput = {
    TableName: table,
    ExpressionAttributeValues: {
      ":pk": season,
      ":league": league,
    },
    KeyConditionExpression: "pk = :pk and begins_with(sort, :league)"
  };

  if (date != null) {
    params.ExpressionAttributeValues[":date"] = date
    params.KeyConditionExpression += " and ends_with(sort, :date)"
  }

  const result = await docClient.query(params).promise()
  try {
    const retval: {[x: string]: MLBStandings[]} = {}
    result.Items.forEach((i) => retval[i.date] = i.standings)
    return retval
  } catch (err) {
    console.error(err)
  }
}

export const WriteStandings = async (season: string, league: string, date: string, standings: MLBStandings[]) => {
  const params: DocumentClient.PutItemInput = {
    TableName: table,
    Item: {
      "pk": season,
      "sort": league + "#" + date,
      "date": date,
      "standings": standings,
    }
  }

  try {
    await docClient.put(params).promise()
  } catch (err) {
    console.error(err)
  }
}