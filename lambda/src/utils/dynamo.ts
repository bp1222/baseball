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

// Sort Key Format
// {league}#{division}#{date}

export const ReadStandings = async (seasonId: string, leagueId: string, divisionId: string, date: string = null): Promise<{[date:string]: MLBStandings}> => {
  const params: DocumentClient.QueryInput = {
    TableName: table,
    ExpressionAttributeValues: {
      ":pk": seasonId,
      ":sortKey": leagueId + "#" + divisionId,
    },
    KeyConditionExpression: "pk = :pk and begins_with(sort, :sortKey)"
  };

  if (date != null) {
    params.ExpressionAttributeValues[":date"] = date
    params.KeyConditionExpression += " and ends_with(sort, :date)"
  }

  const result = await docClient.query(params).promise()
  try {
    const retval: {[date: string]: MLBStandings} = {}
    result.Items.forEach((i) => retval[i.date] = i.standings)
    return retval
  } catch (err) {
    console.error(err)
  }
}

export const WriteStandings = async (seasonId: string, leagueId: string, divisionId: string, date: string, standings: MLBStandings) => {
  const params: DocumentClient.PutItemInput = {
    TableName: table,
    Item: {
      "pk": seasonId,
      "sort": leagueId + "#" + divisionId + "#" + date,
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