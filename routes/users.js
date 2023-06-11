const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUserMe,
  updateProfile,
} = require('../controllers/users');

const {
  validateUpdateProfile,
} = require('../utils/validations/users');

router.get('/users/me', getUserMe, auth);
router.patch('/users/me', auth, validateUpdateProfile, updateProfile);

module.exports = router;
