/*------------------
  STAFF
  @rota "[rotation-name]" staff [@user @user @user]
  Staffs a rotation by passing a space-separated list of users
  Also allows comma-separated lists; fairly robust against extra spaces/commas
------------------*/
module.exports = async (app, event, context, ec, utils, store, msgText, errHandler) => {
  try {
    const pCmd = await utils.parseCmd('staff', event, context);
    const rotation = pCmd.rotation;
    const staff = pCmd.staff;

    if (utils.rotationInList(rotation, ec.rotaList)) {
      if (!staff.length) {
        // If staff array is empty, send an error message
        // This is unlikely to happen but possible if there's a really malformed command
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.staffEmpty())
        );
      } else {
        // Rotation exists and parameter staff list isn't empty
        // Save to store
        const save = await store.saveStaff(rotation, staff);
        // Confirm in channel with message about using assign next
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.staffConfirm(rotation))
        );
      }
    } else {
      // Rotation doesn't exist; prompt to create it first
      const result = await app.client.chat.postMessage(
        utils.msgConfig(ec.botToken, ec.channelID, msgText.staffError(rotation))
      );
    }
  }
  catch (err) {
    errHandler(app, ec, utils, err, msgText);
  }
};