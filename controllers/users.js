const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const InvalidRequest = require('../errors/invalid-request');
const UserIsRegister = require('../errors/user-is-register');
const ErrorAuthorization = require('../errors/error-authorization');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.userRegister = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
  // возвращаем записанные в базу данные пользователю
    .then((user) => {
      const doNotPassword = user.toObject({ useProjection: true });

      res.status(201)
        .send(doNotPassword);
    })

  // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы некорректные данные при создании пользователя.'));
      }
      if (err.code === 11000) {
        return next(new UserIsRegister('Такой пользователь уже зарегистрирован.'));
      }
      return next(err);
    });
};

module.exports.userLogin = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new ErrorAuthorization('Неправильные почта или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промисс
            return next(new ErrorAuthorization('Неправильные почта или пароль.'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          // аутентификация успешна
          return res.send({ _id: token });
        });
    })
    .catch(next);
};

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
      if (err.name === 'CastError') {
        return next(new InvalidRequest('Пользователь не найден.'));
      } if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы некорректные данные при изменении пользователя.'));
      }
      return next(err);
    });
};
