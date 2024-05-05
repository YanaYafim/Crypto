const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const cController = require('../controllers/controller');
const User = require("../models/User");
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

router.get('/', cController.homepage);
router.get('/signup', cController.signup_get);
router.post('/signup', cController.signup_post);
router.get('/login', cController.login_get);
router.post('/login', cController.login_post);
router.get('/logout', cController.logout_get);
router.get('/homeAfter', requireAuth, (req, res) => res.render('homeAfter'));
router.get('/profile', requireAuth, checkUser, (req, res) => {
    res.render('profile', { user: res.locals.user });
});
router.delete('/profile', requireAuth, async (req, res) => {
    try {
      const token = req.cookies.jwt;
      const decodedToken = jwt.verify(token, 'net secret');
      const userId = decodedToken.id;
      await User.findByIdAndDelete(userId);
      res.cookie('jwt', '', { maxAge: 1 });
      res.json({ message: 'Account deleted successfully' });
      res.redirect('/');
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

module.exports = router;