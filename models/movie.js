const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    director: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    duration: {
      type: Number,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    year: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    description: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    image: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL.',
      },
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL.',
      },
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL.',
      },
      required: [true, 'Поле name обязательно к заполнению.'],
      default: 'https://famleisure.ru/wp-content/uploads/2020/07/videos.jpg',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    movieId: {
      type: Number,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    nameRU: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
    nameEN: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('movie', movieSchema);
