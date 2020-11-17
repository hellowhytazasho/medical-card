const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemaDefinition = {
  userName: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  photo: {
    type: String,
  },
  lastUpdate: {
    type: Date,
  },
  allowView: {
    type: Number,
  },
  bloodType: {
    type: Number,
  },
  diseases: {
    type: [{
      _id: false,
      disease: String,
    }],
  },
  allergens: {
    type: [{
      _id: false,
      allergen: String,
    }],
  },
  birthday: {
    type: String,
  },
  sex: {
    type: Number,
  },
};

const UserSchema = new Schema(SchemaDefinition, {
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
});

UserSchema.index({ vk_user_id: 1 });

const User = mongoose.model('user', UserSchema);

module.exports = { SchemaDefinition, UserSchema, User };
