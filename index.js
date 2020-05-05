require('dotenv').config();
const { App } = require('@slack/bolt');
const app_home_opened = require('./app-home-opened');
const app_mentions = require('./app-mentions');
// MongoDB
const mongoose = require('mongoose');
const store = require('./data/db');

/*------------------
       ON INIT
------------------*/
// Create Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const port = process.env.PORT || 3000;

/*------------------
      MONGODB
------------------*/
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const db = mongoose.connection;
// Capture connection errors
db.on('error', console.error.bind(console, 'MongoDB Connection Error. Please make sure that', process.env.MONGO_URI, 'is running.'));
// Open connection
db.once('open', function() {
  console.info('Connected to MongoDB:', process.env.MONGO_URI);
});

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
