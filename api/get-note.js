const _ = require('underscore');
const { successResponse, failureResponse, tableName, dynamoDb } = require('./utils');

exports.handler = async (event) => {
  try {
    const noteId = decodeURIComponent(event.pathParameters.note_id);
    const params = {
      TableName: tableName,
      IndexName: 'note_id-index',
      KeyConditionExpression: 'note_id = :note_id',
      ExpressionAttributeValues: {
        ':note_id': noteId,
      },
      Limit: 1
    };

    const data = await dynamoDb.query(params).promise();

    if (!_.isEmpty(data.Items)) {
      return successResponse(data.Items[0], 200);
    } else {
      return failureResponse({ 
        name: 'Not found', 
        message: `Note with id ${noteId} not found`, 
        statusCode: 404 
      });
    }
  } catch (error) {
    console.log('Error', error)
    return failureResponse(error);
  };
}