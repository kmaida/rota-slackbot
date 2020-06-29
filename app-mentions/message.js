/*------------------
  (MESSAGE)
  @rota "[rotation]" free form message for on-call user
  Send message to on-call user via DM with link to channel
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('message', event, context);
    const rotation = pCmd.rotation;
    // Check if rotation exists
    if (utils.rotationInList(rotation, ec.rotaList)) {
      const rotationObj = await store.getRotation(rotation);
      const oncallUser = rotationObj.assigned;

      if (!!oncallUser) {
        // If someone is assigned to concierge...
        const link = `https://${process.env.SLACK_TEAM}.slack.com/archives/${ec.channelID}/p${event.ts.replace('.', '')}`;
        const oncallUserDMChannel = utils.getUserID(oncallUser);
        // Send DM to on-call user notifying them of the message that needs their attention
        const sendDM = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, oncallUserDMChannel, msgText.dmToAssigned(rotation, ec.sentByUserID, ec.channelID, link))
        );
        // Send message to the channel where help was requested notifying that assigned user was contacted
        const sendChannelMsg = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.confirmChannelMsg(rotation, ec.sentByUserID))
        );
        if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
          // Send ephemeral message (only visible to sender) telling them what to do if urgent
          // Do nothing if coming from a slackbot
          const sendEphemeralMsg = await app.client.chat.postEphemeral(
            utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.confirmEphemeralMsg(rotation))
          );
        }
      } else {
        // Rotation is not assigned; give instructions how to assign
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.nobodyAssigned(rotation))
        );
      }
    } else {
      // Rotation doesn't exist
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.msgError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};