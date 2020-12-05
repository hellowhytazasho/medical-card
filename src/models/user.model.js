const mongoose = require('mongoose');

const { Schema } = mongoose;


const { ObjectId } = mongoose.Types;

const SchemaDefinition = {
  uuidv4: {
    type: ObjectId,
    default: ObjectId,
  },
  userName: {
    type: String,
    require: true,
  },
  userId: {
    type: Number,
    require: true,
  },
  photo: {
    type: String,
  },
  allowView: {
    type: Number,
    default: 0,
  },
  bloodType: {
    type: Number,
    default: 8,
  },
  diseases: [{
    title: String,
    dateStart: Date,
    dateEnd: Date,
    color: Number,
  }],
  allergens: [{
    title: String,
    date: Date,
    color: Number,
  }],
  birthday: {
    type: Date,
  },
  sex: {
    type: Number,
  },
  doctor: {
    type: Number,
    default: 0,
  },
};

const UserSchema = new Schema(SchemaDefinition, {
  timestamps: { createdAt: 'createdAt' },
  versionKey: false,
});


UserSchema.index({ vk_user_id: 1, uuidv4: 1 }, { unique: true });


const User = mongoose.model('user', UserSchema);

module.exports = { SchemaDefinition, UserSchema, User };
