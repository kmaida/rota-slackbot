/*------------------
  HELP
  @rota help
  Provides instructions on how to use Rota
------------------*/
module.exports = async (app, ec, utils, helpBlocks, msgText) => {
  try {
    const result = await app.client.chat.postMessage({
      token: ec.botToken,
      channel: ec.channelID,
      blocks: helpBlocks()
    });
  }
  catch (err) {
    console.error(err);
    const errResult = await app.client.chat.postMessage(
      utils.msgConfig(ec.botToken, ec.channelID, msgText.error(err))
    );
  }
};