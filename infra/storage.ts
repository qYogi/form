
export const table = new sst.aws.Dynamo("Form", {
    fields:{
        userId: "string",
    },
    primaryIndex: {hashKey: "userId"}
})