const dayjs = require('dayjs');
const {
  successResponse,
  failureResponse,
  getUserId,
  getUserName,
  dynamoDb,
  tableName,
} = require('./utils');

exports.handler = async (event) => {
  try {
    const item = JSON.parse(event.body);
    item.user_id = getUserId(event.headers);
    item.user_name = getUserName(event.headers);
    item.expires = dayjs().add(90, 'days').unix();

    await dynamoDb
      .put({
        TableName: tableName,
        Item: item,
        ConditionExpression: '#t = :t',
        ExpressionAttributeNames: {
          '#t': 'timestamp',
        },
        ExpressionAttributeValues: {
          ':t': item.timestamp,
        },
      })
      .promise();

    return successResponse(item, 200);
  } catch (error) {
    console.log('Error', error);
    return failureResponse(error);
  }
};
