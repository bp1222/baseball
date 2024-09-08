import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

type KeyTypes = 
  { season: string, league: string };

export default class DynamoClient {
  table: string;
  docClient: DynamoDBDocumentClient;

  constructor(table = process.env.SEASON_STANDINGS_TABLE) {
    const client = new DynamoDBClient({
      region: "us-east-2",
      endpoint: process.env.DEVENV == 'OSX' ? "http://docker.for.mac.localhost:8000" : undefined,
    });

    this.docClient = DynamoDBDocumentClient.from(client);
    this.table = table;
  }

  async read(key: KeyTypes) {
    const params = {
      TableName: this.table,
      Key: key,
    };

    const data = await this.docClient.send(new GetCommand(params));

    return data.Item;
  }

  async write(key: KeyTypes, item: object) {
    const params = {
      TableName: this.table,
      Item: { ...key, ...item },
    };

    return await this.docClient.send(new PutCommand(params));
  }
}