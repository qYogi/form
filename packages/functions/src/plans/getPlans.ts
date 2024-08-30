import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const result = await dynamoDb.send(new ScanCommand({ TableName: "Plans" }));
    console.log("DynamoDB Scan result:", JSON.stringify(result, null, 2));

    const plans = result.Items || [];
    console.log("Plans retrieved:", plans);

    return {
      statusCode: 200,
      body: JSON.stringify(plans),
    };
  } catch (error) {
    console.error("Error fetching plans:", JSON.stringify(error, null, 2)); // Detailed error logging

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not fetch plans" }),
    };
  }
}
