const { Router } = require('express');
const { getUserHistory } = require('../../services/history.service');

const router = Router();

router.get('/get', async (req, res, next) => {
  try {
    const data = await getUserHistory(req.query, req.context);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
