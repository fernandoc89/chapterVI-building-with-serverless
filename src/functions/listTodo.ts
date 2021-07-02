import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler =  async (event) => {
  // http:url/nomedafunction/iddouser
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  const userTodos = response.Items[0];

  if(userTodos) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: response.Items,
      }),
      headers: {
        "Content-Type": "application/json"
      },
    };
  }

  return { 
    statusCode: 400,
      body: JSON.stringify({
        message: "Not found todos for this user",
     }),
  };
}