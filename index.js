require('dotenv').config();
// Bolt package (github.com/slackapi/bolt)
const { App } = require('@slack/bolt');
// Utility functions
const utils = require('./utils/utils');
// Reading / writing to filesystem store
const store = require('./utils/filesys');
// Bot responses
const helpBlocks = require('./bot-response/blocks-help');
const msgText = require('./bot-response/message-text');

// Create Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;

// Check if store exists; if not, create it
store.initStore();

/*------------------
    APP MENTIONS
------------------*/
app.event('app_mention', async({ event, context }) => {
  // Gather applicable info
  const text = event.text;                     // raw text from the message mentioning @concierge
  const sentByUserID = event.user;             // ID of user who sent the message
  const channelID = event.channel;             // channel ID
  const botToken = context.botToken;

  //-- @rota "[rotation-name]" create [description]
  if (utils.isCmd('create', text)) {
    try {
      const pCmd = utils.parseCmd('create', event, context);
      const rotation = pCmd.rotation;
      const description = pCmd.params;

      if (rotation in store.getStoreList()) {
        // Can't create a rotation that already exists
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.createError(rotation)
        });
      } else {
        // Initialize a new rotation with description
        store.createRotation(rotation, description);
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.createConfirm(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        text: msgText.error(err)
      });
    }
  }

  //-- @rota "[rotation]" delete
  else if (utils.isCmd('delete', text)) {
    try {
      const pCmd = utils.parseCmd('delete', event, context);
      const rotation = pCmd.rotation;

      if (rotation in store.getStoreList()) {
        // If rotation exists, delete from store completely
        store.deleteRotation(rotation);
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.deleteConfirm(rotation)
        });
      } else {
        // If rotation doesn't exist, send message saying nothing changed
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.deleteError(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        text: msgText.error(err)
      });
    }
  }

  //-- @rota "[rotation]" assign [@user]
  else if (utils.isCmd('assign', text)) {
    try {
      const pCmd = utils.parseCmd('assign', event, context);
      const rotation = pCmd.rotation;
      const usermention = pCmd.params;

      if (rotation in store.getStoreList()) {
        // Assign user in store
        store.saveAssignment(rotation, usermention);
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.assignConfirm(usermention, rotation)
        });
      } else {
        // If rotation doesn't exist, send message saying so
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.assignError(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        text: msgText.error(err)
      });
    }
  }

  //-- @rota list
  else if (utils.isCmd('list', text)) {
    const list = store.getStoreList();
    try {
      // If the store is not empty
      if (Object.keys(list).length !== 0 && list.constructor === Object) {
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.listReport(list)
        });
      } else {
        // If store is empty
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.listEmpty()
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        text: msgText.error(err)
      });
    }
  }

  // Log useful things
  console.log('Event: ', event);
});

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Concierge is running on ${port}!`);
})();
