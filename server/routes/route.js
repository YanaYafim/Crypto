const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const cController = require('../controllers/controller');
const sController = require('../controllers/stripeController');
const User = require("../models/User");
const { requireAuth, checkUser, requireNonAuth } = require('../middleware/authMiddleware');

router.get('*', checkUser);
router.get('/', cController.homepage);
router.get('/signup', requireNonAuth, cController.signup_get);
router.post('/signup', requireNonAuth, cController.signup_post);
router.get('/login', requireNonAuth, cController.login_get);
router.post('/login', requireNonAuth, cController.login_post);
router.get('/logout', requireAuth, cController.logout_get);
router.get('/wallet/buy-crypto', requireAuth, cController.crypto_to_cookie);
router.get('/pay/stripe', requireAuth, sController.generatePurchaseLink);
router.get('/pay/payment-success', requireAuth, sController.successPayment);
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
router.put('/edit/update', requireAuth, cController.updateProf);
router.get('/convert', requireAuth, cController.crypto_to_cookie_convert);
router.get('/wallet/convert', requireAuth, (req, res) => {
  res.render('convert');
});
router.put('/wallet/convert/conversion', requireAuth, cController.updateConversion);
router.get('/pay', requireAuth, (req, res) => {
  res.render('pay');
});

module.exports = router;