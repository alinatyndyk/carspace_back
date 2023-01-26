const {Router} = require('express');

const paymentRouter = Router();

const stripe = require('stripe')('sk_test_51MIX9gIAfGNWX8Hhl3mH4IFJladHRo1ErYUQv2ZEIWdfJIwKXvk5zHwOGUrntdnmJz7af89NUZFm94dVRYV00fRl00gqg3UAPA')

paymentRouter.post("/create-payment-intent", async (req, res) => {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

module.exports = paymentRouter;