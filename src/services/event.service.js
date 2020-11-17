const { Event } = require('../models/event.model');
const { HttpError } = require('../errors');

async function addNewEvent({
  title, description, date, color,
}, { userId }) {
  try {
    await Event.create({
      userId, title, description, date, color,
    });
    return '200';
  } catch (error) {
    throw new HttpError({
      message: error,
      code: 500,
    });
  }
}

async function deleteEvent({ id }) {
  try {
    await Event.deleteOne({ _id: id }).exec();
  } catch (error) {
    throw new HttpError({
      message: 'Event not found',
      code: 404,
    });
  }
}

module.exports = {
  addNewEvent,
  deleteEvent,
};
