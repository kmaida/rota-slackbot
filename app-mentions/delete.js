/*------------------
  DELETE
  @rota "[rotation]" delete
  Deletes an existing rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText) => {
  try {
    const pCmd = utils.parseCmd('delete', event, context);
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
    console.error(err);
    const errResult = await app.client.chat.postMessage(
      utils.msgConfig(ec.botToken, ec.channelID, msgText.error(err))
    );
  }
};