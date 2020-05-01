/*------------------
    MESSAGE TEXT
------------------*/

const msgText = {
  createConfirm: (rotation) => {
    return ':sparkles: The "' + rotation + '" rotation has been created. You can now assign someone to be on-call for this rotation: `@rota "' + rotation + '" assign [@user]`.';
  },
  createError: (rotation) => {
    return 'The "' + rotation + '" rotation already exists. You can assign someone to be on-call with `@rota "' + rotation + '" assign [@user]`.';
  },
  deleteConfirm: (rotation) => {
    return `:put_litter_in_its_place: The "${rotation}" rotation has been deleted.`;
  },
  deleteError: (rotation) => {
    return `:shrug: There is no rotation called "${rotation}." Nothing changed.`;
  },
  aboutReport: (rotation, description, assigned) => {
    const assignment = assigned ? ' (`' + assigned + '`)' : '';
    return `:information_source: *${rotation}*: ${description}${assignment}`;
  },
  aboutError: (rotation) => {
    return ':shrug: The "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  assignConfirm: (usermention, rotation) => {
    return `:information_desk_person: ${usermention} is now on-call for the "${rotation}" rotation.`;
  },
  assignError: (rotation) => {
    return ':shrug: I couldn\'t complete this assignment because the "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  listReport: (list) => {
    let msgStr = '';
    const assignment = (item) => {
      return !!item.assigned ? ' (`' + item.assigned + '`)' : ' (_unassigned_)';
    };
    for (const rotation in list) {
      msgStr = msgStr + `• *${rotation}*: ${list[rotation].description}${assignment(list[rotation])}\n`;
    }
    return `:clipboard: Here are all the rotations I know about:\n${msgStr}`;
  },
  listEmpty: () => {
    return ':clipboard: There are no rotations saved right now. To create one, tell me `@rota "[rotation-name]" create [description]`.';
  },
  whoReport: (usermention, rotation) => {
    return ':bust_in_silhouette: `' + usermention + '` is on duty for the "' + rotation + '" rotation. To notify them directly, use: `@rota "' + rotation + '" [message]`.';
  },
  whoUnassigned: (rotation) => {
    return 'Nobody is currently assigned to the "' + rotation + '" rotation. To assign someone, use `@rota "' + rotation + '" assign [@user]`.';
  },
  whoError: (rotation) => {
    return ':shrug: I couldn\'t find any on-call user because the "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`. You can then assign someone using `@rota "' + rotation + '" assign [@user]`.';
  },
  clearConfirm: (rotation) => {
    return `The "${rotation}" rotation has been unassigned. Nobody is on duty.`;
  },
  clearNoAssignment: (rotation) => {
    return `There is currently nobody assigned to the "${rotation}" rotation. Nothing changed.`;
  },
  clearError: (rotation) => {
    return ':shrug: I couldn\'t clear this assignment because the "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  confirmChannelMsg: (rotation, sentByUserID) => {
    return `:speech_balloon: The on-call user for "${rotation}" has been notified about <@${sentByUserID}>'s message.`;
  },
  confirmEphemeralMsg: (rotation) => {
    return 'The person currently on-call for "' + rotation + '" will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.\n:rotating_light: If it\'s *very urgent* and nobody replies within 15 minutes, ping the appropriate `[@usergroup]`.';
  },
  nobodyAssigned: (rotation) => {
    return 'Nobody is currently assigned to the "' + rotation + '" rotation. To assign someone, use `@rota "' + rotation + '" assign [@user]`.';
  },
  dmToAssigned: (rotation, sentByUserID, channelID, link) => {
    return `Hi there! <@${sentByUserID}> needs your attention in <#${channelID}> (${link}) because you're on-call for the *${rotation}* rotation.\n\n`;
  },
  msgError: (rotation) => {
    return ':shrug: I couldn\'t tell anyone about the message because the "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  didntUnderstand: () => {
    return ":thinking_face: I'm sorry, I didn't understand that. To see my full capabilities, try typing `@rota help`.";
  },
  error: (err) => {
    return "Sorry, I couldn't do that because an error occurred:\n```" + JSON.stringify(err) + "```";
  }
}

module.exports = msgText;