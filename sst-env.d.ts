/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "AddOns": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Api": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "Frontend": {
      "type": "sst.aws.StaticSite"
      "url": string
    }
    "IdentityPool": {
      "id": string
      "type": "sst.aws.CognitoIdentityPool"
    }
    "Plans": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "Subscriptions": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "UserPool": {
      "id": string
      "type": "sst.aws.CognitoUserPool"
    }
    "UserPoolClient": {
      "id": string
      "secret": string
      "type": "sst.aws.CognitoUserPoolClient"
    }
  }
}
export {}
