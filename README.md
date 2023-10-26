# scia-notify-bot
Notification Telegram Bot for Student committee of international affairs of Dnipro National University  
**Created with** [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

# Setup
- Clone git repository:  
`git clone https://github.com/slymachenko/scia-notify-bot.git`
- Open project root directory.
- Create `config.env` file with these parameters:
```
TOKEN=*Telegram bot token*
MONGO_URL=*MongoDB connection string*
ADMIN_CODE=*ADMIN_CODE*
PORT=*PORT*
```
- Download all dependencies:  
`npm install`
- Start ngrok:  
`npx ngrok http *PORT*`
- Start bot with  
`npm start`  
or  
`npm run start-dev`

# Usage
- Find **@`your bot id`** in telegram search
- Click **Start**

# Command list
Users:  
`/start` - start the bot  
`/help` - help information    
`/events` - a list of upcoming events  
`/notify` - notifications from the bot will be received as usual  
`/silent` - messages from the bot will be sent without sound  
`/stop` - stop sending notifications

Send an admin code specified in the `config.env` file in order to get access to more commands

Admin users:  
`/create_event` - create an event  
`/delete_event` - delete an event  
