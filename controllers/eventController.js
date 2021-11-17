const Event = require("../models/eventModel");
const cronhookController = require("./cronhookController");

exports.createEvent = async (obj) => {
  try {
    const cronhookID = await cronhookController.setCronhook(obj);
    obj.id = cronhookID;
    const eventDoc = await Event.create(obj);

    return eventDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.getEvents = async () => {
  try {
    const events = Event.find({});
    if (!events) return false;

    return events;
  } catch (err) {
    console.error(err);
  }
};

exports.updateEvent = async (name, options) => {
  try {
    const eventDoc = await Event.findOne({ name });
    if (!eventDoc) return false;

    eventDoc.name = options.name || eventDoc.name;
    eventDoc.date = options.date || eventDoc.date;
    eventDoc.description = options.description || eventDoc.description;

    eventDoc.save();
    return eventDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteEvent = async (name) => {
  try {
    const eventDoc = await Event.findOne({ name });
    if (!eventDoc) return false;

    if (eventDoc.id != -1) {
      await cronhookController.deleteCronhook(eventDoc.id);
    }

    await Event.deleteOne({ name });

    await cronhookController.setCronhook();

    return eventDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.deletePastEvents = async () => {
  try {
    const eventDocs = await Event.find({ date: { $lt: new Date() } });

    eventDocs.forEach(async (el) => {
      if (el.id != -1) {
        await cronhookController.deleteCronhook(el.id);
      }
      await Event.deleteOne({ name: el.name });

      await cronhookController.setCronhook();
    });

    return eventDocs;
  } catch (err) {
    console.error(err);
  }
};

exports.checkUniqueEventName = async (name) => {
  try {
    const eventDoc = await Event.findOne({ name });
    if (!eventDoc) return true;

    return false;
  } catch (err) {
    console.error(err);
  }
};
