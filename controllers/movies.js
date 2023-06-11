const Movie = require('../models/movie');
const InvalidRequest = require('../errors/invalid-request')
const AccessDenied = require('../errors/AccessDenied')
const NotFoundError = require('../errors/not-found-err')

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

module.exports.createFilm = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  // записываем данные в базу
  Movie.create({
    country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, owner,
  })
    // возвращаем записанные в базу данные пользователю
    .then((movie) => res.status(201).send(movie))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

module.exports.deleteFilm = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.id)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new AccessDenied('Вы не можете удалить эту карточку');
      }
      return Movie.findByIdAndDelete(movie._id);
    })
    .then((deletedMovie) => res.status(200).send(deletedMovie))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка не найдена.'));
      }
      if (err.name === 'ValidationError') {
        return next(new InvalidRequest('Переданы не корректные данные'));
      }
      return next(err);
    });
};
