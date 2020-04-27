/*------------------
     UTILITIES
------------------*/

const utils = {
  // Returns true/false if mention text matches the passed simple command (command with no paramters)
  matchSimpleCommand(cmd, e, ct) {
    const normalizedText = e.text.toLowerCase().trim();
    const botUserLower = ct.botUserId.toLowerCase();
    const cmdInput = cmd.toLowerCase().trim();
    return (normalizedText === `<@${botUserLower}> ${this.getRotation(e.text)} ${cmdInput}`);
  },
  // Takes raw message text and extracts user assignment ID in a message-safe format
  getAssignmentMsgTxt(text) {
    if (text) {
      return text
        .toUpperCase()                    // Normalize for inconsistency with "assign" text
        .split('" ASSIGN ')[1]            // Split into array and get first segment after "assign"
        .match(/<@U[A-Z0-9]+?>/g)[0]      // Match only the first user ID (in case multiple were provided)
        .toString();                      // Array to string
      // Expected output: '<@U01238R77J6>'
    }
  },
  // Parse commands in format:
  // @rota "rotation-name" command message text
  parseCommand(text) {
    const cmdRegex = /^(<@U[A-Z0-9]+?>) "([a-z\-]+?)" ([A-Za-z]*?) (.*)/g;
    const safeText = text + ' ';  // Add a whitespace because regex is hard :P
    const res = [...safeText.matchAll(cmdRegex)][0];
    // @TODO: check that the bot ID matches the beginning of the string
    return {
      rotation: res[2],
      command: res[3],
      message: res[4]
    };
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