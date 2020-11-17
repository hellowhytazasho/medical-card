const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemaDefinition = {
  userId: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  color: {
    type: Number,
  },
  date: {
    type: String,
  },
};

const EventSchema = new Schema(SchemaDefinition, {
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
});

EventSchema.index({ vk_user_id: 1 });

const Event = mongoose.model('event', EventSchema);

module.exports = { SchemaDefinition, EventSchema, Event };
