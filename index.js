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
  // Decision logic establishing how to respond to mentions
  const isCreate = utils.isCmd('create', text);
  const isAssign = utils.isCmd('assign', text);
  const isWho = utils.isCmd('who', text);
  const isAbout = utils.isCmd('about', text);
  const isClear = utils.isCmd('clear', text);
  const isDelete = utils.isCmd('delete', text);
  const isHelp = utils.isCmd('help', text);
  const isList = utils.isCmd('list', text);
  const testMessage = utils.isCmd('message', text);
  const isMessage = 
    testMessage && 
    !isCreate && 
    !isAssign && 
    !isWho && 
    !isAbout && 
    !isClear && 
    !isDelete;
  const didntUnderstand =
    !testMessage &&
    !isCreate &&
    !isAssign &&
    !isWho &&
    !isAbout &&
    !isClear &&
    !isDelete &&
    !isHelp &&
    !isList &&
    !isMessage;

  console.log(isCreate, isAssign, isWho, isAbout, isClear, isDelete, isHelp, isList, isMessage);

  //-- @rota "[rotation-name]" create [description]
  if (isCreate) {
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
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota "[rotation]" delete
  if (isDelete) {
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
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota "[rotation]" about
  if (isAbout) {
    try {
      const pCmd = utils.parseCmd('about', event, context);
      const rotation = pCmd.rotation;

      if (rotation in store.getStoreList()) {
        // If rotation exists, display its information
        const rotationObj = store.getRotation(rotation);
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.aboutReport(rotation, rotationObj.description, rotationObj.assigned)
        });
      } else {
        // If rotation doesn't exist, send message saying nothing changed
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.aboutError(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota "[rotation]" assign [@user]
  if (isAssign) {
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
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota "[rotation]" who
  if (isWho) {
    try {
      const pCmd = utils.parseCmd('who', event, context);
      const rotation = pCmd.rotation;

      if (rotation in store.getStoreList()) {
        // If rotation exists, display its information
        const rotationObj = store.getRotation(rotation);
        if (!!rotationObj.assigned) {
          // If someone is currently assigned, report who
          const result = await app.client.chat.postMessage({
            token: botToken,
            channel: channelID,
            text: msgText.whoReport(rotationObj.assigned, rotation)
          });
        } else {
          // If nobody is assigned
          const result = await app.client.chat.postMessage({
            token: botToken,
            channel: channelID,
            text: msgText.whoUnassigned(rotation)
          });
        }
      } else {
        // If rotation doesn't exist, send message saying nothing changed
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.whoError(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota "[rotation]" clear
  if (isClear) {
    try {
      const pCmd = utils.parseCmd('clear', event, context);
      const rotation = pCmd.rotation;

      if (rotation in store.getStoreList()) {
        const rotationObj = store.getRotation(rotation);
        // If rotation exists, check if someone is assigned
        if (!!rotationObj.assigned) {
          // If someone is currently assigned, clear
          store.saveAssignment(rotation, null);
          const result = await app.client.chat.postMessage({
            token: botToken,
            channel: channelID,
            text: msgText.clearConfirm(rotation)
          });
        } else {
          // If nobody is assigned
          const result = await app.client.chat.postMessage({
            token: botToken,
            channel: channelID,
            text: msgText.clearNoAssignment(rotation)
          });
        }
      } else {
        // If rotation doesn't exist, send message saying nothing changed
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          text: msgText.clearError(rotation)
        });
      }
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota list
  if (isList) {
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
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota help
  if (isHelp) {
    try {
      const result = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        blocks: helpBlocks
      });
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
    }
  }

  //-- @rota didn't understand the message
  if (didntUnderstand) {
    try {
      const result = await app.client.chat.postMessage({
        token: botToken,
        channel: channelID,
        text: msgText.didntUnderstand()
      });
    }
    catch (err) {
      console.error(err);
      const errResult = await app.client.chat.postMessage(
        utils.errorMsgObj(botToken, channelID, msgText.error(err))
      );
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
