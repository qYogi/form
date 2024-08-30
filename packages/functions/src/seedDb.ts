import { Resource } from "sst";
import { APIGatewayProxyEvent } from "aws-lambda";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(event: APIGatewayProxyEvent) {
  const seededPlans = await seedPlans();
  const seededAddons = await seedAddons();

  return JSON.stringify({
    seededPlans,
    seededAddons,
  });
}

async function seedAddons() {
  const addons = [
    {
      addOnId: "1",
      addOnTitle: "Addon 1",
      addOnDescription: "Addon 1 Description",
      addOnMonthlyPrice: 10,
      addOnYearlyPrice: 100,
    },
    {
      addOnId: "2",
      addOnTitle: "Addon 2",
      addOnDescription: "Addon 2 Description",
      addOnMonthlyPrice: 20,
      addOnYearlyPrice: 200,
    },
    {
      addOnId: "3",
      addOnTitle: "Addon 3",
      addOnDescription: "Addon 3 Description",
      addOnMonthlyPrice: 30,
      addOnYearlyPrice: 300,
    },
  ];

  const existingAddons = await dynamoDb.send(
    new ScanCommand({ TableName: Resource.AddOns.name }),
  );

  if (existingAddons.Items?.length) {
    return false;
  }

  const createAddonPromises = addons.map((addon) => {
    return new Promise((resolve) => {
      dynamoDb
        .send(new PutCommand({ TableName: Resource.AddOns.name, Item: addon }))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  });

  await Promise.all(createAddonPromises);

  return true;
}

async function seedPlans() {
  const plans = [
    {
      planId: "1",
      planName: "Arcade",
      planPriceYearly: 90,
      planPriceMonthly: 9,
      planIcon: "ArcadeIcon",
    },
    {
      planId: "2",
      planName: "Advanced",
      planPriceYearly: 120,
      planPriceMonthly: 12,
      planIcon: "AdvancedIcon",
    },
    {
      planId: "3",
      planName: "Pro",
      planPriceYearly: 150,
      planPriceMonthly: 15,
      planIcon: "ProIcon",
    },
  ];

  const existingPlans = await dynamoDb.send(
    new ScanCommand({ TableName: Resource.Plans.name }),
  );

  if (existingPlans.Items?.length) {
    return false;
  }

  const createPlanPromises = plans.map((plan) => {
    return new Promise((resolve) => {
      dynamoDb
        .send(new PutCommand({ TableName: Resource.Plans.name, Item: plan }))
        .then(() => resolve(true))
        .catch(() => resolve(false));
    });
  });

  await Promise.all(createPlanPromises);

  return true;
}
