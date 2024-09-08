// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { MlbApi } from '@bp1222/stats-api'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({
  region: "us-east-2",
  endpoint: process.env.DEVENV == 'OSX' ? "http://docker.for.mac.localhost:8000" : undefined,
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.TableName;

// API to query for MLB Data
const mlbApi = new MlbApi()

const getStoredData = (season: string, league: string) => {

}

export const handler = async (event: APIGatewayProxyEvent) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  // All log statements are written to CloudWatch
  console.info('received:', event);
 
  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const season = event.pathParameters.season;
  const league = event.pathParameters.league;
 
  // Get the item from the table
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
  var params = {
    TableName : tableName,
    Key: { season: season, league: league },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    var item = data.Item;
  } catch (err) {
    console.log("Error", err);
  }
 
    /*
    params.Item = {
      season: season,
      league: league,
      dates: [{
        date: "2024-04-12",
        records: [{
          team: "Phils",
        }, { team: "Bravos"}]
      },
    {
        date: "2024-04-13",
        records: [{
          team: "Phils",
        }, { team: "Bravos"}]
    }],
    }
    await ddbDocClient.send(new PutCommand(params))
    */
 
  const response = {
    statusCode: 200,
    body: JSON.stringify(item)
  };
 
  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
