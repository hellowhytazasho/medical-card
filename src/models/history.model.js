const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemaDefinition = {
  userId: {
    type: String,
  },
  guestId: {
    type: String,
  },
  guestName: {
    type: String,
  },
  photo: {
    type: String,
  },
  type: {
    type: Number,
  },
};

const HistorySchema = new Schema(SchemaDefinition, {
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
});

HistorySchema.index({ vk_user_id: 1 });

const History = mongoose.model('history', HistorySchema);

module.exports = { SchemaDefinition, HistorySchema, History };
