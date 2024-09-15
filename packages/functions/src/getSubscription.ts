import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { use } from "@serverless-stack/resources";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const userId =
      event.requestContext.authorizer?.iam.cognitoIdentity.identityId;

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userId" }),
      };
    }

    const subscriptionQueryResponse = await dynamoDb.send(
      new QueryCommand({
        TableName: Resource.Subscription.name, // Make sure this is correctly set for your table
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      }),
    );

    const subscriptions = subscriptionQueryResponse.Items || [];

    const userSubscription = subscriptions[0];

    if (!userSubscription) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Subscription not found" }),
      };
    }

    const planId = userSubscription.planId;

    const plansQueryResponse = await dynamoDb.send(
      new QueryCommand({
        TableName: Resource.Plans.name, // Make sure this is correctly set for your table
        KeyConditionExpression: "planId = :planId",
        ExpressionAttributeValues: {
          ":planId": planId,
        },
      }),
    );

    const plans = plansQueryResponse.Items || [];

    const userPlan = plans[0];

    const addonIds = JSON.parse(userSubscription.addOnIds);

    const userAddons = [];

    for (let i = 0; i < addonIds.length; i++) {
      const addOnId = addonIds[i];
      const addOnQueryResponse = await dynamoDb.send(
        new QueryCommand({
          TableName: Resource.AddOns.name, // Make sure this is correctly set for your table
          KeyConditionExpression: "addOnId = :addOnId",
          ExpressionAttributeValues: {
            ":addOnId": addOnId,
          },
        }),
      );

      const addOnItems = addOnQueryResponse.Items || [];
      const addOn = addOnItems[0];
      userAddons.push(addOn);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...userSubscription,
        plan: userPlan,
        addOns: userAddons,
      }),
    };
  } catch (error) {
    console.error("Error fetching addOns:", JSON.stringify(error, null, 2)); // Detailed error logging

    return {
      statusCode: 404,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
}
