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
} = require('../../services/user.service');

const router = Router();

router.get('/get', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await getUserData(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/addDisease', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await addDisease(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/deleteDisease', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await deleteDisease(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/addAllergen', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await addAllergen(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/deleteAllergen', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await deleteAllergen(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/changeBirthday', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await changeUserBirthday(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/changeGender', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await changeGender(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/changeBloodType', async (req, res, next) => {
  try {
    const { userId } = req.context;
    const data = await changeBloodType(req.query, userId);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
