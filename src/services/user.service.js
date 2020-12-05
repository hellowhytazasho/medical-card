const config = require('config');

const { differenceInDays } = require('date-fns');
const { User } = require('../models/user.model');
const { Event } = require('../models/event.model');
const { History } = require('../models/history.model');
const getVKUserData = require('../helpers/get-user-info.helper');
const { HttpError } = require('../errors');
const { createHistory } = require('./history.service');

const ONE_DAY = 1;

async function getUserData({ uuid }, userId) {
  const user = await User.findOne({ userId }).lean().exec();


  if (uuid && !user._id.equals(uuid)) {
    const uuidClient = await User.findOne({ _id: uuid }).lean().exec();
    const uuidv4Client =  await User.findOne({ uuidv4: uuid }).lean().exec();


    if (!uuidClient && !uuidv4Client) {
      throw new HttpError({
        message: 'Client not found',
        code: 404,
      });
    } else if (uuidClient && uuidClient.allowView == 0) {

      const clientEvents = await Event.find({ userId: uuidClient.userId }).lean().exec();
      uuidClient.events = clientEvents;

      await createHistory(user, uuidClient.userId, 0);
      return {
        ...uuidClient,
        history: [],
      };
    } else if (uuidv4Client && uuidv4Client.allowView == 1) {
        const clientEvents = await Event.find({ userId: uuidv4Client.userId }).lean().exec();
        uuidv4Client.events = clientEvents;
        await createHistory(user, uuidv4Client.userId, 1);
        return {
          ...uuidv4Client,
          history: [],
        };
    }
    throw new HttpError({
      message: 'Wrong uuid',
      code: 404,
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
    });

    await newUser.save();

    return {
      ...newUser.toObject(),
      events: [],
      history: [],
    };
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

  const { floodControl: { time: FLOOD_TIME }} = config;

  const userDiseases = await User.find({ userId,
    updatedAt: {
      $gt: new Date(Date.now() - FLOOD_TIME),
  }});

  if (!userDiseases.length) {
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

  throw new HttpError({
    message: 'Too Many Requests',
    code: 429,
  });
}

async function editDisease({
  diseaseId, title, dateStart, dateEnd, color,
}, userId) {
  const start = dateStart ? new Date(Number(dateStart)) : null;
  const end = dateEnd ? new Date(Number(dateEnd)) : null;

  return User.updateOne({ userId, 'diseases._id': diseaseId }, {
    $set: {
      'diseases.$.title': title,
      'diseases.$.dateStart': start,
      'diseases.$.dateEnd': end,
      'diseases.$.color': color,
    },
  });
}

async function deleteDisease({ diseaseId }, userId) {
  return User.updateOne({ userId }, {
    $pull: {
      diseases: { _id: diseaseId },
    },
  });
}

async function addAllergen({ title, date, color }, userId) {
  const { floodControl: { time: FLOOD_TIME }} = config;

  const userAllergens = await User.find({ userId,
    updatedAt: {
      $gt: new Date(Date.now() - FLOOD_TIME)
  }});

  if (!userAllergens.length) {
    const convertedDate = date ? new Date(Number(date)) : null;

    return User.updateOne({ userId }, {
      $push: {
        allergens: { title, date: convertedDate, color },
      },
    });
  }

  throw new HttpError({
    message: 'Too Many Requests',
    code: 429,
  });
}

async function editAllergen({
  allergenId, title, date, color,
}, userId) {
  const newDate = date ? new Date(Number(date)) : null;

  return User.updateOne({ userId, 'allergens._id': allergenId }, {
    $set: {
      'allergens.$.title': title,
      'allergens.$.date': newDate,
      'allergens.$.color': color,
    },
  });
}

async function deleteAllergen({ allergenId }, userId) {
  return User.updateOne({ userId }, {
    $pull: {
      allergens: { _id: allergenId },
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
