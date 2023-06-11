const router = require('express').Router();

const auth = require('../middlewares/auth');

const {
  getMovies,
  createFilm,
  deleteFilm,
} = require('../controllers/movies');

const {
  validateCreateFilm,
  validateDeleteFilm,
} = require('../utils/validations/movies');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, createFilm, validateCreateFilm);
router.delete('/movies/:id', auth, deleteFilm, validateDeleteFilm);

module.exports = router;
