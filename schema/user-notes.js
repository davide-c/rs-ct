module.exports = {
  TableName: 'user-notes',
  KeySchema: [
    { AttributeName: 'user', KeyType: 'HASH' },
    { AttributeName: 'created_date', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'user', AttributeType: 'S' },
    { AttributeName: 'created_date', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};
