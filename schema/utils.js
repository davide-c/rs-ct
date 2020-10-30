const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  createTableAsync: async (config) =>
    new Promise((res, rej) => {
      dynamodb.createTable(config, function (err, data) {
        if (err) {
          return rej(err);
        }

        res(data);
      });
    }),

  putAsync: async (params) =>
    new Promise((res, rej) => {
      documentClient.put(params, function (err, data) {
        if (err) {
          return rej(err);
        }

        res(data);
      });
    }),
};
