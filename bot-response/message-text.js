/*------------------
    MESSAGE TEXT
------------------*/

const msgText = {
  createConfirm: (rotation) => {
    return ':sparkles: The *' + rotation + '* rotation has been created. You can now assign someone to be on-call for this rotation or add a staff list. Use `@rota help` to learn more.';
  },
  createError: (rotation) => {
    return 'The *' + rotation + '* rotation already exists. You can assign someone to be on-call with `@rota "' + rotation + '" assign [@user]`.';
  },
  staffConfirm: (rotation) => {
    return ':busts_in_silhouette: The *' + rotation + '* rotation staff list has been saved! You can now use `@rota "' + rotation + '" assign next` to rotate assignments.\nWhen using `next`, if the currently on-call person is not in the staff list, the assignment will default to the _first person_ in the rotation.\n_(Note: I remove duplicates. If you want someone to pull double duty, you\'ll need to do a username assignment.)_';
  },
  staffEmpty: (rotation) => {
    return `:disappointed: I didn't understand that staff list. I think it's empty. To save staff, please make sure you pass me a space-separated list of valid usernames.\n_(Note: I can also understand a comma+space separated list, but that's just more typing for you!)_`;
  },
  staffError: (rotation) => {
    return ':shrug: I couldn\'t save staff for a "' + rotation + '" rotation because it does not exist. To create this rotation, first tell me `@rota "' + rotation + '" create [description]`, _then_ set up staffing.';
  },
  resetStaffConfirm: (rotation) => {
    return `:ghost: The staff list for the *${rotation}* rotation has been reset and is empty.`;
  },
  resetStaffError: (rotation) => {
    return ':shrug: I couldn\'t reset the staff list for a "' + rotation + '" rotation because it does not exist. To create this rotation, first tell me `@rota "' + rotation + '" create [description]`. It will initialize with no staff by default.';
  },
  deleteConfirm: (rotation) => {
    return `:put_litter_in_its_place: The *${rotation}* rotation has been deleted.`;
  },
  deleteError: (rotation) => {
    return `:shrug: There is no rotation called "${rotation}." Nothing changed.`;
  },
  aboutReport: (rotation, description, assigned) => {
    const assignment = assigned ? ' (`' + assigned + '`)' : '';
    return `:information_source: *${rotation}*: ${description}${assignment}`;
  },
  aboutError: (rotation) => {
    return ':shrug: I couldn\'t get any info about a "' + rotation + '" rotation because it does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  assignConfirm: (usermention, rotation) => {
    return `:information_desk_person: ${usermention} is now on-call for the *${rotation}* rotation.`;
  },
  assignDMHandoff: (rotation, handoffMsg) => {
    return `:telephone: You are now on-call for the *${rotation}* rotation and have received the following handoff message:\n>${handoffMsg}`;
  },
  assignHandoffConfirm: (usermention, rotation) => {
    return `Your handoff message for the *${rotation}* rotation has been sent to ${usermention} via direct message.`;
  },
  assignNextError: (rotation) => {
    return ':shrug: I couldn\'t assign the next person in the *' + rotation + '* rotation because there is nobody in the rotation staff list.\nTo set staff, use `@rota "' + rotation + '" staff [@user1 @user2 @user3]`.\nThen you can use `@rota "' + rotation + '" assign next [optional handoff message]` to rotate to the next user on staff.\nIf you don\'t want to use a staff list, assign someone directly by username: `@rota "' + rotation +'" assign [@user] [optional handoff message]`.';
  },
  assignError: (rotation) => {
    return ':shrug: I couldn\'t complete this assignment because a "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
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
    return ':bust_in_silhouette: `' + usermention + '` is on duty for the *' + rotation + '* rotation. To notify them directly, use: `@rota "' + rotation + '" [message]`.';
  },
  whoUnassigned: (rotation) => {
    return 'Nobody is currently assigned to the *' + rotation + '* rotation. To assign someone, use `@rota "' + rotation + '" assign [@user] [optional handoff message]`.';
  },
  whoError: (rotation) => {
    return ':shrug: I couldn\'t find any on-call user because a "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`. You can then assign someone using `@rota "' + rotation + '" assign [@user] [optional handoff message]`.';
  },
  unassignConfirm: (rotation) => {
    return `The *${rotation}* rotation has been unassigned. Nobody is on duty.`;
  },
  unassignNoAssignment: (rotation) => {
    return `There is currently nobody assigned to the *${rotation}* rotation. Nothing changed.`;
  },
  unassignError: (rotation) => {
    return ':shrug: I couldn\'t clear this assignment because a "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  confirmChannelMsg: (rotation, sentByUserID) => {
    return `:speech_balloon: The on-call user for *${rotation}* has been notified about <@${sentByUserID}>'s message.`;
  },
  confirmEphemeralMsg: (rotation) => {
    return 'The person currently on-call for *' + rotation + '* will respond at their earliest convenience. Keep in mind: they might be busy or outside working hours.\n:rotating_light: If it\'s *very urgent* and nobody replies within 15 minutes, ping the appropriate `[@usergroup]`.';
  },
  nobodyAssigned: (rotation) => {
    return 'Nobody is currently assigned to the *' + rotation + '* rotation. To assign someone, use `@rota "' + rotation + '" assign [@user] [optional handoff message]` or assign the next person in the rotation staff list with `@rota "' + rotation + '" assign next [optional handoff message]`.';
  },
  dmToAssigned: (rotation, sentByUserID, channelID, link) => {
    return `Hi there! <@${sentByUserID}> needs your attention in <#${channelID}> (${link}) because you're on-call for the *${rotation}* rotation.\n\n`;
  },
  msgError: (rotation) => {
    return ':shrug: I couldn\'t tell anyone about the message because a "' + rotation + '" rotation does not exist. To create it, use `@rota "' + rotation + '" create [description]`.';
  },
  didntUnderstand: () => {
    return ":thinking_face: I'm sorry, I didn't understand that. To see my full capabilities, try typing `@rota help`.";
  },
  error: (err) => {
    return "An error occurred:\n```" + JSON.stringify(err) + "```";
  }
}

module.exports = msgText;