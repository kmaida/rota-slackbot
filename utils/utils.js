/*------------------
     UTILITIES
------------------*/

const utils = {
  commands: {
    // @rota "[new-rotation-name]" create
    // Create a new rotation
    create: {
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" create$/g
    },
    // @rota "[rotation]" assign [@username]
    // Assigns a user to the specified rotation
    assign: {
      rotaReq: true,
      params: true,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (assign) (<@U[A-Z0-9]+?>)$/g
    },
    // @rota "[rotation]" who
    // Responds stating who is on-call for the specified rotation
    who: {
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (who)$/g
    },
    // @rota "[rotation]" unassign
    // Unassigns rotation
    clear: {
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (clear)$/g
    },
    // @rota "[rotation]" delete
    // Removes the rotation completely
    delete: {
      rotaReq: true,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (delete)$/g
    },
    // @rota "[rotation]" any other message
    // Message does not contain a command
    // Sends message text
    message: {
      rotaReq: true,
      params: true,
      regex: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (.*)$/g
    },
    // @rota help
    // Post help messaging
    help: {
      rotaReq: false,
      params: false,
      regex: /^<@(U[A-Z0-9]+?)> (help)$/g
    }
  },
  /*----
    Test message to see if its format matches expectations for specific command
    @Params: command, mention event message
    @Returns: boolean
  ----*/
  isCmd(cmd, msg) {
    return this.commands[cmd].regex.test(msg.trim());
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
      // (like "assign")
      if (cmdConfig.rotaReq && cmdConfig.params) {
        return {
          rotation: res[2],
          command: res[3],
          params: res[4]
        };
      // Command, rotation
      // (simple, rotation-specific command like "create", "who", "clear", "delete")
      } else if (cmdConfig.rotaReq && !cmdConfig.params) {
        return {
          rotation: res[2],
          command: res[3]
        };
      // Command, parameters
      // (simple command with paramters, like "setup")
      } else if (!cmdConfig.rotaReq && cmdConfig.params) {
        return {
          command: res[2],
          params: res[3]
        }
      // Command
      // (simple command with no rotation lookup and no parameters, like "help")
      } else if (!cmdConfig.rotaReq && !cmdConfig.params) {
        return {
          command: res[2]
        };
      // Command, rotation, message
      } else if (command === 'message') {
        return {
          command: 'message',
          rotation: res[2],
          params: res[3]
        };
      }
    }
    // If not a properly formatted command, return null
    // This should trigger (ephemeral?) error messaging
    return null;
  }
};

module.exports = utils;