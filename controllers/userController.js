const User = require("../models/userModel");

exports.createUser = async (obj) => {
  try {
    const userDoc = await User.create(obj);

    return userDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.getUsers = async () => {
  try {
    const users = await User.find({});
    if (!users) return false;

    return users;
  } catch (err) {
    console.error(err);
  }
};

exports.updateUser = async (userID, options) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    if (options.isSilent === undefined) options.isSilent = userDoc.isSilent;
    if (options.isAdmin === undefined) options.isAdmin = userDoc.isAdmin;

    userDoc.isSilent = options.isSilent;
    userDoc.isAdmin = options.isAdmin;

    userDoc.save();
    return userDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.deleteUser = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    await User.deleteOne({ userID });

    return userDoc;
  } catch (err) {
    console.error(err);
  }
};

exports.getUserPreferences = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;
    const options = {
      parse_mode: "HTML",
    };

    options.disable_notification = userDoc.isSilent ? true : false;

    return options;
  } catch (err) {
    console.error(err);
  }
};

exports.checkUserAdmin = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    return userDoc.isAdmin ? true : false;
  } catch (err) {
    console.error(err);
  }
};

exports.checkUserCreated = async (userID) => {
  try {
    const userDoc = await User.findOne({ userID });
    if (!userDoc) return false;

    return true;
  } catch (err) {
    console.error(err);
  }
};
