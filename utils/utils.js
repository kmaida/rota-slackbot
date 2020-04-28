/*------------------
     UTILITIES
------------------*/

// (regex is not exported)
const regex = {
  // <@[BOTID]> setup [rotation]
  setup: /^<@(U[A-Z0-9]+?)> (setup) ([a-z\-]+?)$/g,
  // <@[BOTID]> "[rotation]" assign <@[USERID]>
  rotaAssign: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (assign) <@(U[A-Z0-9]+?)>$/g,
  // <@[BOTID]> "[rotation]" [command]
  rotaSimple: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" ([a-z]+?)$/g,
  // <@[BOTID]> "[rotation]" [message text]
  rotaMessage: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (.*)$/g
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
    }
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
      // (simple command without need for rotation user lookup, like "setup", "delete")
      } else if (!cmdConfig.rotaReq && cmdConfig.params) {
        return {
          command: res[2],
          params: res[3]
        }
      // Command, rotation, message
      } else if (command === 'message') {
        return {
          command: 'message',
          rotation: res[2],
          params: res[3]
        };
      }
    }
    // If not a properly formatted command:
    return null;
  },
  // Returns true if mention text matches properly formatted "assign" command
  isAssign(e, ct) {
    const normalizedText = e.text.toUpperCase().trim();
    const assignRegex = /^<@U[A-Z0-9]+?> "[A-Z\-]+?" ASSIGN <@U[A-Z0-9]+?>/g; // Accommodating to extra characters (lopped off later)
    return (normalizedText.startsWith(`<@${ct.botUserId}>`) && assignRegex.test(normalizedText));
  },
  // Returns the first string between double quotes that contains only letters and hyphens
  getRotation(text) {
    if (text) {
      return text.match(/"([a-z\-]+?)"/)[1]; 
    }
    return '';
  }
};

module.exports = utils;