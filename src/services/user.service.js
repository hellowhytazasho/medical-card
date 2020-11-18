/* eslint-disable radix */
const { User } = require('../models/user.model');
const { Event } = require('../models/event.model');
const { History } = require('../models/history.model');
const getVKUserData = require('../helpers/get-user-info');
const { HttpError } = require('../errors');
const { createHistory } = require('./history.service');

const ONE_DAYS = 86400000;

// eslint-disable-next-line no-unused-vars
async function getUserData({ uuid, type }, userId) {
  const user = await User.find({ userId }).lean().exec();

  if (uuid) {
    const client = await User.find({ _id: uuid }).lean().exec();
    if (client.length === 0) {
      throw new HttpError({
        message: 'Client not found',
        code: 404,
      });
    // eslint-disable-next-line no-underscore-dangle
    } else if (String(client[0]._id) === uuid) {
      createHistory(user[0], client[0].id, type);
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
    });
  }
  return data;
}

async function addDisease({
  title, dateStart, dateEnd, color,
}, userId) {
  try {
    const start = dateStart ? new Date(parseInt(dateStart)) : null;
    const end = dateEnd ? new Date(parseInt(dateEnd)) : null;

    await User.updateOne({ userId }, {
      $push: {
        diseases: {
          title, dateStart: start, dateEnd: end, color,
        },
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function editDisease({
  title, newTitle, dateStart, dateEnd, color,
}, userId) {
  try {
    const start = dateStart ? new Date(parseInt(dateStart)) : null;
    const nTitle = newTitle || title;

    await User.updateOne({ userId, 'diseases.title': title }, {
      $set: {
        'diseases.$.title': nTitle,
        'diseases.$.dateStart': start,
        'diseases.$.dateEnd': dateEnd,
        'diseases.$.color': color,
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function deleteDisease({ title }, userId) {
  try {
    await User.updateOne({ userId }, {
      $pull: {
        diseases: { title },
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function addAllergen({ title, dateStart, color }, userId) {
  try {
    const date = dateStart ? new Date(parseInt(dateStart)) : null;
    await User.updateOne({ userId }, {
      $push: {
        allergens: { title, date, color },
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function editAllergen({
  title, newTitle, dateStart, color,
}, userId) {
  try {
    const date = dateStart ? new Date(parseInt(dateStart)) : null;
    const nTitle = newTitle || title;

    await User.updateOne({ userId, 'allergens.title': title }, {
      $set: {
        'allergens.$.title': nTitle,
        'allergens.$.date': date,
        'allergens.$.color': color,
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function deleteAllergen({ title }, userId) {
  try {
    await User.updateOne({ userId }, {
      $pull: {
        allergens: { title },
      },
    });
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
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

// eslint-disable-next-line camelcase
async function changeBloodType({ bloodType }, userId) {
  try {
    await User.updateOne({ userId }, {
      $set: {
        bloodType,
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

// eslint-disable-next-line camelcase
async function changeAllowView({ allowView }, userId) {
  try {
    await User.updateOne({ userId }, {
      $set: {
        allowView,
      },
    });
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
  changeAllowView,
  editAllergen,
  editDisease,
};
