const { Router } = require('express');
const { addNewEvent, deleteEvent } = require('../../services/event.service');

const router = Router();

router.get('/add', async (req, res, next) => {
  try {
    const data = await addNewEvent(req.query, req.context);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.get('/delete', async (req, res, next) => {
  try {
    const data = await deleteEvent(req.query);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
