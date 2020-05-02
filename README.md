# Rota

`rota` is a Slackbot I wrote for internal team use at [Gatsby](https://gatsbyjs.com) to manage team rotations. This app was built with the [Bolt JavaScript Slack app framework](https://github.com/slackapi/bolt).

## Usage

* `@rota "[new-rotation-name]" create [description]` creates a new rotation; rotation names can contain _only_ lowercase letters, numbers, and hyphens
* `@rota "[rotation]" staff [@user1 @user2 @user3]` adds staff to a rotation; a space-separated list of usernames is expected as a parameter with usernames in the order of desired rotation (rotations with a staff list can be assigned using `assign next`)
* `@rota "[rotation]" reset staff` clears a rotation's staff list
* `@rota "[rotation]" assign [@user] [optional handoff message]` assigns someone to the rotation and, optionally, sends a DM to them with handoff information
* `@rota "[rotation]" assign next [optional handoff message]` assigns the next person in the staff list to a rotation and, optionally, sends a DM to them with handoff information
* `@rota "[rotation]" unassign` removes the current user assignment for a rotation
* `@rota "[rotation]" who` reports the name of a rotation's assigned user
* `@rota "[rotation]" about` displays the rotation's description and on-call user
* `@rota "[rotation]" delete` deletes the rotation completely
* `@rota "[rotation]" [message]` sends a direct message to the on-call user for the rotation, notifying them that your message needs attention
* `@rota list` displays a list of all currently known rotations
* `@rota help` shows how to use the bot

Here are some ways you can use the `@rota` bot in conjunction with other Slack features / third party apps.

### Rotation Reminders

You can manage rotations in whatever way makes the most sense for your needs. You can set a recurring reminder with Slack's `/remind` slash command to remind a rotation's on-call user to assign the next person in the rotation at some regular interval. E.g.:

_(In a #channel)_
```
/remind [#channel] @rota "[rotation]" assign the next user in the rotation using `@rota "[rotation]" assign next` every Monday at 9am.
```

**Note:** You can't directly remind "`@rota`" to do something. I.e., `/remind @rota "[rotation]" some message` will _not_ work because it will try to send a direct message to the _bot user_, not any specific rotation's _assigned human user_. When using `/remind`, you need to send the reminder _in a channel_.

### Scheduling Messages

You can also schedule messages to be delivered later. This works with both the built-in `/remind` slash task (similar to above), and also with third party Slack apps like [Gator](https://www.gator.works/) and [/schedule](https://slackscheduler.com/). Just schedule the message _in a channel_ that the `@rota` bot has been added to. E.g.:

_(In a #channel)_
```
/gator @rota "[rotation]" I need some help with task XYZ please
```

**Note:** Keep in mind that if you use `/remind`, the message will come from `@Slackbot`, not from your username. If you need the person on rotation to know the message was from _you_, either include your username in the reminder when you set it up, or use a third-party app that delivers the message on your behalf from your username (e.g., Gator does this).

## Development

**Prerequisite**: A Slack workspace that you can test in (without disturbing or spamming your coworkers 😛). You can [create a new Slack workspace for free here](https://slack.com/get-started#/create).

1. [Create a new Slack app](https://api.slack.com/apps/new).
2. Name your app `concierge` and select your preferred development Slack workspace.
3. Under **App Home**, make sure your bot and app's name are `rota`.
4. Under **Incoming Webhooks**, click the toggle to turn webhooks `On`.
5. In the **OAuth & Permissions** section, add Bot Token Scopes for `app_mentions:read`, `chat:write`, and `incoming-webhook`.
6. Under **Install App**, click the button to install the app to your team workspace. When prompted, choose a channel to install to (it can be any channel.) This will generate a bot user OAuth access token (which you will need to configure your local environment variables).
7. Clone this repository locally.
8. Rename the `.env_sample` file to `.env` and add the appropriate configuration from your Slack app settings.
9. From your cloned directory, run `$ npm install` to install dependencies.
10. Run `$ npm start` to start the app on the port you specified in your `.env` file.
11. Download and use [ngrok](https://ngrok.com) to expose a public URL for your local web server.
12. Once you have ngrok pointing to your Slack app's local development environment and the server is running, enable **Event Subscriptions** for your Slack app in the App settings. For the Request URL, provide `https://your-ngrok-url/slack/events`.
13. Subscribe to `app_mentions` in the Event Subscriptions Bot Events.

**Note:** If you change scopes during development, you may need to _reinstall_ the app to your workspace.

## Deployment

Follow the [development instructions again](#development) to create a new Slack app, but **in your production workspace**.

The Slack app should be deployed with the following:

* Node server stays running
* SSL
* Public URL (you do _not_ need an elegant URL, since the URL is never displayed, it's only for Slack app configuration)

If you're very comfortable with Linux devops, Let's Encrypt, and have a domain name, I recommend [DigitalOcean](https://www.digitalocean.com/pricing/). If you want fast, easy deployments with CI/CD features and don't want to deal with devops, domains, or configuring SSL, I recommend a hobby dyno on [Heroku](https://www.heroku.com/pricing) (a free plan on Heroku will not work well because the app will sleep after 30 minutes, and cause long delays responding when it wakes).

If using DigitalOcean, input your production environment variables in a `.env` file on your server.

If using Heroku, input your production environment variables in your Heroku app settings.

Whatever deployment option you choose, once you have a public domain for your Slack app with SSL, go into your production Slack app settings and update the **Event Subscriptions** Request URL to `https://your-public-url/slack/events`.

---

[MIT License](LICENSE)
