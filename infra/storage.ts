import { StackContext, Table } from "@serverless-stack/resources";

export function StorageStack({ stack }: StackContext) {
  const subscriptionsTable = new Table(stack, "Subscriptions", {
    fields: {
      userId: "string",
      planId: "string",
      planName: "string",
      planPrice: "number",
      isYearly: "number",
      addOns: "string",
      totalPrice: "number",
    },
    primaryIndex: { partitionKey: "userId" },
  });
}

export const table = new sst.aws.Dynamo("Form", {
  fields: {
    userId: "string",
  },
  primaryIndex: { hashKey: "userId" },
});
