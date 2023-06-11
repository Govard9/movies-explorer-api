const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InvalidRequest = require('../errors/invalid-request');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь не найден.'));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail()
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new InvalidRequest('Пользователь не найден.'));
      }
      return next(err);
    });
};
