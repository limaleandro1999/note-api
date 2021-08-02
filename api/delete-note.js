const {
  successResponse,
  failureResponse,
  tableName,
  getUserId,
  dynamoDb,
} = require('./utils');

exports.handler = async (event) => {
  try {
    const timestamp = parseInt(event.pathParameters.timestamp);
    const params = {
      TableName: tableName,
      Key: {
        user_id: getUserId(event.headers),
        timestamp,
      },
    };

    await dynamoDb.delete(params).promise();

    return successResponse({}, 200);
  } catch (error) {
    console.log('Error', error);
    return failureResponse(error);
  }
};
