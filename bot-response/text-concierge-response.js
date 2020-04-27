/*------------------
    MESSAGE TEXT
------------------*/

const msgText = {
  confirmAssignment: (assigned, channelMsgFormat) => {
    return `${assigned} is now the concierge for ${channelMsgFormat}.`;
  },
  errorAssignment: (err) => {
    return 'An error has occurred while trying to assign the concierge for this channel:\n```' + JSON.stringify(err) + '```';
  },
  reportWho: (conciergeNameMsgFormat, channelMsgFormat) => {
    return '`' + conciergeNameMsgFormat + '` is the concierge for ' + channelMsgFormat + '. To notify them directly, mention `@concierge` in your message.';
  },
  reportWhoUnassigned: (channelMsgFormat) => {
    return 'Nobody is currently assigned as concierge for ' + channelMsgFormat + '. To assign someone, use `@concierge assign [@user]`.';
  },
  errorWho: (err) => {
    return 'An error occurred trying to determine the concierge:\n```' + JSON.stringify(err) + '```';
  },
  confirmClear: (channelMsgFormat) => {
    return `Concierge for ${channelMsgFormat} has been unassigned.`;
  },
  clearNoAssignment: () => {
    return 'There is currently nobody assigned as concierge for this channel. Nothing changed.';
  },
  errorClear: (err) => {
    return 'An error has occurred while trying to clear the concierge assignment:\n```' + JSON.stringify(err) + '```';
  },
  confirmChannelConciergeMsg: (channelMsgFormat, sentByUser) => {
    return ":speech_balloon: The " + channelMsgFormat + " concierge has been notified about <@" + sentByUser + ">'s message.";
  },
  confirmEphemeralConciergeMsg: () => {
    return "The concierge will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.\n:rotating_light: If it's *very urgent* and nobody replies within 15 minutes, ping the appropriate `[@usergroup]` or use `@here`.\n:fire: If *it's a _huge emergency_*, use `@channel`.";
  },
  noConciergeAssigned: (channelMsgFormat) => {
    return 'Nobody is currently assigned as concierge for ' + channelMsgFormat + '. To assign someone, use `@concierge assign [@user]`.';
  },
  dmToConcierge: (sentByUser, channelMsgFormat, link) => {
    return `Hi there! <@${sentByUser}> needs your attention in ${channelMsgFormat} (${link}).\n\n`;
  },
  errorContactingConcierge: (err) => {
    return 'An error occurred contacting the concierge:\n```' + JSON.stringify(err) + '```';
  }
}

module.exports = msgText;