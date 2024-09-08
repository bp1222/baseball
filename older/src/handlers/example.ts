import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, GetCommand } from '@aws-sdk/lib-dynamodb';
import { MlbApi } from '@bp1222/stats-api';

const client = new DynamoDBClient({
  endpoint: process.env.AWS_SAM_LOCAL ? 'http://docker.for.mac.localhost:8000' : undefined, 
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocument.from(client);

const api = new MlbApi();

const getSeasonDates = async (season: string): Promise<{start?: string, end?: string}> => {
  //console.log(await api.getSeason({sportId: 1, season: season}))
  return {}
};

export const exampleHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const season =  event.pathParameters!.season!
      const league = event.pathParameters!.league!

      const params = {
        TableName: process.env.STANDINGS_TABLE_NAME,
        Key: {
          season: season,
          league: league
        },
      }

      try {
        const data = await documentClient.send(new GetCommand(params));

        if (data.Item === undefined) {
          await getSeasonDates(season)
        }
      } catch (err) {
        console.error(err)
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'hello world',
        }),
      };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
