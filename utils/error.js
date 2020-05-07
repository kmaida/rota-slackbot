module.exports = async (app, ec, utils, err, msgText)  => {
  console.error(err);
  const errResult = await app.client.chat.postMessage(
    utils.msgConfig(ec.botToken, ec.channelID, msgText.error(err))
  );
};