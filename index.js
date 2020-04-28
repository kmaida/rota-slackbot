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
// app.event('app_mention', async({ event, context }) => {
//   // Gather applicable info
//   const text = event.text;                           // raw text from the message mentioning @concierge
//   const sentByUser = event.user;                     // ID of user who sent the message
//   const channel = event.channel;                     // channel ID
//   const channelMsgFormat = `<#${channel}>`;          // channel formatted for in-message display
//   const botToken = context.botToken;

//   //-- "rotaname" assign [@user]
//   if (utils.isAssign(event, context)) {
//     try {
//       const assigned = utils.getAssignmentMsgTxt(text);
//       store.saveAssignment(rotation, assigned);
//       // Post message to channel confirming concierge assignment
//       const result = await app.client.chat.postMessage({
//         token: botToken,
//         channel: channel,
//         text: msgText.confirmAssignment(assigned, channelMsgFormat)
//       });
//     }
//     catch (err) {
//       console.error(err);
//       const errorResult = await app.client.chat.postMessage({
//         token: botToken,
//         channel: channel,
//         text: msgText.errorAssignment(err)
//       });
//     }
//   }

//   //-- "who" is the concierge for this channel?
//   else if (utils.matchSimpleCommand('who', event, context)) {
//     try {
//       const conciergeNameMsgFormat = store.getAssignment(channel);

//       if (conciergeNameMsgFormat) {
//         const result = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.reportWho(conciergeNameMsgFormat, channelMsgFormat)
//         });
//       } else {
//         const result = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.reportWhoUnassigned(channelMsgFormat)
//         });
//       }
//     }
//     catch (err) {
//       console.error(err);
//       const errorResult = await app.client.chat.postMessage({
//         token: botToken,
//         channel: channel,
//         text: msgText.errorWho(err)
//       });
//     }
//   }

//   //-- "clear" currently assigned concierge for channel
//   if (utils.matchSimpleCommand('clear', event, context)) {
//     try {
//       const list = store.getStoreList();
//       if (list[channel]) {
//         // If there is an existing concierge for this channel, clear it
//         store.clearAssignment(channel);
//         const result = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.confirmClear(channelMsgFormat)
//         });
//       } else {
//         // If there's no concierge, send a message saying nothing changed
//         const result = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.clearNoAssignment()
//         });
//       }
//     }
//     catch (err) {
//       console.error(err);
//       const errorResult = await app.client.chat.postMessage({
//         token: botToken,
//         channel: channel,
//         text: msgText.errorClear(err)
//       });
//     }
//   }

//   //-- "help"
//   else if (utils.matchSimpleCommand('help', event, context)) {
//     // Send blocks with details on usage of concierge bot
//     const result = await app.client.chat.postMessage({
//       token: botToken,
//       channel: channel,
//       blocks: helpBlocks(channelMsgFormat)
//     });
//   }

//   //-- "@concierge [message]" sends DM to concierge, notifies channel, and notifies sender via ephemeral
//   else if (
//     !utils.matchSimpleCommand('who', event, context) && 
//     !utils.isAssign(event, context) && 
//     !utils.matchSimpleCommand('help', event, context) && 
//     !utils.matchSimpleCommand('clear', event, context)
//   ) {
//     try {
//       const oncallUser = store.getAssignment(channel);
//       if (oncallUser) {
//         // If someone is assigned to concierge...
//         const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${channel}/p${event.ts.replace('.', '')}`;
//         // Send DM to the concierge notifying them of the message that needs their attention
//         const sendDM = await app.client.chat.postMessage({
//           token: botToken,
//           channel: oncallUser.replace('<@', '').replace('>', ''), // User ID as channel sends a DM
//           text: msgText.dmToConcierge(sentByUser, channelMsgFormat, link)
//         });
//         // Send message to the channel where help was requested notifying that concierge was contacted
//         const sendChannelMsg = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.confirmChannelConciergeMsg(channelMsgFormat, sentByUser)
//         });
//         // Send ephemeral message (only visible to sender) telling them what to do if urgent
//         const sendEphemeralMsg = await app.client.chat.postEphemeral({
//           token: botToken,
//           channel: channel,
//           user: sentByUser,
//           text: msgText.confirmEphemeralConciergeMsg()
//         });
//       } else {
//         // No concierge is assigned; give instructions how to assign
//         const result = await app.client.chat.postMessage({
//           token: botToken,
//           channel: channel,
//           text: msgText.noConciergeAssigned(channelMsgFormat)
//         });
//       }
//     }
//     catch (err) {
//       console.error(err);
//       const errorResult = await app.client.chat.postMessage({
//         token: botToken,
//         channel: channel,
//         text: msgText.errorContactingConcierge(err)
//       });
//     }
//   }

//   // Log useful things
//   console.log('Event: ', event);
// });

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Concierge is running on ${port}!`);
})();
