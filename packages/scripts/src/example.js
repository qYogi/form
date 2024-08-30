const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-north-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const plans = [
  {
    planId: "1",
    planName: "Arcade",
    planPriceYearly: 120,
    planPriceMonthly: 12,
    planIcon: "ArcadeIcon",
  },
  {
    planId: "2",
    planName: "Advanced",
    planPriceYearly: 240,
    planPriceMonthly: 24,
    planIcon: "AdvancedIcon",
  },
  {
    planId: "3",
    planName: "Pro",
    planPriceYearly: 360,
    planPriceMonthly: 36,
    planIcon: "ProIcon",
  },
];

const addPlans = async () => {
  for (const plan of plans) {
    const params = {
      TableName: "Plans", // Make sure this matches your table name
      Item: plan,
    };

    try {
      await dynamoDb.put(params).promise();
      console.log(`Added ${plan.planName} to the Plans table`);
    } catch (error) {
      console.error(`Error adding plan ${plan.planName}:`, error);
    }
  }
};

addPlans();
