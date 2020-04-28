/*------------------
     UTILITIES
------------------*/

const regex = {
  // <@[BOTID]> setup [rotation]
  setup: /^<@(U[A-Z0-9]+?)> (setup) ([a-z\-]+?)$/g,
  // <@[BOTID]> "[rotation]" assign <@[USERID]>
  rotaAssign: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (assign) <@(U[A-Z0-9]+?)>$/g,
  // <@[BOTID]> "[rotation]" [command]
  rotaSimple: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" ([a-z]+?)$/g,
  // <@[BOTID]> "[rotation]" [message text]
  rotaMessage: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (.*)$/g,
  // <@[<BOTID>] [command]
  simple: /^<@(U[A-Z0-9]+?)> ([a-z]+?)$/g
}

const utils = {
  commands: {
    // @rota setup [new-rotation-name]
    // Create a new rotation
    setup: {
      rotaReq: false,
      params: true,
      regex: regex[setup]
    },
    // @rota "[rotation]" assign [@username]
    // Assigns a user to the specified rotation
    assign: {
      rotaReq: true,
      params: true,
      regex: regex[rotaAssign]
    },
    // @rota "[rotation]" who
    // Responds stating who is on-call for the specified rotation
    who: {
      rotaReq: true,
      params: false,
      regex: regex[rotaSimple]
    },
    // @rota "[rotation]" unassign
    // Unassigns rotation
    clear: {
      rotaReq: true,
      params: false,
      regex: regex[rotaSimple]
    },
    // @rota "[rotation]" delete
    // Removes the rotation completely
    delete: {
      rotaReq: true,
      params: false,
      regex: regex[rotaSimple]
    },
    // @rota "[rotation]" any other message
    // Message does not contain a command
    // Sends message text
    message: {
      rotaReq: true,
      params: true,
      regex: regex[rotaMessage]
    },
    // @rota help
    // Post help messaging
    help: {
      rotaReq: false,
      params: false,
      regex: regex[simple]
    }
  },
  /*----
    Test message to see if its format matches expectations for specific command
    @Params: command, input text
    @Returns: boolean
  ----*/
  isCmd(cmd, input) {
    return this.commands[cmd].regex.test(input.trim());
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
    const res = [...safeText.matchAll(cmdConfig.regex)][0];
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
      // (simple, rotation-specific command like "who" and "clear")
      } else if (cmdConfig.rotaReq && !cmdConfig.params) {
        return {
          rotation: res[2],
          command: res[3]
        };
      // Command, parameters
      // (simple command with paramters, like "setup", "delete")
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