const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const axios = require("axios");

const getResponse = require("./controllers/messageController");
const userController = require("./controllers/userController");
const eventController = require("./controllers/eventController");
const requestController = require("./controllers/requestController");

dotenv.config({ path: "./config.env" });

// connecting to the MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CRONHOOKS_TOKEN = process.env.CRONHOOKS_TOKEN;
const TOKEN = process.env.TOKEN;
const URL = process.env.URL;
const PORT = process.env.PORT;
const ADMIN_CODE = process.env.ADMIN_CODE;

axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Authorization"] = `Bearer ${CRONHOOKS_TOKEN}`;

const bot = new TelegramBot(TOKEN, {
  webHook: {
    port: PORT,
  },
});

bot.setWebHook(`${URL}/bot/${TOKEN}`);

console.log("Bot have been started...");

// COMMAND LISTENERS

bot.onText(/^\/start$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const name = msg.from.first_name;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = {
    parse_mode: "HTML",
  };

  await requestController.clearRequest(userID);

  const response = getResponse(source, { name });

  bot.sendMessage(id, response, options);
});

bot.onText(/^\/help$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);
  const isAdmin = await userController.checkUserAdmin(userID);

  await requestController.clearRequest(userID);

  const response = getResponse(source, { isAdmin });

  bot.sendMessage(id, response, options);
});

bot.onText(/^\/stop$/, async (msg, [source]) => {
  try {
    const { id } = msg.chat;
    const userID = msg.from.id;
    const isUserCreated = await userController.checkUserCreated(userID);
    if (!isUserCreated) await userController.createUser({ userID });
    const options = await userController.getUserPreferences(userID);

    await requestController.clearRequest(userID);

    await userController.deleteUser(userID);

    const response = getResponse(source);

    bot.sendMessage(id, response, options);
  } catch (err) {
    console.error(err);
  }
});

bot.onText(/^\/silent$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);

  await requestController.clearRequest(userID);

  userController.updateUser(userID, { isSilent: true });

  const response = getResponse(source);

  bot.sendMessage(id, response, options);
});

bot.onText(/^\/notify$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);

  await requestController.clearRequest(userID);

  userController.updateUser(userID, { isSilent: false });

  const response = getResponse(source);

  bot.sendMessage(id, response, options);
});

bot.onText(RegExp(ADMIN_CODE), async (msg) => {
  const { id } = msg.chat;
  const source = "/admin";
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);
  const isAdmin = await userController.checkUserAdmin(userID);

  await requestController.clearRequest(userID);

  // if user does not have admin - add, else - remove
  userController.updateUser(userID, { isAdmin: !isAdmin });

  const response = isAdmin
    ? getResponse(source).remove
    : getResponse(source).add;

  bot.sendMessage(id, response, options);
});

bot.onText(/^\/create_event$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);
  const isAdmin = await userController.checkUserAdmin(userID);
  const response = getResponse(source);

  await requestController.clearRequest(userID);

  // return if user is not an admin
  if (!isAdmin) return bot.sendMessage(id, response.adminErr, options);

  await requestController.updateRequest(userID, source);

  bot.sendMessage(id, response.provideName, options);
});

bot.onText(/^\/delete_event$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);
  const isAdmin = await userController.checkUserAdmin(userID);
  const response = getResponse(source);

  await requestController.clearRequest(userID);

  // return if user is not an admin
  if (!isAdmin) return bot.sendMessage(id, response.adminErr, options);

  await requestController.updateRequest(userID, source);

  bot.sendMessage(id, response.provideName, options);
});

bot.onText(/^\/events$/, async (msg, [source]) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const isUserCreated = await userController.checkUserCreated(userID);
  if (!isUserCreated) await userController.createUser({ userID });
  const options = await userController.getUserPreferences(userID);
  const events = await eventController.getEvents();
  const response = getResponse(source).createEventsAnswer(events);

  await requestController.clearRequest(userID);

  bot.sendMessage(id, response, options);
});

// ALL TEXT LISTENER
bot.on("message", async (msg) => {
  const { id } = msg.chat;
  const userID = msg.from.id;
  const options = await userController.getUserPreferences(userID);
  const request = await requestController.getRequest(userID);

  if (
    [
      "/start",
      "/help",
      "/stop",
      "/silent",
      "/notify",
      ADMIN_CODE,
      "/create_event",
      "/delete_event",
      "/events",
    ].includes(msg.text)
  )
    return;

  // if user wants to create event
  if (request[0] == "/create_event") {
    const response = getResponse(request[0]);

    // msg.text is an event name
    if (request.length === 1) {
      const isEventNameUnique = await eventController.checkUniqueEventName(
        msg.text
      );
      if (!isEventNameUnique)
        return bot.sendMessage(id, response.nameErr, options);

      await requestController.updateRequest(userID, msg.text);

      return bot.sendMessage(id, response.provideDate, options);
    }

    // msg.text is an event date
    if (request.length === 2) {
      const curDate = new Date();
      const [date, time] = msg.text.split(" ");
      if (!time) return bot.sendMessage(id, response.dateErr, options);
      const [day, month, year] = date.split(".");
      const [hours, minutes] = time.split(":");

      if (!day || !month || !year || !hours || !minutes)
        return bot.sendMessage(id, response.dateErr, options);

      const eventDate = new Date(
        year,
        parseInt(month) - 1,
        day,
        hours,
        minutes
      );

      // if event date already passed send error message
      if (eventDate.getTime() <= curDate.getTime() || !eventDate)
        return bot.sendMessage(id, response.dateErr, options);

      await requestController.updateRequest(userID, eventDate);

      return bot.sendMessage(id, response.provideDescription, options);
    }

    // msg.text is an event description
    if (request.length >= 3) {
      const event = {
        name: request[1],
        date: request[2],
        description: msg.text,
      };

      await eventController.createEvent(event);
      await requestController.clearRequest(userID);

      bot.sendMessage(id, response.success, options);
    }

    return;
  }

  // if user wants to delete event
  if (request[0] === "/delete_event") {
    const response = getResponse(request[0]);

    // msg.text is an event name
    if (request.length === 1) {
      const event = await eventController.deleteEvent(msg.text);
      if (!event) {
        return bot.sendMessage(id, response.nameErr, options);
      }

      await requestController.clearRequest(userID);

      bot.sendMessage(id, response.success, options);
    }
  }
});

setInterval(async () => {
  await eventController.deletePastEvents();
  const curDate = new Date();
  const events = await eventController.getEvents();

  events.forEach(async (event) => {
    if (
      (curDate.getHours() == event.date.getHours() - 1 &&
        curDate.getMinutes() == event.date.getMinutes()) ||
      (curDate.getDate() == event.date.getDate() - 1 &&
        curDate.getMonth() == event.date.getMonth() &&
        curDate.getHours() == event.date.getHours() &&
        curDate.getMinutes() == event.date.getMinutes())
    ) {
      const response = getResponse("event");
      const users = await userController.getUsers();

      users.forEach(async (user) => {
        const userID = user.userID;
        const options = await userController.getUserPreferences(userID);
        bot.sendMessage(userID, response.getRandomNotification(event), options);
      });
    }
  });
}, 60000);

// Sending an empty HTTP response on request
// require("http")
//   .createServer()
//   .listen(process.env.PORT || 5000)
//   .on("request", function (req, res) {
//     res.end("");
//   });
