# rota-slackbot

Rota is a Slack app + bot I wrote for internal company use to manage team rotations. This app was built with the [Bolt JavaScript Slack app framework](https://github.com/slackapi/bolt).

## Commands

* `@rota new "[new-rotation-name]" [description]` creates a new rotation; rotation names can contain _only_ lowercase letters, numbers, and hyphens. Technically the description is optional, but everyone will benefit if you provide one.
* `@rota delete "[rotation]"` deletes the rotation completely (use with caution!).
* `@rota "[rotation]" description [new description]` updates the description for a rotation.
* `@rota "[rotation]" staff [@user1 @user2 @user3]` adds staff to a rotation; a space-separated list of usernames is expected as a parameter with usernames in the order of desired rotation (rotations with a staff list can be assigned using `assign next`).
* `@rota "[rotation]" reset staff` clears a rotation's staff list (use with caution!).
* `@rota "[rotation]" assign [@user] [optional handoff message]` assigns someone to the rotation and, optionally, sends a DM to them with handoff information.
* `@rota "[rotation]" assign next [optional handoff message]` assigns the next person in the staff list to a rotation and, optionally, sends a DM to them with handoff information.
* `@rota "[rotation]" unassign` removes the current user assignment for a rotation.
* `@rota "[rotation]" who` reports the name of a rotation's assigned user.
* `@rota "[rotation]" about` displays the rotation's description and on-call user publicly, and displays the staff list only to the user who issued the commend (this is to prevent excessive notifications for everyone on staff).
* `@rota "[rotation]" [message]` sends a direct message to the on-call user for the rotation, notifying them that your message needs attention.
* `@rota list` displays a list of all currently known rotations.
* `@rota help` shows how to use the bot.

## Tips

Rota does **not** handle _message scheduling_ or _automate_ rotation assignments. But don't worry — since `@rota` is a bot and not slash commands, it plays well with others! Here are some ways you can use the `@rota` bot in conjunction with other Slack features / third party apps.

### Rotation Reminders

You can set a recurring reminder with Slack's `/remind` slash command to remind a rotation's on-call user to assign the next person in the rotation at some regular interval. This must be done at the channel level. You must ensure that Rota has been added to the channel you're setting the reminder in, also. For example:

_(With Rota present in a #channel)_
```
/remind [#channel] "@rota "[rotation]" assign the next user in the rotation using `@rota "[rotation]" assign next"` every Monday at 9am
```

Use quotes as shown in the snippet above to avoid unexpected behavior.

**Note:** You _can't_ directly remind the `@rota` _bot_ to do anything. For instance, `/remind @rota "[rotation]" some message in 5 minutes` will _not_ work because it will try to send a direct message to the _bot user_, not a rotation's _assigned human user_. Slack cannot do this, and it will tell you so. When using `/remind`, you need to set the reminder _in a channel_. Reminders come from Slackbot, and Rota and Slackbot can't talk to each other.

### Scheduling Messages

You can schedule messages to be delivered later. This is useful in case the on-call user is outside of hours. This works with both the built-in `/remind` slash task (similar to above), and also with third party Slack apps like [Gator](https://www.gator.works/). Schedule the message _in a channel_ that the `@rota` bot has been added to. Like so:

_(In a #channel)_
```
/gator @rota "[rotation]" I need some help with task XYZ please
```

**Note:** Keep in mind that if you use `/remind`, the message will come from `@Slackbot`, _not from your username_. If you need the person on rotation to know the message was from _you_, either include your username in the reminder when you set it up, or use a third-party app that delivers the message later from your account (e.g., Gator does this).

**Caveat:** Because the company I work(ed) at used [Gator](https://www.gator.works/), Rota has been tested with `/remind` (which is part of Slack's core) and `/gator` (this testing occurred a while back, so it may be out of date if Gator has made significant updates to their API). If you use a different third-party scheduling Slack app, keep in mind that its interactions with Rota are _untested_ and I make _no guarantees_ the integrations will work together. (If you want to submit issues requesting additional third party integration support, you may use the `help wanted` label because their maintenance will be up to the community. Please feel free to fork this repo, add support, and then [submit a PR](https://github.com/kmaida/rota-slackbot/pull/new/master).)

## Development

**Prerequisite**: A Slack workspace that you can test in (without disturbing or spamming your coworkers 😛). You can [create a new Slack workspace for free here](https://slack.com/get-started#/create).

### Slack App Initial Setup

1. [Create a new Slack app](https://api.slack.com/apps/new).
2. Name your app `rota` and select your preferred development Slack workspace.
3. In the **OAuth & Permissions** section, add "Bot Token Scopes" for `app_mentions:read`, `chat:write`, and `incoming-webhook`.
4. Under **App Home**, make sure your bot and app's name are `rota`.
  * Toggle on "Always Show My Bot as Online".
  * Enable the Home Tab.
  * Enable the Messages Tab.
5. Under **Incoming Webhooks**, click the toggle to switch "Activate Incoming Webhooks" `On`.
6. Under **Install App**, click the "Install to Workspace" button to install to your team workspace. When prompted, choose a channel to install to (it can be any channel.) This will generate a "Bot User OAuth Access Token" (which you will need in order to configure your local environment variables). The token will be displayed after you've installed your app. _Note that if you update any Scopes later, you'll have to reinstall your app._

### Database Setup

1. You can use [mongoDB Atlas](https://cloud.mongodb.com/) to persist the rotation data store. [Sign up for an account](https://www.mongodb.com/cloud/atlas/register) and create a FREE cluster.
2. Select your preferred **Cloud Provider & Region**. You may also give your cluster a name if you like.
3. Your cluster will take a few minutes to deploy.
4. Once it's complete, click the **CONNECT** button. This will open a modal where you can set up a connection to your database.
5. Click **Add a Different IP Address** and enter `0.0.0.0/0`. This allows connections from any IP (keep in mind you should ensure good authentication with this.)
6. **Create a MongoDB User**. This is a _database user_, and these credentials will be used in your `MONGO_URI`. Enter a Username and use the button to Autogenerate Secure Password. Make note of the username and password, then click "Create MongoDB User" and then proceed to the next step.
7. In **Choose a Connection Method**, select "Connect your application." Use `Node.js` as the driver with the latest version available. Then copy the "Connection String Only."
8. In a text file or other secure place (such as a password manager), paste the copied connection string and _modify_ it to replace `<username>` and `<password>` with the credentials you just created in the previous step. Replace the database name (`test`) with a name of your choosing (e.g., `rota`).

### Code and Configuration Setup

1. Clone this repository locally to your desktop.
2. Rename the `.env_sample` file to `.env` and update the placeholder info with the appropriate configuration from your [Slack app settings](#slack-app-initial-setup) and [MongoDB Atlas connection](#database-setup).
3. From your cloned directory, run `$ npm install` to install dependencies.
4. Run `$ npm start` to start the app on the port specified in your `.env` file.
5. Download and use [ngrok](https://ngrok.com) to expose a public URL for your local web server.
6. Once you have ngrok pointing to your Slack app's local development environment and the server is running, go to your **Slack App settings** and in the **Event Subscriptions** section, toggle `On` "Enable Events."
7. For the "Request URL," enter `https://your-ngrok-url/slack/events`.
8. In "Subscribe to bot events," add `app_mention` and `app_home_opened`.

## Deployment

Follow the [development instructions again](#development) to create a new Slack app, but **in your production workspace**.

The Slack app should be deployed with the following:

* Node server stays running
* SSL
* Public URL (you do _not_ need a pretty URL, since the URL is never displayed; it's only for Slack app configuration)

If you're very comfortable with Linux devops, Let's Encrypt, and have a domain name, I recommend [DigitalOcean](https://www.digitalocean.com/pricing/) as a VPS if you've got other applications to deploy as well. This will keep costs down, as some providers (such as Heroku) charge per app.

If you want fast, easy deployments with CI/CD features and don't want to deal with devops, domains, or configuring SSL, I recommend a [hobby dyno on Heroku](https://www.heroku.com/pricing).

**Note:** A _free_ dyno on Heroku _will not work well_ because the app will sleep after 30 minutes, which causes long response times when it needs to wake back up.

If using DigitalOcean (or a similar VPS), input your production environment variables in a `.env` file on your server.

If using Heroku, set up an app, push to your Heroku app using Git, then input your production environment variables in your Heroku app Settings (Heroku will not use your `.env` file).

**Important:** Whatever deployment option you choose, once you have a public domain for your Slack app with SSL, go into your production Slack app settings and update the **Event Subscriptions** Request URL to `https://your-public-url/slack/events`.

---

[MIT License](LICENSE)
