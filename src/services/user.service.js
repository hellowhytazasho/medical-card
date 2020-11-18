const { differenceInDays } = require('date-fns');

const { User } = require('../models/user.model');
const { Event } = require('../models/event.model');
const { History } = require('../models/history.model');
const getVKUserData = require('../helpers/get-user-info');
const { HttpError } = require('../errors');
const { createHistory } = require('./history.service');

const ONE_DAY = 1;

// eslint-disable-next-line no-unused-vars
async function getUserData({ uuid, type }, userId) {
  const user = await User.findOne({ userId }).lean().exec();

  if (uuid) {
    const client = await User.findOne({ _id: uuid }).lean().exec();
    if (!client) {
      throw new HttpError({
        message: 'Client not found',
        code: 404,
      });
    }

    // eslint-disable-next-line no-underscore-dangle
    if (client._id.equals(uuid)) {
      await createHistory(user, client.userId, type);
      return client;
    }

    throw new HttpError({
      message: 'Wrong uuid',
      code: 401,
    });
  }

  const [
    userEvents,
    userHistory,
  ] = await Promise.all([
    Event.find({ userId }).lean().exec(),
    History.find({ userId }).lean().exec(),
  ]);

  if (!user) {
    const {
      userName, photo, sex, birthday,
    } = await getVKUserData(userId);

    const newUser = new User({
      userId,
      userName,
      photo,
      sex,
      birthday,
      allowView: 0,
      bloodType: null,
    });

    await newUser.save();

    return newUser;
  }

  const diff = differenceInDays(new Date(), user.updatedAt);

  if (diff > ONE_DAY) {
    const { userName, photo } = await getVKUserData(userId);

    await User.updateOne({ userId }, {
      $set: { userName, photo },
    });
  }

  user.events = userEvents;
  user.history = userHistory;

  return user;
}

async function addDisease({
  title, dateStart, dateEnd, color,
}, userId) {
  const start = dateStart ? new Date(Number(dateStart)) : null;
  const end = dateEnd ? new Date(Number(dateEnd)) : null;

  return User.updateOne({ userId }, {
    $push: {
      diseases: {
        title, dateStart: start, dateEnd: end, color,
      },
    },
  });
}

async function editDisease({
  title, newTitle, dateStart, dateEnd, color,
}, userId) {
  const start = dateStart ? new Date(Number(dateStart)) : null;
  const nTitle = newTitle || title;

  return User.updateOne({ userId, 'diseases.title': title }, {
    $set: {
      'diseases.$.title': nTitle,
      'diseases.$.dateStart': start,
      'diseases.$.dateEnd': dateEnd,
      'diseases.$.color': color,
    },
  });
}

async function deleteDisease({ title }, userId) {
  return User.updateOne({ userId }, {
    $pull: {
      diseases: { title },
    },
  });
}

async function addAllergen({ title, dateStart, color }, userId) {
  const date = dateStart ? new Date(Number(dateStart)) : null;
  return User.updateOne({ userId }, {
    $push: {
      allergens: { title, date, color },
    },
  });
}

async function editAllergen({
  title, newTitle, dateStart, color,
}, userId) {
  const date = dateStart ? new Date(Number(dateStart)) : null;
  const nTitle = newTitle || title;

  return User.updateOne({ userId, 'allergens.title': title }, {
    $set: {
      'allergens.$.title': nTitle,
      'allergens.$.date': date,
      'allergens.$.color': color,
    },
  });
}

async function deleteAllergen({ title }, userId) {
  return User.updateOne({ userId }, {
    $pull: {
      allergens: { title },
    },
  });
}

async function changeUserBirthday({ birthday }, userId) {
  return User.updateOne({ userId }, {
    $set: {
      birthday,
    },
  });
}

async function changeGender({ sex }, userId) {
  return User.updateOne({ userId }, {
    $set: {
      sex,
    },
  });
}

async function changeBloodType({ bloodType }, userId) {
  return User.updateOne({ userId }, {
    $set: {
      bloodType,
    },
  });
}

async function changeAllowView({ allowView }, userId) {
  return User.updateOne({ userId }, {
    $set: {
      allowView,
    },
  });
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
