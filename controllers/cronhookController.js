const axios = require("axios");
const Event = require("../models/eventModel");

const getTimeBeforeEvent = (event) => {
  const curDate = new Date();
  const eventDate = new Date(event.date);

  return (eventDate.getTime() - curDate.getTime()) / (1000 * 3600);
};

const getMostRecentEvent = async (createdEvent) => {
  try {
    const events = await Event.find({});
    let event;

    if (createdEvent) {
      createdEvent.date = new Date(createdEvent.date);
      events.push(createdEvent);
    }
    events.forEach((el) => {
      if (!event || el.date < event.date) event = el;
    });

    return event;
  } catch (err) {
    console.error(err);
  }
};

const setCronhookBeforeEvent = async (event, options, isDay) => {
  try {
    const eventDate = new Date(event.date);
    let dateBeforeEvent;
    // true - set cronhook day before the event
    // false - set cronhook hour before the event
    if (isDay) {
      dateBeforeEvent = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      dateBeforeEvent = new Date(eventDate.getTime() - 60 * 60 * 1000);
    }

    options.runAt = `${dateBeforeEvent.getFullYear()}-${
      dateBeforeEvent.getMonth() + 1
    }-${dateBeforeEvent.getDate()}T${dateBeforeEvent.getHours()}:${dateBeforeEvent.getMinutes()}`;

    const res = await axios.post("https://api.cronhooks.io/schedules", options);

    return res.data.result.id;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteCronhook = async (id) => {
  try {
    return await axios.delete(`https://api.cronhooks.io/schedules/${id}`, {});
  } catch (err) {
    console.error(err);
  }
};

exports.setCronhook = async (createdEvent) => {
  try {
    const event = await getMostRecentEvent(createdEvent);
    const options = {
      title: event.name,
      url: process.env.CRONHOOK_URL,
      timezone: "Europe/Kiev",
      method: "GET",
      contentType: "application/json; charset=utf-8",
      isRecurring: false,
      sendCronhookObject: true,
    };
    const cronhook = (
      await axios.get("https://api.cronhooks.io/schedules?skip=0&limit=1", {})
    ).data.result.items[0];
    const timeBeforeEvent = getTimeBeforeEvent(event);

    // I. there's no cronhook scheduled
    if (!cronhook) {
      let cronhookID;
      if (timeBeforeEvent > 24) {
        cronhookID = await setCronhookBeforeEvent(event, options, true);
      } else if (timeBeforeEvent > 1) {
        cronhookID = await setCronhookBeforeEvent(event, options, false);
      }

      return cronhookID;
    }

    // II. there's cronhook scheduled
    const cronhookDate = (await Event.findOne({ name: cronhook.title })).date;
    const eventDate = new Date(event.date);

    // if event will happen sooner than cronhook one
    if (cronhookDate.getTime() > eventDate.getTime()) {
      let cronhookID;
      await exports.deleteCronhook(cronhook.id);
      if (timeBeforeEvent > 24) {
        cronhookID = await setCronhookBeforeEvent(event, options, true);
      } else if (timeBeforeEvent > 1) {
        cronhookID = await setCronhookBeforeEvent(event, options, false);
      }

      return cronhookID;
    }
  } catch (err) {
    console.error(err);
  }
};
