/*------------------
     UTILITIES
------------------*/
const utils = {
  regex: {
    // @rota new "[new-rotation-name]" [optional description]
    // Create a new rotation
    new: /^<@(U[A-Z0-9]+?)> (new) "([a-z0-9\-]+?)"(.*)$/g,
    // @rota "[rotation]" description [description]
    // Update description for an existing rotation
    description: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (description)(.*)$/g,
    // @rota "[rotation]" staff [@username, @username, @username]
    // Accepts a space-separated list of usernames to staff a rotation
    // List of mentions has to start with <@U and end with > but can contain spaces, commas, multiple user mentions
    staff: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (staff) (<@U[<@>A-Z0-9,\s]+?>)$/g,
    // @rota "[rotation]" reset staff
    // Removes rotation staff list
    'reset staff': /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (reset staff)$/g,
    // Capture user ID only from
    // <@U03LKJ> or <@U0345|name>
    userID: /^<@([A-Z0-9]+?)[a-z|._\-]*?>$/g,
    // @rota "[rotation]" assign [@username] [optional handoff message]
    // Assigns a user to a rotation
    assign: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (assign) (<@U[A-Z0-9]+?>)(.*)$/g,
    // @rota "[rotation]" assign next [optional handoff message]
    // Assigns a user to a rotation
    'assign next': /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (assign next)(.*)$/g,
    // @rota "[rotation]" who
    // Responds stating who is on-call for a rotation
    who: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (who)$/g,
    // @rota "[rotation]" about
    // Responds with description and mention of on-call for a rotation
    // Sends ephemeral staff list (to save everyone's notifications)
    about: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (about)$/g,
    // @rota "[rotation]" unassign
    // Unassigns rotation
    unassign: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (unassign)$/g,
    // @rota delete "[rotation]"
    // Removes the rotation completely
    delete: /^<@(U[A-Z0-9]+?)> (delete) "([a-z0-9\-]+?)"$/g,
    // @rota help
    // Post help messaging
    help: /^<@(U[A-Z0-9]+?)> (help)$/g,
    // @rota list
    // List all rotations in store
    list: /^<@(U[A-Z0-9]+?)> (list)$/g,
    // @rota "[rotation]" any other message
    // Message does not contain a command
    // Sends message text
    message: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (.*)$/g
  },
  /**
   * Clean up message text so it can be tested / parsed
   * @param {string} msg original message text
   * @return {string} trimmed and cleaned message text
   */
  cleanText(msg) {
    const cleanMsg = msg
      .replace('Reminder: ', '')
      .replace("_(sent with '/gator')_", '')
      .replace(/\|[a-z0-9._\-]+?>/g, '>')     // Remove username if present in mentions
      .replace(/“/g, '"').replace(/”/g, '"')  // Slack decided to use smart quotes (ugh)
      .trim();
    return cleanMsg;
  },
  /**
   * Get user ID from mention
   * @param {string} usermention user mention <@U324SDF> or <@U0435|some.user>
   * @return {string} user ID U324SDF
   */
  getUserID(usermention) {
    return [...usermention.matchAll(new RegExp(utils.regex.userID))][0][1];
  },
  /**
   * See if a rotation exists (by name)
   * @param {string} rotaname name of rotation to check if exists
   * @param {string[]} list of existing rotation names
   * @return {boolean} does the rotation exist?
   */
  rotationInList(rotaname, list) {
    if (list && list.length) {
      return list.filter(rotation => rotation.name === rotaname).length > 0;
    }
    return false;
  },
  /**
   * Test message to see if its format matches expectations for specific command
   * Need to new RegExp to execute on runtime
   * @param {string} cmd command
   * @param {string} input mention text
   * @return {Promise<boolean>} does text match an existing command?
   */
  async isCmd(cmd, input) {
    const msg = utils.cleanText(input);
    const regex = new RegExp(utils.regex[cmd]);
    return regex.test(msg);
  },
  /**
   * Parse app mention command text
   * @param {string} cmd text command
   * @param {object} e event object
   * @param {object} ct context object
   * @return {Promise<object>} object containing rotation, command, user, data
   */
  async parseCmd(cmd, e, ct) {
    const cleanText = utils.cleanText(e.text);
    // Match text using regex associated with the passed command
    const res = [...cleanText.matchAll(new RegExp(utils.regex[cmd]))][0];

    // Regex returned expected match appropriate for the command
    // Command begins with rota bot mention
    if (res && res[1].includes(ct.botUserId)) {
      // Rotation, command, usermention, freeform text
      if (cmd === 'assign') {
        return {
          rotation: res[2],
          command: res[3],
          user: res[4],
          handoff: res[5].trim()
        }
      }
      // Rotation, command, freeform text
      else if (cmd === 'assign next') {
        return {
          rotation: res[2],
          command: res[3],
          handoff: res[4].trim()
        }
      }
      // Rotation, command, list of space-separated usermentions
      // Proofed to accommodate use of comma+space separation and minor whitespace typos
      else if (cmd === 'staff') {
        const getStaffArray = (staffStr) => {
          const cleanStr = staffStr.replace(/,/g, '').replace(/></g, '> <').trim();
          const arr = cleanStr.split(' ');
          const noEmpty = arr.filter(item => !!item !== false);   // Remove falsey values
          const noDupes = new Set(noEmpty);                       // Remove duplicates
          const cleanArr = [...noDupes];                          // Convert set back to array
          return cleanArr || [];
        };
        return {
          rotation: res[2],
          command: res[3],
          staff: getStaffArray(res[4])
        }
      }
      // Rotation, command, parameters
      else if (cmd === 'new') {
        const description = res[4];
        return {
          rotation: res[3],
          command: res[2],
          description: description ? description.trim() : '(_no description provided_)'
        };
      }
      // Command, rotation
      else if (cmd === 'delete') {
        return {
          rotation: res[3],
          command: res[2]
        };
      }
      // Rotation, command
      else if (cmd === 'description') {
        return {
          rotation: res[2],
          command: res[3],
          description: res[4].trim()
        };
      }
      // Rotation, command
      else if (cmd === 'about' || cmd === 'unassign' || cmd === 'who' || cmd === 'reset staff') {
        return {
          rotation: res[2],
          command: res[3]
        };
      }
      // Command
      else if (cmd === 'help' || cmd === 'list') {
        return {
          command: res[2]
        };
      }
      // Rotation, message
      // Command-less freeform message
      else if (cmd === 'message') {
        return {
          command: cmd,
          rotation: res[2],
          message: res[3]
        };
      }
    }
    // If not a properly formatted command, return null
    // This should trigger error messaging
    return null;
  },
  /**
   * Config object for Slack messages
   * @param {string} botToken for Slack access
   * @param {string} channelID to post message in
   * @param {string} text message text
   * @return {object} configuration object
   */
  msgConfig(botToken, channelID, text) {
    return {
      token: botToken,
      channel: channelID,
      text: text
    }
  },
  /**
   * Config object for Slack messages using block kit UI
   * @param {string} botToken for Slack access
   * @param {string} channelID to post message in
   * @param {object[]} blocks composed message array
   * @return {object} configuration object
   */
  msgConfigBlocks(botToken, channelID, blocks) {
    return {
      token: botToken,
      channel: channelID,
      blocks: blocks
    }
  },
  /**
   * Config object for ephemeral Slack messages
   * @param {string} botToken for Slack access
   * @param {string} channelID to post message in
   * @param {string} user to show ephemeral message to
   * @param {string} text message text
   * @return {object} configuration object
   */
  msgConfigEph(botToken, channelID, user, text) {
    return {
      token: botToken,
      channel: channelID,
      user: user,
      text: text
    }
  },
  /**
   * Message middleware: ignore some kinds of messages
   * A bit hacky to catch inconsistencies in Slack API
   * (Customer service was contacted; unreliable behavior confirmed)
   * @param {object} event event object
   * @return {Promise<void>} continue if not ignored message type
  */
  async ignoreMention({ message, event, next }) {
    const disallowedSubtypes = ['channel_topic', 'message_changed'];
    const ignoreSubtypeEvent = disallowedSubtypes.indexOf(event.subtype) > -1;
    const ignoreSubtypeMessage = message && message.subtype && disallowedSubtypes.indexOf(message.subtype) > -1;
    const ignoreEdited = !!event.edited;
    // If mention should be ignored, return
    if (ignoreSubtypeEvent || ignoreSubtypeMessage || ignoreEdited) {
      return;
    }
    // If mention should be processed, continue
    await next();
  }
};

module.exports = utils;