/*------------------
    BLOCKS: HELP
------------------*/

const helpBlocks = [
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":wave: Hi there! I'm your friendly *Rotation Bot* :arrows_counterclockwise::robot_face: My role is to help manage many different rotations across teams and across the company."
    }
  },
  {
    "type": "divider"
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':speech_balloon: *If you need help with a rotation, post a message to any channel I\'ve been added to and mention `@rota "[rotation-name]" [your message]`*. The person on duty for the rotation will be notified!'
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
      "text": ':sparkles: `@rota "[rotation-name]" create [rotation description]` creates a new rotation. `rotation-name` can contain _only_ lowercase letters, numbers, and hyphens.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':information_source: `@rota "[rotation-name]" about` displays the description (and currently on-call user) for a rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':busts_in_silhouette: `@rota "[rotation-name]" staff [@user1 @user2 @user3]` saves a staff list for a rotation. It expects a space-separated list of user mentions in the order you want the assignments to rotate. Assignment still needs to be triggered when appropriate, but you can use `@rota "[rotation-name]" assign next` to do so. Duplicates will be removed, so if you need someone to pull double duty, you\'ll have to do that assignment by username.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':information_desk_person: `@rota "[rotation-name]" assign [@user] [optional handoff message]` assigns someone to a rotation. Optionally, I can also deliver any handoff information they should know when starting their rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':arrows_counterclockwise: `@rota "[rotation-name]" assign next [optional handoff message]` assigns the _next person in the staff list_ to a rotation. If there is nobody currently assigned or the current user is not in the staff list, I\'ll start at the beginning of the list. Optionally, I can also deliver any handoff information they should know when starting their rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':bust_in_silhouette: `@rota "[rotation-name]" who` reports the name of the person who is on duty for a rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':eject: `@rota "[rotation-name]" clear` removes the current assignment for a rotation.'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':x: `@rota "[rotation-name]" delete` wipes any record of a rotation\'s existence from my memory. _Use with caution!_'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":clipboard: `@rota list` displays a list of all rotations I\'m keeping track of at the moment."
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ':phone: `@rota "[rotation-name]" [message]` contacts a rotation\'s on-call user. I send a DM telling them your message needs attention. They\'ll follow up at their earliest convenience. _(Kindly keep in mind they may be busy or outside working hours.)_'
    }
  },
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ":question: `@rota help` shows this help message."
    }
  }
];

module.exports = helpBlocks;