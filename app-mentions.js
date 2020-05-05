const utils = require('./utils/utils');
const helpBlocks = require('./bot-response/blocks-help');
const msgText = require('./bot-response/message-text');
// Commands
const cmdNew = require('./app-mentions/new');
const cmdStaff = require('./app-mentions/staff');
const cmdResetStaff = require('./app-mentions/reset-staff');
const cmdDelete = require('./app-mentions/delete');
const cmdAbout = require('./app-mentions/about');
const cmdAssign = require('./app-mentions/assign');
const cmdAssignNext = require('./app-mentions/assign-next');
const cmdWho = require('./app-mentions/who');
const cmdUnassign = require('./app-mentions/unassign');
const cmdList = require('./app-mentions/list');
const cmdHelp = require('./app-mentions/help');
const cmdMessage = require('./app-mentions/message');

/*------------------
    APP MENTIONS
------------------*/
const app_mentions = (app, store) => {
  app.event('app_mention', async({ event, context }) => {
    // Gather event and context info
    const text = event.text;                      // raw text from the mention
    const sentByUserID = event.user;              // ID of user who sent the message
    const channelID = event.channel;              // channel ID
    const botToken = context.botToken;
    // Get rotations list
    const rotaList = await store.getRotations();

    const ec = {
      text: event.text,                           // raw text from the mention
      sentByUserID: event.user,                   // ID of user who sent the message
      channelID: event.channel,                   // channel ID
      botToken: context.botToken,                 // bot access token
      rotaList: await store.getRotations()        // rotations in db
    }

    // Decision logic establishing how to respond to mentions
    const isNew = utils.isCmd('new', text);
    const isStaff = utils.isCmd('staff', text);
    const isResetStaff = utils.isCmd('reset staff', text);
    const isAssign = utils.isCmd('assign', text);
    const isAssignNext = utils.isCmd('assign next', text);
    const isWho = utils.isCmd('who', text);
    const isAbout = utils.isCmd('about', text);
    const isUnassign = utils.isCmd('unassign', text);
    const isDelete = utils.isCmd('delete', text);
    const isHelp = utils.isCmd('help', text);
    const isList = utils.isCmd('list', text);
    const testMessage = utils.isCmd('message', text);
    const isMessage =
      testMessage &&
      !isNew &&
      !isStaff && !text.includes('" staff <@')  // catch malformed staff commands (less robust regex)
      !isResetStaff &&
      !isAssign &&
      !isAssignNext &&
      !isWho &&
      !isAbout &&
      !isUnassign &&
      !isDelete;
    const didntUnderstand =
      !isNew &&
      !isStaff && !text.includes('" staff <@')
      !isResetStaff &&
      !isAssign &&
      !isAssignNext &&
      !isWho &&
      !isAbout &&
      !isUnassign &&
      !isDelete &&
      !isHelp &&
      !isList &&
      !isMessage;

    /*--
      NEW
      @rota new "[rotation-name]" [optional description]
      Creates a new rotation with description
    --*/
    if (isNew) {
      cmdNew(app, event, context, ec, utils, store, msgText);
    }

    /*--
      STAFF
      @rota "[rotation-name]" staff [@user @user @user]
      Staffs a rotation by passing a space-separated list of users
      Also allows comma-separated lists; fairly robust against extra spaces/commas
    --*/
    else if (isStaff) {
      cmdStaff(app, event, context, ec, utils, store, msgText);
    }

    /*--
      RESET STAFF
      @rota "[rotation]" reset staff
      Removes rotation staff
    --*/
    else if (isResetStaff) {
      cmdResetStaff(app, event, context, ec, utils, store, msgText);
    }

    /*--
      DELETE
      @rota "[rotation]" delete
      Deletes an existing rotation
    --*/
    else if (isDelete) {
      cmdDelete(app, event, context, ec, utils, store, msgText);
    }

    /*--
      ABOUT
      @rota "[rotation]" about
      Provides description and assignment for specified rotation
    --*/
    else if (isAbout) {
      cmdAbout(app, event, context, ec, utils, store, msgText);
    }

    /*--
      ASSIGN
      @rota "[rotation]" assign [@user] [handoff message]
      Assigns a user to specified rotation
    --*/
    else if (isAssign) {
      cmdAssign(app, event, context, ec, utils, store, msgText);
    }

    /*--
      ASSIGN NEXT
      @rota "[rotation]" assign next [handoff message]
      Assigns next user in staff list to rotation
    --*/
    else if (isAssignNext) {
      cmdAssignNext(app, event, context, ec, utils, store, msgText);
    }

    /*--
      WHO
      @rota "[rotation]" who
      Reports who the assigned user is for a rotation
    --*/
    else if (isWho) {
      cmdWho(app, event, context, ec, utils, store, msgText);
    }

    /*--
      UNASSIGN
      @rota "[rotation]" unassign
      Clears the assignment for a rotation
    --*/
    else if (isUnassign) {
      cmdUnassign(app, event, context, ec, utils, store, msgText);
    }

    /*--
      LIST
      @rota list
      Lists all rotations, descriptions, and assignments
    --*/
    else if (isList) {
      try {
        // If the store is not empty
        if (rotaList && rotaList.length) {
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.listReport(rotaList))
          );
        } else {
          // If store is empty
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.listEmpty())
          );
        }
      }
      catch (err) {
        console.error(err);
        const errResult = await app.client.chat.postMessage(
          utils.msgConfig(botToken, channelID, msgText.error(err))
        );
      }
    }

    /*--
      HELP
      @rota help
      Provides instructions on how to use Rota
    --*/
    else if (isHelp) {
      try {
        const result = await app.client.chat.postMessage({
          token: botToken,
          channel: channelID,
          blocks: helpBlocks()
        });
      }
      catch (err) {
        console.error(err);
        const errResult = await app.client.chat.postMessage(
          utils.msgConfig(botToken, channelID, msgText.error(err))
        );
      }
    }

    /*--
      (MESSAGE)
      @rota "[rotation]" free form message for on-call user
      Send message to on-call user via DM with link to channel
    --*/
    else if (isMessage) {
      try {
        const pCmd = utils.parseCmd('message', event, context);
        const rotation = pCmd.rotation;
        // Check if rotation exists
        if (utils.rotationInList(rotation, rotaList)) {
          const rotationObj = await store.getRotation(rotation);
          const oncallUser = rotationObj.assigned;
          
          if (!!oncallUser) {
            // If someone is assigned to concierge...
            const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${channelID}/p${event.ts.replace('.', '')}`;
            const oncallUserDMChannel = utils.getUserID(oncallUser);
            // Send DM to on-call user notifying them of the message that needs their attention
            const sendDM = await app.client.chat.postMessage(
              utils.msgConfig(botToken, oncallUserDMChannel, msgText.dmToAssigned(rotation, sentByUserID, channelID, link))
            );
            // Send message to the channel where help was requested notifying that assigned user was contacted
            const sendChannelMsg = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.confirmChannelMsg(rotation, sentByUserID))
            );
            if (sentByUserID !== 'USLACKBOT') {
              // Send ephemeral message (only visible to sender) telling them what to do if urgent
              // Do nothing if coming from a slackbot
              const sendEphemeralMsg = await app.client.chat.postEphemeral(
                utils.msgConfigEph(botToken, channelID, sentByUserID, msgText.confirmEphemeralMsg(rotation))
              );
            }
          } else {
            // Rotation is not assigned; give instructions how to assign
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.nobodyAssigned(rotation))
            );
          }
        } else {
          // Rotation doesn't exist
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.msgError(rotation))
          );
        }
      }
      catch (err) {
        console.error(err);
        const errResult = await app.client.chat.postMessage(
          utils.msgConfig(botToken, channelID, msgText.error(err))
        );
      }
    }

    /*--
      (OTHER)
      @rota [other]
      Rota didn't recognize the format of the mention text
    --*/
    else if (didntUnderstand) {
      try {
        const result = await app.client.chat.postMessage(
          utils.msgConfig(botToken, channelID, msgText.didntUnderstand())
        );
      }
      catch (err) {
        console.error(err);
        const errResult = await app.client.chat.postMessage(
          utils.msgConfig(botToken, channelID, msgText.error(err))
        );
      }
    }
  });
}

module.exports = app_mentions;