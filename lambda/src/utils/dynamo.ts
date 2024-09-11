import { MLBStandings } from '@bp1222/stats-api';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export default class DynamoClient {
  table: string;
  docClient: DocumentClient;

  constructor(table = process.env.SEASON_STANDINGS_TABLE) {
    const params = {
      region: process.env.AWS_REGION,
    }

    if (process.env.DEVELOPMENT === 'true') {
      params['endpoint'] = "http://docker.for.mac.localhost:8000"
    }

    this.docClient = new DocumentClient(params);
    this.table = table;
  }

  async ReadStandings(season: string, league: string, date: string = null): Promise<{[x: string]: MLBStandings[]}> {
    const params: DocumentClient.QueryInput = {
      TableName: this.table,
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

    const result = await this.docClient.query(params).promise()
    try {
      const retval: {[x: string]: MLBStandings[]} = {}
      result.Items.forEach((i) => retval[i.date] = i.standings)
      return retval
    } catch (err) {
      console.error(err)
    }
  }

  async WriteStandings(season: string, league: string, date: string, standings: MLBStandings[]) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.table,
      Item: {
        "pk": season,
        "sort": league + "#" + date,
        "date": date,
        "standings": standings,
      }
    }

    try {
      await this.docClient.put(params).promise()
    } catch (err) {
      console.error(err)
    }
  }
}