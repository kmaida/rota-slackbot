const utils = require('./utils/utils');
const helpBlocks = require('./bot-response/blocks-help');
const msgText = require('./bot-response/message-text');

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
    const rotaList = store.getRotations();
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
      try {
        const pCmd = utils.parseCmd('new', event, context);
        const rotation = pCmd.rotation;
        const description = pCmd.description;

        if (utils.rotationInList(rotation, rotaList)) {
          // Can't create a rotation that already exists
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.newError(rotation))
          );
        } else {
          // Initialize a new rotation with description
          store.newRotation(rotation, description);
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.newConfirm(rotation))
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
      STAFF
      @rota "[rotation-name]" staff [@user @user @user]
      Staffs a rotation by passing a space-separated list of users
      Also allows comma-separated lists; fairly robust against extra spaces/commas
    --*/
    else if (isStaff) {
      try {
        const pCmd = utils.parseCmd('staff', event, context);
        const rotation = pCmd.rotation;
        const staff = pCmd.staff;

        if (utils.rotationInList(rotation, rotaList)) {
          if (!staff.length) {
            // If staff array is empty, send an error message
            // This is unlikely to happen but possible if there's a really malformed command
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.staffEmpty())
            );
          } else {
            // Rotation exists and parameter staff list isn't empty
            // Save to store
            store.saveStaff(rotation, staff);
            // Confirm in channel with message about using assign next
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.staffConfirm(rotation))
            );
          }
        } else {
          // Rotation doesn't exist; prompt to create it first
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.staffError(rotation))
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
      RESET STAFF
      @rota "[rotation]" reset staff
      Removes rotation staff
    --*/
    else if (isResetStaff) {
      try {
        const pCmd = utils.parseCmd('reset staff', event, context);
        const rotation = pCmd.rotation;

        if (utils.rotationInList(rotation, rotaList)) {
          // If rotation exists, set staff to an empty array
          store.saveStaff(rotation, []);
          // Send message to confirm staff has been reset
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.resetStaffConfirm(rotation))
          );
        } else {
          // If rotation doesn't exist, send message saying nothing changed
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.resetStaffError(rotation))
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
      DELETE
      @rota "[rotation]" delete
      Deletes an existing rotation
    --*/
    else if (isDelete) {
      try {
        const pCmd = utils.parseCmd('delete', event, context);
        const rotation = pCmd.rotation;

        if (utils.rotationInList(rotation, rotaList)) {
          // If rotation exists, delete from store completely
          store.deleteRotation(rotation);
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.deleteConfirm(rotation))
          );
        } else {
          // If rotation doesn't exist, send message saying nothing changed
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.deleteError(rotation))
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
      ABOUT
      @rota "[rotation]" about
      Provides description and assignment for specified rotation
    --*/
    else if (isAbout) {
      try {
        const pCmd = utils.parseCmd('about', event, context);
        const rotation = pCmd.rotation;

        if (utils.rotationInList(rotation, rotaList)) {
          // If rotation exists, display its information
          const rotationObj = store.getRotation(rotation);
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.aboutReport(rotation, rotationObj))
          );
          if (sentByUserID !== 'USLACKBOT') {
            // Send ephemeral message with staff (to save notifications)
            // Do nothing if coming from a slackbot
            const ephStaffResult = await app.client.chat.postEphemeral(
              utils.msgConfigEph(botToken, channelID, sentByUserID, msgText.aboutStaffEph(rotation, rotationObj.staff))
            );
          }
        } else {
          // If rotation doesn't exist, send message saying nothing changed
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.aboutError(rotation))
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
      ASSIGN
      @rota "[rotation]" assign [@user] [handoff message]
      Assigns a user to specified rotation
    --*/
    else if (isAssign) {
      try {
        const pCmd = utils.parseCmd('assign', event, context);
        const rotation = pCmd.rotation;
        const usermention = pCmd.user;
        const handoffMsg = pCmd.handoff;

        if (utils.rotationInList(rotation, rotaList)) {
          // Assign user in store
          store.saveAssignment(rotation, usermention);
          // Confirm assignment in channel
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.assignConfirm(usermention, rotation))
          );
          if (!!handoffMsg) {
            // Send DM to newly assigned user notifying them of the handoff message
            const oncallUserDMChannel = utils.getUserID(usermention);
            const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${channelID}/p${event.ts.replace('.', '')}`;
            // Send DM to on-call user notifying them of the message that needs their attention
            const sendDM = await app.client.chat.postMessage(
              utils.msgConfigBlocks(botToken, oncallUserDMChannel, msgText.assignDMHandoffBlocks(rotation, link, sentByUserID, channelID, handoffMsg))
            );
            if (sentByUserID !== 'USLACKBOT') {
              // Send ephemeral message in channel notifying assigner their handoff message has been delivered via DM
              const result = await app.client.chat.postEphemeral(
                utils.msgConfigEph(botToken, channelID, sentByUserID, msgText.assignHandoffConfirm(usermention, rotation))
              );
            }
          }
        } else {
          // If rotation doesn't exist, send message saying so
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.assignError(rotation))
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
      ASSIGN NEXT
      @rota "[rotation]" assign next [handoff message]
      Assigns next user in staff list to rotation
    --*/
    else if (isAssignNext) {
      try {
        const pCmd = utils.parseCmd('assign next', event, context);
        const rotation = pCmd.rotation;
        const handoffMsg = pCmd.handoff;

        if (utils.rotationInList(rotation, rotaList)) {
          // Rotation exists
          const staffList = store.getStaffList(rotation);
          if (staffList && staffList.length) {
            // Staff list exists and is not an empty array
            const lastAssigned = store.getAssignment(rotation);
            const lastAssignedIndex = staffList.indexOf(lastAssigned);
            const lastIndex = staffList.length - 1; // last available position in staff list
            const firstUser = staffList[0];
            let usermention;
            if (lastAssigned) {
              // There's a user currently assigned
              if (lastAssignedIndex > -1 && lastAssignedIndex < lastIndex) {
                // The last assigned user is in the staff list and is NOT last
                // Set assignment to next user in staff list
                usermention = staffList[lastAssignedIndex + 1];
              } else {
                // Either last user isn't in staff list or we're at the end of the list
                usermention = firstUser;
              }
            } else {
              // No previous assignment; start at beginning of staff list
              usermention = firstUser;
            }
            // Save assignment
            store.saveAssignment(rotation, usermention);
            // Send message to the channel about updated assignment
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.assignConfirm(usermention, rotation))
            );
            if (!!handoffMsg) {
              // There is a handoff message
              // Send DM to newly assigned user notifying them of handoff message
              const oncallUserDMChannel = utils.getUserID(usermention);
              const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${channelID}/p${event.ts.replace('.', '')}`;
              // Send DM to on-call user notifying them of the message that needs their attention
              const sendDM = await app.client.chat.postMessage(
                utils.msgConfigBlocks(botToken, oncallUserDMChannel, msgText.assignDMHandoffBlocks(rotation, link, sentByUserID, channelID, handoffMsg))
              );
              if (sentByUserID !== 'USLACKBOT') {
                // Send ephemeral message notifying assigner their handoff message was delivered via DM
                const result = await app.client.chat.postEphemeral(
                  utils.msgConfigEph(botToken, channelID, sentByUserID, msgText.assignHandoffConfirm(usermention, rotation))
                );
              }
            }
          } else {
            // No staff list; cannot use "next"
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.assignNextError(rotation))
            );
          }
        } else {
          // If rotation doesn't exist, send message in channel
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.assignError(rotation))
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
      WHO
      @rota "[rotation]" who
      Reports who the assigned user is for a rotation
    --*/
    else if (isWho) {
      try {
        const pCmd = utils.parseCmd('who', event, context);
        const rotation = pCmd.rotation;

        if (utils.rotationInList(rotation, rotaList)) {
          // If rotation exists, display its information
          const rotationObj = store.getRotation(rotation);
          if (!!rotationObj.assigned) {
            // If someone is currently assigned, report who
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.whoReport(rotationObj.assigned, rotation))
            );
          } else {
            // If nobody is assigned
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.whoUnassigned(rotation))
            );
          }
        } else {
          // If rotation doesn't exist, send message saying nothing changed
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.whoError(rotation))
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
      UNASSIGN
      @rota "[rotation]" unassign
      Clears the assignment for a rotation
    --*/
    else if (isUnassign) {
      try {
        const pCmd = utils.parseCmd('unassign', event, context);
        const rotation = pCmd.rotation;

        if (utils.rotationInList(rotation, rotaList)) {
          const rotationObj = store.getRotation(rotation);
          // If rotation exists, check if someone is assigned
          if (!!rotationObj.assigned) {
            // If someone is currently assigned, clear
            store.saveAssignment(rotation, null);
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.unassignConfirm(rotation))
            );
          } else {
            // If nobody is assigned
            const result = await app.client.chat.postMessage(
              utils.msgConfig(botToken, channelID, msgText.unassignNoAssignment(rotation))
            );
          }
        } else {
          // If rotation doesn't exist, send message saying nothing changed
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.unassignError(rotation))
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
      LIST
      @rota list
      Lists all rotations, descriptions, and assignments
    --*/
    else if (isList) {
      const list = rotaList;
      try {
        // If the store is not empty
        if (Object.keys(list).length !== 0 && list.constructor === Object) {
          const result = await app.client.chat.postMessage(
            utils.msgConfig(botToken, channelID, msgText.listReport(list))
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
          const oncallUser = store.getAssignment(rotation);
          
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