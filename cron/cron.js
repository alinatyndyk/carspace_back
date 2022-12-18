const cron = require('node-cron');
const {checkOrderTokens} = require("./verify.car.tokens");

module.exports = () => {
    cron.schedule('0 0 * * * ', checkOrderTokens)
}