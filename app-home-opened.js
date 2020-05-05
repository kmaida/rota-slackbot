const homeBlocks = require('./bot-response/blocks-home');
const store = require('./data/db');

/*------------------
  APP HOME OPENED
------------------*/
const app_home_opened = (app) => {
  app.event('app_home_opened', async({ event, context }) => {
    const userID = event.user;
    const storeList = await store.getRotations();
    try {
      const showHomeView = await app.client.views.publish({
        token: context.botToken,
        user_id: userID,
        view: {
          "type": "home",
          "blocks": homeBlocks(userID, storeList)
        }
      });
    }
    catch (err) {
      console.error(err);
    }
  });
}

module.exports = app_home_opened;