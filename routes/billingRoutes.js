const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin'); // It's required that you're logged in to access route

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //actually charging client's credit card
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 credits - Emaily',
      source: req.body.id
    });

    req.user.credits += 5; // req.user set up automatically with passport
    const user = await req.user.save(); // saves to DB

    res.send(user); // Responds to the request with the updated user
  });
};
