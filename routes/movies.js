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

router.get('/movies', getMovies, auth);
router.post('/movies', createFilm, auth, validateCreateFilm);
router.delete('/movies/_id', deleteFilm, auth, validateDeleteFilm);

module.exports = router;
