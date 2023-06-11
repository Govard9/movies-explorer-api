const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

app.use(express.json());

app.use(router);
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database.');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});

app.listen(3000, () => { console.log('Server started.'); });
