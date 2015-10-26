# clubhouse-slack-filter

Filter messages that come from clubhouse into slack

## Usage

* Clone this repo
* Use `heroku create` to create a new heroku app
* `heroku config:set CLUBHOUSE_MESSAGE_REGEX="^\[devops](.*?)to Done"` to set up which messages the filter will pass along to Slack. Make sure you escape backslashes in the regex.
* `heroku config:set EMBELLISHMENT=":tada: |MESSAGE|" to prepend the `:tada:` emoji before the message, or anything else you want
* Go to slack.com and *Configure Integrations*, choose *Incoming Webhooks* and set up a new webhook.
* Take the Webhook URL and do `heroku config:set SLACK_HOOK_URL=https://...`
* `git push heroku master` to deploy the app
