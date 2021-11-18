const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide event name"],
    unique: [true, "Название мероприятия должно быть уникальным."],
  },
  date: {
    type: Date,
    required: [true, "Please provide date of the event in the format DD.MM.YY"],
  },
  description: {
    type: String,
    required: [true, "Please provide event description"],
  },
});

module.exports = mongoose.model("Event", eventSchema, "events");
