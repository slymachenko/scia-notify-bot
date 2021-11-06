const User = require("../models/userModel");

exports.updateRequest = async (userID, req) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    userDoc.request.push(req);

    userDoc.save();
    return userDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.getRequest = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    return userDoc.request;
  } catch (err) {
    console.error(err);
  }
};

exports.clearRequest = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    userDoc.request = [];

    userDoc.save();
    return userDoc;
  } catch (err) {
    console.error(err);
  }
};
