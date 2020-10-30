const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

const { v4: uuidv4 } = require('uuid');
const utils = require('./utils');
const faker = require('faker');

(async () => {
  try {
    console.log('Inseting fake data');

    const emails = Array(5)
      .fill(true)
      .map((_) => faker.internet.email());

    const notes = Array(30).fill(true);

    for (_ of notes) {
      await utils.putAsync({
        TableName: 'user-notes',
        Item: {
          user: emails[faker.random.number(4)],
          created_date: faker.date.past().toISOString(),
          text: faker.lorem.sentence(),
          id: uuidv4(),
        },
      });
    }

    for (email of emails) {
      await utils.putAsync({
        TableName: 'token-email-lookup',
        Item: {
          email,
          token: faker.random.number(10000000, 99999999).toString(),
        },
      });
    }
  } catch (e) {
    console.log('e', e);
  }
})();
