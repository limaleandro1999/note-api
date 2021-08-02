const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

function getResponseHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
  };
}

function successResponse(body, statusCode = 200) {
  return {
    statusCode,
    headers: getResponseHeaders(),
    body: JSON.stringify(body),
  };
}

function failureResponse(error) {
  return {
    statusCode: error.statusCode ? error.statusCode : 500,
    body: JSON.stringify({
      error: error.name ? error.name : 'Exception',
      message: error.message ? error.message : '',
    }),
    headers: getResponseHeaders(),
  }
}

function getUserId(headers) {
  return headers.app_user_id;
}

function getUserName(headers) {
  return headers.app_user_name;
}

module.exports = {
  AWS,
  dynamoDb,
  tableName,
  getResponseHeaders,
  getUserId,
  getUserName,
  successResponse,
  failureResponse,
};
