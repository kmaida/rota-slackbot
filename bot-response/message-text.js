/*------------------
    MESSAGE TEXT
------------------*/

const msgText = {
  assignmentConfirm: (usermention, rotation) => {
    return `${usermention} is now on-call for "${rotation}."`;
  },
  assignmentIncomplete: (rotation) => {
    return 'I couldn\t complete this assignment because the "' + rotation + '" does not exist yet. To create it, use `@rota setup ' + rotation + '`';
  },
  whoReport: (usermention, rotation) => {
    return '`' + usermention + '` is on-call for ' + rotation + '. To notify them directly, use: `@rota "' + rotation + ' [message]`';
  },
  whoUnassigned: (rotation) => {
    return 'Nobody is currently assigned to the "' + rotation + '." rotation. To assign someone, use `@rota ' + rotation + ' assign [@user]`.';
  },
  whoError: (err) => {
    return 'An error occurred trying to determine who is on-call:\n```' + JSON.stringify(err) + '```';
  },
  clearConfirm: (rotation) => {
    return `Concierge for "${rotation}" has been unassigned.`;
  },
  clearNoAssignment: (rotation) => {
    return `There is currently nobody assigned to the "${rotation}" rotation. Nothing changed.`;
  },
  confirmChannelMsg: (rotation, sentByUserID) => {
    return `:speech_balloon: The on-call user for "${rotation}" has been notified about <@${sentByUserID}>'s message.`;
  },
  confirmEphemeralMsg: (rotation) => {
    return 'The person currently on-call for "' + rotation + '" will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.\n:rotating_light: If it\'s *very urgent* and nobody replies within 15 minutes, ping the appropriate `[@usergroup]` or use `@here`.\n:fire: If *it\'s a _huge emergency_*, use `@channel`.';
  },
  noConciergeAssigned: (rotation) => {
    return 'Nobody is currently assigned for "' + rotation + '." To assign someone, use `@rota "' + rotation + '" assign [@user]`.';
  },
  dmToConcierge: (sentByUserID, channelID, link) => {
    return `Hi there! <@${sentByUserID}> needs your attention in <#${channelID}> (${link}) because you're on-call for *${rotation}*."\n\n`;
  },
  error: (err) => {
    return "Sorry, I couldn't do that because an error occurred:\n```" + JSON.stringify(err) + "```";
  }
}

module.exports = msgText;