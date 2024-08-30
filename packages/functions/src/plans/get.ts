import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";
import { NextApiRequest, NextApiResponse } from "next";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const command = new ScanCommand({
      TableName: Resource.Plans.name,
    });
    const response = await dynamoDb.send(command);

    const plans = response.Items?.map((item) => ({
      planId: item.planId,
      planName: item.planName,
      planPriceYearly: item.planPriceYearly,
      planPriceMonthly: item.planPriceMonthly,
      planIcon: item.planIcon,
    }));

    res.status(200).json({ plans });
  } catch (error) {
    console.error("Error fetching plans from DynamoDB", error);
    res.status(500).json({ message: "internal server error" });
  }
}
