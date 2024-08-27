import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export async function main(event: any) {
  const dara = JSON.parse(event.body);

  const params = {
    TableName: process.env.SUBSCRIPTIONS_TABLE,
    Item: {
      serId: data.userId,
      planId: data.planId,
      planName: data.planName,
      planPrice: data.planPrice,
      isYearly: data.isYearly,
      addOns: JSON.stringify(data.addOns),
      totalPrice: data.totalPrice,
    },
  };
  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create subscription" }),
    };
  }
}
