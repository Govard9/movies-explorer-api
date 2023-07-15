const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const { DB_CONNECTION_STRING } = process.env;
const router = require('./routes/index');

const { LIMITER_OPTIONS } = require('./configurations');

const limiter = rateLimit(LIMITER_OPTIONS);

const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'http://movies-explorer.govard.nomoredomains.xyz',
  'https://movies-explorer.govard.nomoredomains.xyz',
  'http://api.movies-explorer.govard.nomoredomains.xyz',
  'https://api.movies-explorer.govard.nomoredomains.xyz',
  'http://api.movie-explorer.govard.nomoredomains.rocks',
  'https://api.movie-explorer.govard.nomoredomains.rocks',
  'localhost:3000',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

const app = express();

const handleErrors = require('./middlewares/handleErrors');

app.use(helmet());

app.use(express.json());
app.use(requestLogger); // логгер запросов
app.use(limiter);
app.use(cors(corsOptions));
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
