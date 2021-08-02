const dayjs = require('dayjs');
const uuid = require('uuid');
const {
  successResponse,
  failureResponse,
  getUserId,
  dynamoDb,
  tableName,
  getUserName,
} = require('./utils');

exports.handler = async (event) => {
  try {
    const item = JSON.parse(event.body);
    item.user_id = getUserId(event.headers);
    item.user_name = getUserName(event.headers);
    item.note_id = `${item.user_id}:${uuid.v4()}`;
    item.timestamp = dayjs().unix();
    item.expires = dayjs().add(90, 'days').unix();

    await dynamoDb
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();

    return successResponse(item, 200);
  } catch (error) {
    console.log('Error', error);
    return failureResponse(error);
  }
};
