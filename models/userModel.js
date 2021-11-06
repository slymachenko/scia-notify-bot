const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: [true, "Please provide user ID"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSilent: {
    type: Boolean,
    default: false,
  },
  request: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema, "users");
