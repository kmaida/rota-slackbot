/*------------------
  UNASSIGN
  @rota "[rotation]" unassign
  Clears the assignment for a rotation
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('unassign', event, context);
    const rotation = pCmd.rotation;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      const rotationObj = await store.getRotation(rotation);
      // If rotation exists, check if someone is assigned
      if (!!rotationObj.assigned) {
        // If someone is currently assigned, clear
        const save = await store.saveAssignment(rotation, null);
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.unassignConfirm(rotation))
        );
      } else {
        // If nobody is assigned
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.unassignNoAssignment(rotation))
        );
      }
    } else {
      // If rotation doesn't exist, send message saying nothing changed
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.unassignError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};