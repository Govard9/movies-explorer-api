const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  userRegister,
  userLogin,
  getUserMe,
  updateProfile,
} = require('../controllers/users');

const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
} = require('../utils/validations/users');

router.post('/signup', userRegister, validateRegister);
router.post('/signin', userLogin, validateLogin);

router.get('/users/me', auth, getUserMe);
router.patch('/users/me', auth, updateProfile, validateUpdateProfile);

module.exports = router;
