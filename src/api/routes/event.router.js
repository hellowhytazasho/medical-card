const { Router } = require('express');
const {
  addNewEvent,
  deleteEvent,
  editEvent,
} = require('../../services/event.service');

const router = Router();

router.get('/add', async (req, res, next) => {
  try {
    await addNewEvent(req.query, req.context);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/edit', async (req, res, next) => {
  try {
    await editEvent(req.query);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

router.get('/delete', async (req, res, next) => {
  try {
    await deleteEvent(req.query);
    res.send({ status: '200' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
