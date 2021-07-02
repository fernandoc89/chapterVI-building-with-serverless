import { document } from "../utils/dynamodbClient";
import { v4 as uuidV4 } from "uuid";
import * as dayjs from "dayjs";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handle = async (event) => {
  const { id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id
      },
    })
    .promise();

  const userAlreadyExists = response.Items[0];

  if (!userAlreadyExists) {
    await document.put({
      TableName: "todos",
      Item: {
        idTodo: uuidV4(),
        id,
        title,
        done: false,
        deadline: dayjs(deadline).format("DD/MM/YYYY"),
      }
    })
      .promise();
  }

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo created",
      content: response.Items,
    }),
    headers: {
      "Content-type": 'application/json'
    },
  }
}