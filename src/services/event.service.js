const config = require('config');

const { HttpError } = require('../errors');
const { Event } = require('../models/event.model');

async function addNewEvent({
  title, description, date, color,
}, { userId }) {

  const { floodControl: { time: FLOOD_TIME }} = config;
  const { floodControl: { count: ELEM_COUNT }} = config;

  const userEvents = await Event.find({ userId,
    createdAt: {
      $gt: new Date(Date.now() - FLOOD_TIME)
    }});

  if (userEvents.length > ELEM_COUNT) {
    throw new HttpError({
      message: 'Too Many Requests',
      code: 429,
    });
  } else {
    await Event.create({
      userId, title, description, date, color,
    });
  }
}

async function editEvent({
  title, id, description, date, color,
}) {
  await Event.updateOne({ _id: id }, {
    $set: {
      title,
      description,
      date,
      color,
    },
  });
}

async function deleteEvent({ id }) {
  await Event.deleteOne({ _id: id }).exec();
}

module.exports = {
  addNewEvent,
  deleteEvent,
  editEvent,
};
