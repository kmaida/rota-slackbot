const introArr = require('./blocks-intro');
const commandsArr = require('./blocks-commands');

/*------------------
    BLOCKS: HELP
------------------*/
const helpBlocks = () => {
  return introArr.concat(commandsArr);
};

module.exports = helpBlocks;