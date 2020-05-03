require('dotenv').config();
const { App } = require('@slack/bolt');
const store = require('./utils/store');
const app_home_opened = require('./app-home-opened');
const app_mentions = require('./app-mentions');

/*------------------
       ON INIT
------------------*/
// Create Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;
// Check if store exists; if not, create it
store.initStore();

/*------------------
  APP HOME OPENED
------------------*/
app_home_opened(app);

/*------------------
    APP MENTIONS
------------------*/
app_mentions(app, store);

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Rota is running on ${port}!`);
})();
