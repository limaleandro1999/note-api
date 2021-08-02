const { successResponse, failureResponse, tableName, getUserId, dynamoDb } = require('./utils');

exports.handler = async (event) => {
  try {
    const query = event.queryStringParameters;
    const limit = query?.limit ? parseInt(query.limit) : 5;
    const userId = getUserId(event.headers);

    const params = {
      TableName: tableName,
      KeyConditionExpression: 'user_id = :uid',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
      Limit: limit,
      ScanIndexForward: false,
    };

    const startTimestamp = query?.start ? parseInt(query.start) : 0;

    if (startTimestamp > 0) {
      params.ExclusiveStartKey = {
        user_id: userId,
        timestamp: startTimestamp,
      };
    }

    const data = await dynamoDb.query(params).promise();

    return successResponse(data, 200);
  } catch (error) {
    console.log('Error', error)
    return failureResponse(error);
  };
}