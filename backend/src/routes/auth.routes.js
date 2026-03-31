const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validator');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', validateRegister, register);
router.post('/login',    validateLogin,    login);
router.get('/me',        protect,          getMe);

module.exports = router;
