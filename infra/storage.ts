//1 Req la tabela subs
//2 Extrag plan Id is add Ids, trag planul corespunzator Id-ului,
//3 Same for add-ons

//2 more tabels AddOns and Plans
//
// export const table = new sst.aws.Dynamo("Form", {
//   fields: {
//     userId: "string",
//   },
//   primaryIndex: { hashKey: "userId" },
// });

export const subscriptionTable = new sst.aws.Dynamo("Subscription", {
  fields: {
    userId: "string",
    planId: "string",
    subscriptionType: "string",
    addOnIds: "string",
    isActive: "string",
    startedDate: "string",
  },
  primaryIndex: { hashKey: "userId" },
  globalIndexes: {
    planIdIndex: { hashKey: "planId" },
    addOnIdsIndex: { hashKey: "addOnIds" },
    subscriptionTypeIndex: { hashKey: "subscriptionType" },
    startedDateIndex: { hashKey: "startedDate" },
    isActiveIndex: { hashKey: "isActive" },
  },
});

export const planTable = new sst.aws.Dynamo("Plans", {
  fields: {
    planId: "string",
    planName: "string",
    planPriceYearly: "number",
    planPriceMonthly: "number",
    planIcon: "string",
  },
  primaryIndex: { hashKey: "planId", rangeKey: "planName" },
  globalIndexes: {
    planPriceMonthlyIndex: { hashKey: "planPriceMonthly" },
    planPriceYearlyIndex: { hashKey: "planPriceYearly" },
    planIconIndex: { hashKey: "planIcon" },
  },
});

export const addOnsTable = new sst.aws.Dynamo("AddOns", {
  fields: {
    addOnId: "string",
    addOnTitle: "string",
    addOnDescription: "string",
    addOnMonthlyPrice: "number",
    addOnYearlyPrice: "number",
  },
  primaryIndex: { hashKey: "addOnId", rangeKey: "addOnTitle" },
  globalIndexes: {
    addOnDescriptionIndex: { hashKey: "addOnDescription" },
    addOnMonthlyPriceIndex: { hashKey: "addOnMonthlyPrice" },
    addOnYearlyPriceIndex: { hashKey: "addOnYearlyPrice" },
  },
});
