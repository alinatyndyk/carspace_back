const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

const carRouter = require('./router/car.router')
const {PORT, MONGO_URL} = require("./configs/configs");
const {userRouter, companyRouter, authRouter, paymentRouter, brandRouter} = require("./router");
const {mainErrorHandler} = require("./errors")
const runCronJobs = require('./cron/cron');
const {regexBrand} = require("./constants/car.valid");

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose.set('strictQuery', false);

app.get('/', (req, res) => {
    console.log('REQUEST PROCESSED');
    res.json('HELLO WORLD')
})

app.use('/cars', carRouter)
app.use('/users', userRouter)
app.use('/companies', companyRouter)
app.use('/brands', brandRouter)
app.use('/auth', authRouter)
app.use('/payment', paymentRouter)

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