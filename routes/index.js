const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.use(userRouter, moviesRouter, (req, res, next) => {
  next(new NotFoundError('404 Not Found'));
});
module.exports = router;
