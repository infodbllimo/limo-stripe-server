console.log("🚀 Starting Stripe backend...");

// Load .env variables
const dotenvResult = require('dotenv').config();
if (dotenvResult.error) {
  console.error("❌ .env failed to load!", dotenvResult.error);
} else {
  console.log("✅ .env loaded successfully.");
}

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Check if STRIPE_SECRET_KEY exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY not found in .env file!");
  process.exit(1); // stop the server if no key
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("❌ Error creating PaymentIntent:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => {
  console.log("✅ Stripe server running at http://localhost:4242");
});
