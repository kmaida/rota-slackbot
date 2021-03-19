const introArr = require('./blocks-intro');
const commandsArr = require('./blocks-commands');

/*------------------
    BLOCKS: HOME
------------------*/
const homeBlocks = (userID, storeList) => {
  // Return an object of staff and assignments
  const staffAssign = (userID) => {
    const results = { staff: [], assignments: [] };
    for (const rotation in storeList) {
      const thisRota = storeList[rotation];
      if (thisRota.assigned && thisRota.assigned.includes(userID)) {
        results.assignments.push(thisRota.name);
      }
      if (thisRota.staff && thisRota.staff.length && thisRota.staff.indexOf(`<@${userID}>`) > -1) {
        results.staff.push(thisRota.name);
      }
    }
    return results;
  }
  // Take an array and output a text list
  const mdList = (arr) => {
    let str = '';
    for (const item of arr) {
      str = str + `• ${item}\n`;
    }
    if (str.length) {
      return str;
    }
    return '_None at the moment!_';
  }
  const rotaObj = staffAssign(userID);
  const homeArr = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:bellhop_bell: *<@${userID}>'s Active On-Call Rotations:*`
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "You are actively on duty for these rotations right now. Please make sure you are tending to your rotation responsibilities. You may also receive direct messages from me letting you know if people need help."
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": mdList(rotaObj.assignments)
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:card_index: *<@${userID}> Is On Rotation Staff:*`
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "Being on staff means even if you're not on duty _right now_, you will be assigned to these rotations at regular intervals."
        }
      ]
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": mdList(rotaObj.staff)
      }
    },
    {
      "type": "divider"
    }
  ];

  const tipsArr = [
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Helpful Tips:*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "I do _not_ control things like reminders, automated rotation scheduling, or delayed delivery of messages. However, because I'm a _bot_ and not a slash command, I play well with others! Here are some ways you can use the <@rota> bot with other Slack features and third party apps."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":spiral_calendar_pad: *Scheduling Rotation Assignments*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "You can manage rotation assignments however you want. For example, you can set a recurring reminder with Slack's `/remind` to prompt a rotation's on-call user to assign the next person on staff at a regular interval. Like so:"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": '```/remind [#channel] "@rota "[rotation]" assign the next user in the rotation using `@rota "[rotation]" assign next`" every Monday at 9am```'
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Note:* You can't _directly_ remind me to do something. For instance: `/remind @rota \"[rotation]\" message in 5 minutes` will _not_ work because <@slackbot> isn't allowed to send reminders to <@rota> — another _bot user_. When using `/remind`, you need to send the reminder _to a channel_. This ensures the message is delivered to the rotation's _assigned human user_."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":alarm_clock: *Scheduling Messages*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "You can schedule messages to be delivered later. This works with both the built-in `/remind` slash command (similar to above), and also with third party Slack apps like <https://www.gator.works/|Gator>. Just schedule the message _in a channel_ that I've been added to. For example:"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": '```/gator @rota "[rotation]" I need some help with task XYZ please!```'
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Note:* If you use `/remind`, the message will come from <@slackbot>, _not_ from your username."
      }
    }
  ];

  const footerArr = [
    {
      "type": "divider"
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": ":hammer_and_wrench: This app was built by <https://twitter.com/KimMaida|@KimMaida>. The source code can be found on GitHub at <https://github.com/kmaida/rota-slackbot|rota-slackbot>."
        }
      ]
    }
  ];

  return introArr.concat(homeArr).concat(commandsArr).concat(tipsArr).concat(footerArr);
};

module.exports = homeBlocks;