const router = require('express').Router();
const {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
} = require('../middleware/validate');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.use(protect); // All routes below this require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/password', validatePasswordUpdate, updatePassword);
router.delete('/account', deleteAccount);

module.exports = router;
