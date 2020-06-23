/*------------------
  DELETE
  @rota delete "[rotation]"
  Deletes an existing rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('delete', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      // If rotation exists, delete from store completely
      const del = await store.deleteRotation(rotation);
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.deleteConfirm(rotation))
      );
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.deleteError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};