const utils = require('./utils/utils');
const helpBlocks = require('./bot-response/blocks-help');
const msgText = require('./bot-response/message-text');
// Commands
const cmdNew = require('./app-mentions/new');
const cmdStaff = require('./app-mentions/staff');
const cmdResetStaff = require('./app-mentions/reset-staff');
const cmdDelete = require('./app-mentions/delete');
const cmdAbout = require('./app-mentions/about');
const cmdAssign = require('./app-mentions/assign');
const cmdAssignNext = require('./app-mentions/assign-next');
const cmdWho = require('./app-mentions/who');
const cmdUnassign = require('./app-mentions/unassign');
const cmdList = require('./app-mentions/list');
const cmdHelp = require('./app-mentions/help');
const cmdMessage = require('./app-mentions/message');

/*------------------
    APP MENTIONS
------------------*/
const app_mentions = (app, store) => {
  app.event('app_mention', async({ event, context }) => {
    // Event and context data
    const ec = {
      text: event.text,                           // raw text from the mention
      sentByUserID: event.user,                   // ID of user who sent the message
      channelID: event.channel,                   // channel ID
      botToken: context.botToken,                 // bot access token
      rotaList: await store.getRotations()        // rotations in db
    }
    // Decision logic establishing how to respond to mentions
    const isNew = utils.isCmd('new', ec.text);
    const isStaff = utils.isCmd('staff', ec.text);
    const isResetStaff = utils.isCmd('reset staff', ec.text);
    const isAssign = utils.isCmd('assign', ec.text);
    const isAssignNext = utils.isCmd('assign next', ec.text);
    const isWho = utils.isCmd('who', ec.text);
    const isAbout = utils.isCmd('about', ec.text);
    const isUnassign = utils.isCmd('unassign', ec.text);
    const isDelete = utils.isCmd('delete', ec.text);
    const isHelp = utils.isCmd('help', ec.text);
    const isList = utils.isCmd('list', ec.text);
    const testMessage = utils.isCmd('message', ec.text);
    const isMessage =
      testMessage &&
      !isNew &&
      !isStaff && !ec.text.includes('" staff <@')  // catch malformed staff commands (less robust regex)
      !isResetStaff &&
      !isAssign &&
      !isAssignNext &&
      !isWho &&
      !isAbout &&
      !isUnassign &&
      !isDelete;

    // @rota new "[rotation-name]" [optional description]
    if (isNew) {
      cmdNew(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation-name]" staff [@user @user @user]
    else if (isStaff) {
      cmdStaff(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" reset staff
    else if (isResetStaff) {
      cmdResetStaff(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" delete
    else if (isDelete) {
      cmdDelete(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" about
    else if (isAbout) {
      cmdAbout(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" assign [@user] [handoff message]
    else if (isAssign) {
      cmdAssign(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" assign next [handoff message]
    else if (isAssignNext) {
      cmdAssignNext(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" who
    else if (isWho) {
      cmdWho(app, event, context, ec, utils, store, msgText);
    }
    // @rota "[rotation]" unassign
    else if (isUnassign) {
      cmdUnassign(app, event, context, ec, utils, store, msgText);
    }
    // @rota list
    else if (isList) {
      cmdList(app, ec, utils, msgText);
    }
    // @rota help
    else if (isHelp) {
      cmdHelp(app, ec, utils, helpBlocks, msgText);
    }
    // @rota "[rotation]" free form message for on-call user
    else if (isMessage) {
      cmdMessage(app, event, context, ec, utils, store, msgText);
    }
    // @rota anything else
    else {
      try {
        const result = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.didntUnderstand())
        );
      }
      catch (err) {
        console.error(err);
        const errResult = await app.client.chat.postMessage(
          utils.msgConfig(ec.botToken, ec.channelID, msgText.error(err))
        );
      }
    }
  });
}
module.exports = app_mentions;