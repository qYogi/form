/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "form",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },



  async run() {
    await import("./infra/storage");
    //const api = await import("./infra/api");
    const auth = await import("./infra/auth");
    await import("./infra/web");


    return {
      UserPool: auth.userPool.id,
      Region: aws.getRegionOutput().name,
      IdentityPool: auth.identityPool.id,
      UserPoolClient: auth.userPoolClient.id,
    };
  },
});
