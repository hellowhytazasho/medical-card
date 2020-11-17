const { History } = require('../models/history.model');

async function getUserHistory({ offset, limit }, { userId }) {
  const data = await History.find({ userId })
    .skip(offset || 0)
    .limit(limit || Number.POSITIVE_INFINITY);
  return data;
}

async function createHistory(data, clientId, type) {
  const { userId, userName, photo } = data;
  await History.create({
    userId: clientId, guestId: userId, guestName: userName, photo, type,
  });
}

module.exports = {
  getUserHistory,
  createHistory,
};
