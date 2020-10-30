const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  describeTableAsync: async (name) =>
    new Promise((res, rej) => {
      dynamodb.describeTable({ TableName: name }, (err, data) => {
        if (err) {
          return res(undefined);
        }

        return res(data);
      });
    }),
  createTableAsync: async (config) =>
    new Promise((res, rej) => {
      dynamodb.createTable(config, function (err, data) {
        if (err) {
          return rej(err);
        }

        res(data);
      });
    }),

  queryAsync: async (params) =>
    new Promise((res, rej) => {
      documentClient.query(params, function (err, data) {
        if (err) {
          return rej(err);
        }

        res(data);
      });
    }),

  scanAsync: async (params) =>
    new Promise((res, rej) => {
      documentClient.scan(params, function (err, data) {
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
