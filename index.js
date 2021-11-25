require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

// MongoDB
const mongoose = require('mongoose');
const store = require('./data/db');

/*------------------
       ON INIT
------------------*/
// Create Bolt app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver,
});
const port = process.env.PORT || 3000;

/*------------------
    Health Check
------------------*/
receiver.router.get('/health-check', (req, res) => {
  res.send('App is running!');
});

/*------------------
      MONGODB
------------------*/
// Address server discovery deprecation warning
mongoose.set('useUnifiedTopology', true);
// Connect to MongoDB
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
require('./app-home-opened')(app);

/*------------------
    APP MENTIONS
------------------*/
require('./app-mentions')(app, store);

/*------------------
     START APP
------------------*/
(async () => {
  await app.start(port);
  console.log(`⚡️ Rota is running on ${port}!`);
})();
