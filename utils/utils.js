/*------------------
     UTILITIES
------------------*/

const regex = {
  // <@[BOTID]> setup [rotation]
  setup: /^<@(U[A-Z0-9]+?)> (setup) ([a-z\-]+?)$/g,
  // <@[BOTID]> "[rotation]" assign <@[USERID]>
  assign: /^<@(U[A-Z0-9]+?)> "([a-z\-]+?)" (assign) <@(U[A-Z0-9]+?)>$/g,
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
      regex: regex[assign]
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
  // Returns true/false if mention text matches the passed simple command (command with no paramters)
  matchSimpleCommand(cmd, e, ct) {
    const normalizedText = e.text.toLowerCase().trim();
    const botUserLower = ct.botUserId.toLowerCase();
    const cmdInput = cmd.toLowerCase().trim();
    return (normalizedText === `<@${botUserLower}> ${this.getRotation(e.text)} ${cmdInput}`);
  },
  /*----
    Parse commands for specific rotations
    '@rota "[rotation-name]" [command] [parameters]'
      - must begin with bot mention <@BOTID>
      - must have rotation name in "double quotes" (accommodates accidental case changes)
      - must have command in letters (accommodates accidental case changes)
    @Params: command, event, context
    @Returns: object, or null
  ----*/
  parseCmd(cmd, e, ct) {
    const cmdConfig = this.commands[cmd];
    const safeText = e.text.trim();
    const res = [...safeText.matchAll(cmdConfig.regex)][0];
    // Text must start with bot user mention
    if (res && res[1] === ct.botUserId) {
      // If command expects a rotation name and parameters
      if (cmdConfig.rotaReq && cmdConfig.params) {
        const rotation = res[2];
        const command = res[3];
        const params = res[4];
        if (rotation && command && params) {
          return {
            rotation: rotation,
            command: command,
            params: params.trim()
          };
        }
      } else if (cmdConfig.rotaReq && !cmdConfig.params) {
        const rotation = res[2];
        const command = res[3];
        if (rotation && command) {
          return {
            rotation: rotation,
            command: command
          };
        }
      } else if (!cmdConfig.rotaReq && cmdConfig.params) {
        const command = res[2];
        const params = res[3]
        if (command && params) {
          return {
            command: command,
            params: params.trim()
          }
        }
      } else {
        const rotation = res[2];
        const message = res[3];
        if (rotation && message) {
          return {
            command: 'message',
            rotation: rotation,
            params: message
          };
        }
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