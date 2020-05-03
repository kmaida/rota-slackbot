const helpArr = require('./blocks-help');
const store = require('./../utils/store');

/*------------------
    BLOCKS: HOME
------------------*/
const staffAssign = (userID) => {
  const storeList = store.getStoreList();
  const results = { staff: [], assignments: [] };
  for (const rotation in storeList) {
    const thisRota = storeList[rotation];
    if (thisRota.assigned && thisRota.assigned.includes(userID)) {
      results.assignments.push(rotation);
    }
    if (thisRota.staff && thisRota.staff.length && thisRota.staff.indexOf(`<@${userID}>`) > -1) {
      results.staff.push(rotation);
    }
  }
  console.log(storeList, results);
  return results;
}
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

const homeBlocks = (userID) => {
  const rotaObj = staffAssign(userID);
  const homeArr = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*Hi, <@${userID}>!* Important and timely information first:`
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:bellhop_bell: *Rotations you are currently on call for*:`
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
        "text": `:card_index: *Rotations you are on staff for:*`
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": "Being on staff means even if you're not _currently_ on duty, you will be assigned to these rotations at regular intervals."
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
  const footerArr = [
    {
      "type": "divider"
    },
    {
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": ":hammer_and_wrench: This app was built by <https://twitter.com/KimMaida|*@KimMaida*>. The source code can be found on GitHub at <https://github.com/kmaida/rota-slackbot|*rota-slackbot*>."
        }
      ]
    }
  ];

  return homeArr.concat(helpArr).concat(footerArr);
};

module.exports = homeBlocks;