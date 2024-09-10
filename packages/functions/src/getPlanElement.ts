import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing id parameter" }),
    };
  }

  try {
    const result = await dynamoDb.send(
      new GetCommand({ TableName: Resource.Plans.name, Key: { planId: id } }),
    );

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Plan not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching plan:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch plan" }),
    };
  }
};
