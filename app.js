const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
require('dotenv').config()

const carRouter = require('./router/car.router')
const {PORT, MONGO_URL, STRIPE_SECRET_KEY} = require("./configs/configs");
const {userRouter, companyRouter, authRouter, paymentRouter, brandRouter} = require("./router");
const {mainErrorHandler} = require("./errors")
const runCronJobs = require('./cron/cron');
const {regexBrand} = require("./constants/car.valid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extend: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);

app.use(cors(corsOptions));
app.get('/', (req, res) => {
    console.log('REQUEST PROCESSED');
    res.json('HELLO WORLD')
})

app.use('/cars', carRouter)
app.use('/users', userRouter)
app.use('/companies', companyRouter)
app.use('/brands', brandRouter)
app.use('/auth', authRouter)
// app.use('/payment', paymentRouter)

const Stripe = require('stripe')(STRIPE_SECRET_KEY);
app.post('/payment', async(req, res) => {
    let status, error;
    const {from_date, to_date, carId, token, amount} = req.body;
    console.log(token, 'stripe token');
    console.log(from_date, to_date, carId, 'stripe dates');
    try{
        await Stripe.charges.create({
            source: token.id,
            amount,
            currency: 'usd'
        })
        status = 'successful'
    }catch (e) {
        console.log(e, 'error');
        status = 'failure'
    }
    res.json({error, status})
})

// app.post('/create-checkout-session', async (req, res) => {
//     console.log('SESSION')
//     const session = await Stripe.checkout.sessions.create({
//         line_items: [
//             {
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: 'T-shirt',
//                     },
//                     unit_amount: 2000,
//                 },
//                 quantity: 1,
//             },
//         ],
//         mode: 'payment',
//         success_url: 'http://localhost:3000/checkout-success',
//         cancel_url: 'http://localhost:3000/chackout-cancel',
//     });
//
//     res.redirect({url: session.url});
//     // res.json('success');
// });


app.use('/photos', express.static('Images'))
const multer = require('multer');
app.get('/upload/:path', (req, res) => {
    console.log(req.params);
    // res.download('Images/'+req.params.path)
    res.render('Images/' + req.params.path)
});
app.use('*', (req, res, next) => {
    next(new Error('Route not found'))
});
app.use(mainErrorHandler);

app.listen(PORT, () => {
    console.log(`app listen ${PORT}`);
    mongoose.connect(MONGO_URL).then(() => {
        console.log(`connected to CarSpace database. Api: ${MONGO_URL}`);
        runCronJobs();
        regexBrand();
    })
})