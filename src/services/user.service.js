const { User } = require('../models/user.model');
const { Event } = require('../models/event.model');
const { History } = require('../models/history.model');
const getVKUserData = require('../helpers/get-user-info');
const logger = require('../logger')('getUserData');
const { HttpError } = require('../errors');
const { createHistory } = require('./history.service');

const ONE_DAYS = 86400000;

// eslint-disable-next-line no-unused-vars
async function getUserData({ clientId, uuid, type }, userId) {
  const user = await User.find({ userId }).lean().exec();

  if (clientId !== userId) {
    const client = await User.find({ userId: clientId }).lean().exec();
    if (client.length === 0) {
      throw new HttpError({
        message: 'Client not found',
        code: 404,
      });
    // eslint-disable-next-line no-underscore-dangle
    } else if (String(client[0]._id) === uuid) {
      createHistory(user[0], clientId, type);
      return client[0];
    }
    throw new HttpError({
      message: 'Wrong uuid',
      code: 401,
    });
  }
  const userEvents = await Event.find({ userId }).lean().exec();
  const userHistory = await History.find({ userId }).lean().exec();

  const data = {
    events: userEvents,
    history: userHistory,
    user: user[0],
  };

  if (user.length === 0) {
    const {
      userName, photo, sex, birthday,
    } = await getVKUserData(userId);

    User.create({
      // eslint-disable-next-line max-len
      userId, userName, photo, lastUpdate: new Date(), sex, birthday, allowView: 0,
    });

    const sendData = new User({
      // eslint-disable-next-line max-len
      userId, userName, photo, lastUpdate: new Date(), sex, birthday, allowView: 0,
    });
    return sendData;
  }
  if (((user[0].lastUpdate.getTime() + ONE_DAYS) - Date.now()) < 0) {
    const { userName, photo } = await getVKUserData(userId);

    User.updateOne({ userId }, {
      $set: {
        userName,
        photo,
      },
    }, (err) => {
      if (err) logger.info(err);
    });
  }
  return data;
}

async function addDisease({ disease }, userId) {
  try {
    await User.updateOne({ userId }, {
      $push: {
        diseases: { disease },
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function deleteDisease({ disease }, userId) {
  try {
    await User.updateOne({ userId }, {
      $pull: {
        diseases: { disease },
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function addAllergen({ allergen }, userId) {
  try {
    await User.updateOne({ userId }, {
      $push: {
        allergens: { allergen },
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function deleteAllergen({ allergen }, userId) {
  try {
    await User.updateOne({ userId }, {
      $pull: {
        allergens: { allergen },
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function changeUserBirthday({ birthday }, userId) {
  try {
    await User.updateOne({ userId }, {
      $set: {
        birthday,
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function changeGender({ sex }, userId) {
  try {
    await User.updateOne({ userId }, {
      $set: {
        sex,
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

// eslint-disable-next-line camelcase
async function changeBloodType({ blood_type }, userId) {
  try {
    await User.updateOne({ userId }, {
      $set: {
        bloodType: blood_type,
      },
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

module.exports = {
  getUserData,
  changeUserBirthday,
  changeGender,
  changeBloodType,
  addDisease,
  addAllergen,
  deleteDisease,
  deleteAllergen,
};
