const { Router } = require('express');
const {
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
} = require('../../services/user.service');

const DateHelper = require('../../helpers/date.helper');

const router = Router();

const TIMESTAMPS = ['createdAt', 'updatedAt'];
const DATES_TO_CONVERT = [...TIMESTAMPS, 'birthday'];

router.get('/get', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const user = await getUserData(req.query, userId);
    res.send({
      ...user,
      ...DateHelper.convertToTimestamp(user, DATES_TO_CONVERT),
      diseases: user.diseases
        .map((d) => ({ ...d, ...DateHelper.convertToTimestamp(d, ['dateStart', 'dateEnd']) })),
      allergens: user.allergens
        .map((a) => ({ ...a, ...DateHelper.convertToTimestamp(a, ['date']) })),
      history: user.history
        .map((h) => ({ ...h, ...DateHelper.convertToTimestamp(h, TIMESTAMPS) })),
      events: user.events
        .map((e) => ({ ...e, ...DateHelper.convertToTimestamp(e, TIMESTAMPS) })),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/addDisease', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await addDisease(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/editDisease', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await editDisease(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/deleteDisease', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await deleteDisease(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/addAllergen', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await addAllergen(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/editAllergen', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await editAllergen(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/deleteAllergen', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await deleteAllergen(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/changeBirthday', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await changeUserBirthday(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/changeGender', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await changeGender(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/changeBloodType', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await changeBloodType(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/changeAllowView', async (req, res, next) => {
  try {
    const { userId } = req.context;
    await changeAllowView(req.query, userId);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
