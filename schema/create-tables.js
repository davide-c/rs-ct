const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

const userNotesSchema = require('./user-notes');
const tokenEmailLookupSchema = require('./token-email-lookup');
const utils = require('./utils');

(async () => {
  try {
    await utils.createTableAsync(userNotesSchema);
    await utils.createTableAsync(tokenEmailLookupSchema);
  } catch (e) {
    console.log('e', e);
  }
})();
