import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const result = await dynamoDb.send(
      new ScanCommand({ TableName: Resource.AddOns.name }),
    );
    console.log("DynamoDB Scan result:", JSON.stringify(result, null, 2));

    const addOns = result.Items || [];
    console.log("AddOns retrieved:", addOns);

    return {
      statusCode: 200,
      body: JSON.stringify(addOns),
    };
  } catch (error) {
    console.error("Error fetching addOns:", JSON.stringify(error, null, 2)); // Detailed error logging

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Could not fetch addOns" }),
    };
  }
}
