const { History } = require('../models/history.model');

async function getUserHistory({ offset, limit }, { userId }) {
  const data = await History.find({ userId })
    // eslint-disable-next-line radix
    .skip(parseInt(offset) || 0)
    // eslint-disable-next-line radix
    .limit(parseInt(limit) || Number.MAX_SAFE_INTEGER);
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
