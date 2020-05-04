/*------------------
     UTILITIES
------------------*/

const utils = {
  regex: {
    // @rota "[new-rotation-name]" create [description]
    // Create a new rotation
    create: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (create)(.*)$/g,
    // @rota "[rotation]" staff [@username, @username, @username]
    // Accepts a space-separated list of usernames to staff a rotation
    // List of mentions has to start with <@U and end with > but can contain spaces, commas, multiple user mentions
    staff: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (staff) (<@U[<@>A-Za-z0-9|._,\s\-]+?>)$/g,
    // @rota "[rotation]" reset staff
    // Removes rotation staff list
    'reset staff': /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (reset staff)$/g,
    // Test for a single user mention
    // <@U03LKJ> or <@U0345|name>
    usermention: /^<@U[A-Za-z0-9|._\-]+?>$/g,
    // @rota "[rotation]" assign [@username] [optional handoff message]
    // Assigns a user to a rotation
    assign: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (assign) (<@U[A-Za-z0-9|._\-]+?>)(.*)$/g,
    // @rota "[rotation]" assign next [optional handoff message]
    // Assigns a user to a rotation
    'assign next': /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (assign next)(.*)$/g,
    // @rota "[rotation]" who
    // Responds stating who is on-call for a rotation
    who: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (who)$/g,
    // @rota "[rotation]" about
    // Responds with description and mention of on-call for a rotation
    // Sends ephemeral staff list (to save everyone's notifications)
    about: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (about)$/g,
    // @rota "[rotation]" unassign
    // Unassigns rotation
    unassign: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (unassign)$/g,
    // @rota "[rotation]" delete
    // Removes the rotation completely
    delete: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (delete)$/g,
    // @rota help
    // Post help messaging
    help: /^<@(U[A-Za-z0-9|._\-]+?)> (help)$/g,
    // @rota list
    // List all rotations in store
    list: /^<@(U[A-Za-z0-9|._\-]+?)> (list)$/g,
    // @rota "[rotation]" any other message
    // Message does not contain a command
    // Sends message text
    message: /^<@(U[A-Za-z0-9|._\-]+?)> "([a-z0-9\-]+?)" (.*)$/g
  },
  /*----
    Clean up message text so it can be tested / parsed
    @Params: mention event message
    @Returns: string
  ----*/
  cleanText(msg) {
    if (msg.startsWith('Reminder: ')) {
      return msg.replace('Reminder: ', '').trim();
    } else {
      return msg.trim();
    }
  },
  /*----
    Test message to see if its format matches expectations for specific command
    Need to new RegExp to execute on runtime
    @Params: command, mention event message
    @Returns: boolean
  ----*/
  isCmd(cmd, input) {
    const msg = this.cleanText(input);
    const regex = new RegExp(this.regex[cmd]);
    return regex.test(msg);
  },
  /*----
    Parse commands
    @Params: command, event, context
    @Returns: object or null
  ----*/
  parseCmd(cmd, e, ct) {
    const safeText = this.cleanText(e.text);
    // Match text using regex associated with the passed command
    const res = [...safeText.matchAll(new RegExp(this.regex[cmd]))][0];
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
          const cleanStr = staffStr.replace(/,/g, '').trim();
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
      else if (cmd === 'create') {
        const description = res[4];
        return {
          rotation: res[2],
          command: res[3],
          description: description ? description.trim() : '(no description provided)'
        };
      }
      // Rotation, command
      else if (cmd === 'about' || cmd === 'unassign' || cmd === 'delete' || cmd === 'who' || cmd === 'reset staff') {
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
  /*----
    Config object for Slack messages
    @Params: botToken, channelID, text
    @Returns: object
  ----*/
  msgConfig(botToken, channelID, text) {
    return {
      token: botToken,
      channel: channelID,
      text: text
    }
  },
  /*----
    Config object for ephemeral Slack messages
    @Params: botToken, channelID, user, text
    @Returns: object
  ----*/
  ephMsgConfig(botToken, channelID, user, text) {
    return {
      token: botToken,
      channel: channelID,
      user: user,
      text: text
    }
  }
};

module.exports = utils;