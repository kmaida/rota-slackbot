/*------------------
     UTILITIES
------------------*/

const utils = {
  commands: {
    // @rota "[new-rotation-name]" create [description]
    // Create a new rotation
    create: {
      command: true,
      rotaReq: true,
      params: true,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (create) (.*)$/g
    },
    // @rota "[rotation]" assign [@username]
    // Assigns a user to the specified rotation
    assign: {
      command: true,
      rotaReq: true,
      params: true,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (assign) (<@U[A-Z0-9]+?>)$/g
    },
    // @rota "[rotation]" who
    // Responds stating who is on-call for the specified rotation
    who: {
      command: true,
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (who)$/g
    },
    // @rota "[rotation]" about
    // Responds with description and mention of on-call for the specified rotation
    about: {
      command: true,
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (about)$/g
    },
    // @rota "[rotation]" clear
    // Unassigns rotation
    clear: {
      command: true,
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (clear)$/g
    },
    // @rota "[rotation]" delete
    // Removes the rotation completely
    delete: {
      command: true,
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (delete)$/g
    },
    // @rota help
    // Post help messaging
    help: {
      command: true,
      rotaReq: false,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> (help)$/g
    },
    // @rota list
    // List all rotations in store
    list: {
      command: true,
      rotaReq: false,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> (list)$/g
    },
    // @rota "[rotation]" any other message
    // Message does not contain a command
    // Sends message text
    message: {
      command: false,
      rotaReq: true,
      params: true,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z0-9\-]+?)" (.*)$/g
    }
  },
  /*----
    Test message to see if its format matches expectations for specific command
    @Params: command, mention event message
    @Returns: boolean
  ----*/
  isCmd(cmd, msg) {
    const regex = new RegExp(this.commands[cmd].regex);
    return regex.test(msg.trim());
  },
  /*----
    Parse commands
    @Params: command, event, context
    @Returns: object or null
  ----*/
  parseCmd(cmd, e, ct) {
    const cmdConfig = this.commands[cmd];
    const safeText = e.text.trim();
    // Match text using regex associated with the passed command
    const res = [...safeText.matchAll(new RegExp(cmdConfig.regex))][0];
    // Regex returned expected match appropriate for the command
    // Command begins with rota bot mention
    if (res && res[1] === ct.botUserId) {
      // Command, rotation, parameters
      // "assign", "create"
      if (cmdConfig.command && cmdConfig.rotaReq && cmdConfig.params) {
        return {
          rotation: res[2],
          command: res[3],
          params: res[4]
        };
      // Command, rotation
      // "about", "clear", "delete", "who"
      } else if (cmdConfig.command && cmdConfig.rotaReq && !cmdConfig.params) {
        return {
          rotation: res[2],
          command: res[3]
        };
      // Command
      // "help", "list"
      } else if (cmdConfig.command && !cmdConfig.rotaReq && !cmdConfig.params) {
        return {
          command: res[2]
        };
      // Rotation, message
      // Command-less freeform message
      } else if (!cmdConfig.command && cmdConfig.rotaReq && cmdConfig.params) {
        return {
          command: cmd,
          rotation: res[2],
          params: res[3]
        };
      }
    }
    // If not a properly formatted command, return null
    // This should trigger (ephemeral?) error messaging
    return null;
  },
  /*----
    Configuration for catch error
    @Params: botToken, channelID, text
    @Returns: object
  ----*/
  errorMsgObj(botToken, channelID, text) {
    return {
      token: botToken,
      channel: channelID,
      text: text
    }
  }
};

module.exports = utils;