const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
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
app.use('/payment', paymentRouter)

const path = require('path');
const {Image_model} = require("./dataBase");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'Images',
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('testImage');

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        console.log(req.body, 'req body img');
        if (err) {
            console.log(err);
        } else {
            const newImage = new Image_model({
                name: req.body.name,
                image: {
                    data: req.file.filename,
                    contentType: 'image/png'
                }
            })
            newImage.save()
                .then(() => res.send('successfully uploaded'))
                .catch(err => console.log(err))
        }
    })
});

app.get('/upload', (req, res) => {
    res.send('upload file');
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