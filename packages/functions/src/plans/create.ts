import { Resource } from "sst";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function main(event: APIGatewayProxyEvent) {
  const params = {
    TableName: Resource.Plans.name,
    Item: {
      planId: "1",
      planName: "Arcade",
      planPriceYearly: 100,
      planPriceMonthly: 12,
      planIcon: "Arcade Icon",
    },
  };

  await dynamoDb.send(new PutCommand(params));
  return JSON.stringify(params.Item);
}

// import * as uuid from "uuid";
// import { Resource } from "sst";
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import { APIGatewayProxyEvent } from "aws-lambda";
// import { z } from "zod";
//
// const planSchema = z.object({
//   planName: z.string(),
//   planPriceYearly: z.number().max(100000),
//   planPriceMonthly: z.number().max(100000),
//   planIcon: z.string(),
// });
//
// const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
//
// export async function main(event: APIGatewayProxyEvent) {
//   if (!event.body) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: "No request body provided" }),
//     };
//   }
//
//   const data = JSON.parse(event.body);
//
//   const validationResult = planSchema.safeParse(data);
//
//   if (!validationResult.success) {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ message: validationResult.error.errors }),
//     };
//   }
//
//   const validPlanData = validationResult.data;
//
//   const params = {
//     TableName: Resource.Plans.name,
//     Item: {
//       planId: uuid.v1(),
//       ...validPlanData,
//     },
//   };
//
//   await dynamoDb.send(new PutCommand(params));
//
//   return JSON.stringify(params.Item);
// }
