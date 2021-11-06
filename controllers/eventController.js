const Event = require("../models/eventModel");

exports.createEvent = async (obj) => {
  try {
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

    await Event.deleteOne({ name });

    return eventDoc;
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
