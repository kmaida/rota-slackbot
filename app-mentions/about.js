/*------------------
  ABOUT
  @rota "[rotation]" about
  Provides description and assignment for specified rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('about', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, display its information
      const rotationObj = await store.getRotation(rotation);
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.aboutReport(rotation, rotationObj))
      );
      if (!!ec.sentByUserID && ec.sentByUserID !== 'USLACKBOT') {
        // Send ephemeral message with staff (to save notifications)
        // Do nothing if coming from a slackbot
        const ephStaffResult = await app.client.chat.postEphemeral(
          utils.msgConfigEph(ec.botToken, ec.channelID, ec.sentByUserID, msgText.aboutStaffEph(rotation, rotationObj.staff))
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.aboutError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};