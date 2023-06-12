const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
require('dotenv').config();
const router = require('./routes/index');
const { DB_CONNECTION_STRING } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const handleErrors = require('./middlewares/handleErrors');

app.use(helmet());

app.use(express.json());
app.use(requestLogger); // логгер запросов
app.use(router);
app.use(errorLogger); // логгер ошибок
mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database.');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

app.use(errors()); // обработчик ошибок celebrate

app.use(handleErrors);

app.listen(3000, () => { console.log('Server started.'); });
