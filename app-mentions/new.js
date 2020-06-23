/*------------------
  NEW
  @rota new "[rotation-name]" [optional description]
  Creates a new rotation with description
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('new', event, context);
    const rotation = pCmd.rotation;
    const description = pCmd.description;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // Can't create a rotation that already exists
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.newError(rotation))
      );
    } else {
      // Initialize a new rotation with description
      const save = await store.newRotation(rotation, description);
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.newConfirm(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};