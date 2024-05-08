const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const cController = require('../controllers/controller');
const User = require("../models/User");
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get('*', checkUser);
router.get('/', cController.homepage);
router.get('/signup', cController.signup_get);
router.post('/signup', cController.signup_post);
router.get('/login', cController.login_get);
router.post('/login', cController.login_post);
router.get('/logout', cController.logout_get);
router.get('/wallet/buy-crypto', cController.crypto_to_cookie);
router.get('/homeAfter', requireAuth, cController.cur);
router.get('/profile', requireAuth, (req, res) => {
    res.render('profile', { user: res.locals.user });
});
router.delete('/profile-delete', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = jwt.verify(token, 'net secret');
    const userId = decodedToken.id;
    await User.findByIdAndDelete(userId);
    res.cookie('jwt', '', { maxAge: 1 });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
router.get('/wallet', requireAuth, (req, res) => {
  res.render('wallet');
});
router.get('/edit', requireAuth, (req, res) => {
  res.render('edit');
});
router.get('/pay', requireAuth, (req, res) => {
  res.render('pay');
});

module.exports = router;