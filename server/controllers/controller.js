const User = require("../models/User");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcrypt');

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '', conversation: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  } else if (err.message === 'Password length update error') {
    errors.password = 'Password must contains more than 5 symbols';
  }

  // conversation
  if (err.message === 'Insufficient funds') {
    errors.conversation = 'You have to buy more coins';
  } else if (err.message === 'Cannot convert 0') {
    errors.conversation = 'You cannot convert 0 coins';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net secret', {
    expiresIn: maxAge
  });
};



exports.homepage = async (req, res) => {
    const locals = {
      title: "Homepage",
      description: "HomePage",
    };
    try {
      res.render("index", {
        locals,
      });
    } catch (error) {
      console.log(error);
    }
  };

  module.exports.signup_get = (req, res) => {
    res.render('signup');
  }
  
  module.exports.login_get = (req, res) => {
    res.render('login');
  }
  
  module.exports.signup_post = async (req, res) => {
    const { userName, email, password } = req.body;
  
    try {
      const user = await User.create({ userName, email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ user: user._id });
    }
    catch(err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
   
  }
  
  module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user._id });
    } 
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  
  }
  
  module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
  
module.exports.cur = async (req, res) => {
  try {
    res.render('homeAfter');
} catch (error) {
    console.error('Error:', error);
}
}

module.exports.crypto_to_cookie = (req, res) => {
  const coinName = req.query.coinName;
  const price = req.query.price;
  res.cookie('coin', coinName, { maxAge: 3 * 24 * 60 * 60 });
  res.cookie('price', price, { maxAge: 3 * 24 * 60 * 60 });
  res.redirect('/pay');
}

module.exports.crypto_to_cookie_convert = (req, res) => {
  const coinName = req.query.coinName;
  const price = req.query.price;
  res.cookie('coin', coinName, { maxAge: 3 * 24 * 60 * 60 });
  res.cookie('price', price, { maxAge: 3 * 24 * 60 * 60 });
  res.redirect('/wallet/convert');
}

module.exports.updateProf = async (req, res) => {
  const { username, email, newPassword } = req.body;

  try {
      const token_ = req.cookies.jwt;
      const decodedToken = jwt.verify(token_, 'net secret');
      const userId = decodedToken.id;

      const user = await User.findById(userId);

      if (username) user.userName = username;
      if (email) user.email = email;
      if (newPassword.length >= 6) {
          const salt = await bcrypt.genSalt();
          let hashedPassword = await bcrypt.hash(newPassword, salt);
          user.password = hashedPassword;
      } else {
          throw Error('Password length update error');
      }

      await user.save();

      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
      if (!res.headersSent) {
          const errors = handleErrors(error);
          res.status(400).json({ errors });
      }
  }
}

module.exports.updateConversion = async (req, res) => {
  try {
      const { valueTo, valueFrom, coinTo, coinFrom } = req.body;
      const parsedValueTo = parseFloat(valueTo);
      const parsedValueFrom = parseFloat(valueFrom);

      if (isNaN(parsedValueTo) || isNaN(parsedValueFrom)) {
          throw new Error("Invalid input values");
      }

      const token_ = req.cookies.jwt;
      const decodedToken = jwt.verify(token_, 'net secret');
      const userId = decodedToken.id;

      const user = await User.findById(userId);

      if (parsedValueFrom > user.coins[coinFrom]) {
          throw new Error("Insufficient funds");
      }

      if (parsedValueFrom === 0) {
        throw new Error("Cannot convert 0");
      }

      user.coins[coinTo] += parsedValueTo;
      user.coins[coinFrom] -= parsedValueFrom;

      await user.save();

      const token = createToken(user._id);

      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

      res.status(200).json({ success: true, message: "Money converted successfully!" });
  } catch (error) {
      const errors = handleErrors(error);
      res.status(400).json({ errors });
  }
}
