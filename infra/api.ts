import { addOnsTable, planTable, subscriptionTable } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [subscriptionTable, planTable, addOnsTable],
      },
      args: {
        auth: { iam: true },
      },
    },
  },
});

api.route("POST /seedDb", "packages/functions/src/seedDb.main");
api.route("GET /planObject", "packages/functions/src/getPlans.main");
api.route(
  "PUT /updateSubscription",
  "packages/functions/src/updateSubscription.main",
);
api.route(
  "GET /getSubscription",
  "packages/functions/src/getSubscription.main",
);
api.route("GET /addOnsObject", "packages/functions/src/getAddOns.main");
