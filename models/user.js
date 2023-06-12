const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
      unique: [true, 'Такой email уже использует кто-то другой.'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный URL.',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле name обязательно к заполнению.'],
      select: false,
    },
    name: {
      type: String,
      default: 'Киноман',
      minlength: [2, 'Минимальная длинна поля - 2 символа.'],
      maxlength: [30, 'Максимальная длинна поля - 30 символов.'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
