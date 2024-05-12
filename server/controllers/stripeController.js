const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net secret', {
    expiresIn: maxAge
  });
};

let coinGlobal;
let usdValueGlobal;

const generatePurchaseLink = async (req, res) => {
  const coin = {
    coinName: req.query.coinName,
    coinValue: req.query.coinValue
  }
  const usdValue = req.query.usdValue;

  coinGlobal = coin;
  usdValueGlobal = usdValue;

  const product = {
    name: `${coin.coinValue} ${coin.coinName}s `,
    price: usdValue
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/pay/payment-success',
      cancel_url: 'http://localhost:3000/pay',
    });
    console.log(session.url);
    res.redirect(session.url);
  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred while generating purchase link');
  }
};

const successPayment = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    if (session.payment_status === 'paid') {
      const token_ = req.cookies.jwt;
      const decodedToken = jwt.verify(token_, 'net secret');
      const userId = decodedToken.id;

      const recipient = await User.findById(userId);
      recipient.coins[coinGlobal.coinName] = coinGlobal.coinValue;
      await recipient.save();
      const token = createToken(userId);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log(`Successfully added ${coinGlobal.coinValue} ${coinGlobal.coinName}s to user with ID ${userId}`);
      res.redirect('/wallet');
    } else {
      res.redirect('/homeAfter');
    }
  } catch (error) {
    res.redirect('/payment-error');
  }
}

module.exports = { generatePurchaseLink, successPayment };