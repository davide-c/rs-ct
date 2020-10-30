'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });
const dynamoDBClient = new AWS.DynamoDB.DocumentClient();

function getToken(authHeader) {
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1].length) {
    throw new Error('Malformed token', { statusCode: 400 });
  }

  return parts[1];
}

async function authenticateUser(headers) {
  if (typeof headers['Authentication'] === 'undefined') {
    throw new Error('Missing auth token', { statusCode: 400 });
  }

  const authenticationHeader = headers['Authentication'];

  const token = getToken(authenticationHeader);

  return await getAuthenticatedUserEmail(token);
}

async function getAuthenticatedUserEmail(token) {
  const params = {
    TableName: 'token-email-lookup',
    FilterExpression: '#t = :t',
    ExpressionAttributeNames: {
      '#t': 'token',
    },
    ExpressionAttributeValues: {
      ':t': token,
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDBClient.scan(params, function (err, data) {
      if (err) {
        return reject(err);
      }

      if (data.Count === 0) {
        return reject(
          Object.assign(new Error('Invalid token.'), {
            statusCode: 403,
          })
        );
      }

      resolve(data.Items[0].email);
    });
  });
}

async function queryUserNotes(userEmail) {
  const params = {
    TableName: 'user-notes',
    KeyConditionExpression: '#u = :u',
    ExpressionAttributeNames: {
      '#u': 'user',
    },
    ExpressionAttributeValues: {
      ':u': userEmail,
    },
  };

  return new Promise((resolve, reject) => {
    dynamoDBClient.query(params, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data.Items);
    });
  });
}

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  },
  body,
});

module.exports.handler = async (event, context, callback) => {
  const { headers } = event;

  try {
    const userEmail = await authenticateUser(headers);
    const result = await queryUserNotes(userEmail);
    callback(null, response(200, JSON.stringify(result)));
  } catch (e) {
    console.log('E', e.statusCode, e.message);
    callback(
      null,
      response(e.statusCode, JSON.stringify({ errorMessage: e.message }))
    );
  }
};
