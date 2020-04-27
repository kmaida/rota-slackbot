/*------------------
    BLOCKS: HELP
------------------*/

const helpBlocks = (channelMsgFormat) => {
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":wave: Hi there! I'm your friendly *Concierge Bot* :bellhop_bell::robot_face: My role is to make it easier (and less noisy) for people with questions to get help from the right folks. I work on a *per-channel* basis, meaning each channel I'm added to can have a different concierge assignment."
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "To *get started*, talk with " + channelMsgFormat + "'s admin / team about *how I should be staffed*. :thinking_face: For example, assignments could rotate every week in alphabetical order by first name."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*I can be re-assigned on the fly* if someone goes on PTO or anything changes!"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":speech_balloon: *If you need help in " + channelMsgFormat + " but don't know who to ask, post a message to the channel and mention `@concierge`*. The assigned concierge will be notified and they can respond / coordinate to make sure the right people see the message. That way, everyone in " + channelMsgFormat + " doesn't need to constantly check _every_ message that comes through (that's really not scalable!)."
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Here's how I work:*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "`@concierge assign [@user]` assigns someone to " + channelMsgFormat + " concierge."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "`@concierge who` reports the name of the assigned concierge in " + channelMsgFormat + "."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "`@concierge clear` removes the current assignment for " + channelMsgFormat + "."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "`@concierge help` shows this help message."
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "`@concierge [message]` should explain what you need assistance with. A DM is then sent to " + channelMsgFormat + "'s concierge, notifying them that your message needs attention. They'll get to your message at their earliest convenience."
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":rotating_light: *If your message is very urgent* and the concierge doesn't respond in 15 minutes (they might be busy or outside working hours), then you can use `@here`.\n:fire: If everything is on fire and *it's a _huge emergency_*, you can use `@channel`."
      }
    }
  ];
}

module.exports = helpBlocks;