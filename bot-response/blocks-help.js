const introArr = require('./blocks-intro');
const commandsArr = require('./blocks-commands');

/*------------------
    BLOCKS: HELP
------------------*/
const helpBlocks = () => {
  const appHome = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `:house: *Visit your <slack://app?team=${process.env.SLACK_TEAM_ID}&id=${process.env.SLACK_APP_ID}&tab=home|App Home>* to find out which rotations you're currently on _active duty_ or _on staff_ for.`
      }
    },
    {
      "type": "divider"
    }
  ];
  return introArr.concat(appHome).concat(commandsArr);
};

module.exports = helpBlocks;