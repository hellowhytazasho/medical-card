const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { isAccess } = require('../services/user-meanness');
const { HttpError } = require('../errors');

const {
  userRouter,
  eventRouter,
  historyRouter,
} = require('./routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  // eslint-disable-next-line camelcase
  const { vk_user_id } = req.query;
  req.context = {
    userId: vk_user_id,
  };
  next();
});

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'development'
    || isAccess(req.query)
  ) next();
  else {
    next(new HttpError({
      message: 'Not access user',
      code: 401,
    }));
  }
});

app.use('/user', userRouter);
app.use('/event', eventRouter);
app.use('/history', historyRouter);

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.code) {
    res.status(error.code);
  }

  res.send({
      status: error.code || 500,
      message: error.message,
  });
});

module.exports = app;
