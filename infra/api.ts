import { addOnsTable, planTable, subscriptionsTable } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [subscriptionsTable, planTable, addOnsTable],
      },
      args: {
        auth: { iam: true },
      },
    },
  },
});

api.route("POST /seedDb", "packages/functions/src/seedDb.main");
api.route("GET /form", "packages/functions/src/plans/getPlans.main");

//
