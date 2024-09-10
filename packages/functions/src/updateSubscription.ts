import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { APIGatewayProxyEvent } from "aws-lambda";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(event: APIGatewayProxyEvent) {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const { planId, subscriptionType, addOnIds, isActive, startedDate } =
      JSON.parse(event.body || "{}");

    const userId =
      event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

    //update command for specific fiekds
    const result = await dynamoDb.send(
      new UpdateCommand({
        TableName: Resource.Subscription.name,
        Key: { userId },
        UpdateExpression:
          "SET planId = :planId, subscriptionType = :subscriptionType, addOnIds = :addOnIds, startedDate = :startedDate, isActive = :isActive",
        ExpressionAttributeValues: {
          ":planId": planId,
          ":subscriptionType": subscriptionType,
          ":addOnIds": addOnIds,
          ":startedDate": startedDate,
          ":isActive": isActive,
        },
        returnValues: "ALL_NEW",
      }),
    );

    console.log("DynamoDB Post result:", JSON.stringify(result, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(
      "Error creating subscription:",
      JSON.stringify(error, null, 2),
    );

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create subscription" }),
    };
  }
}
