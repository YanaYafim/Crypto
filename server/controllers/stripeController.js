const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const product = {
    name: "Name", // Product Name
    price: 0 // Product Price
}

const generatePurchaseLink = async () => {
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
      success_url: '/success',
      cancel_url: '/cancel',
    });
    console.log(session.url)
    return session.url;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred while generating purchase link');
  }
};

module.exports = { generatePurchaseLink };