const cron = require('node-cron');
const removeOldAuthTokens = require('./remove.old.auth.tokens');
const {checkOrderTokens} = require("./verify.car.tokens");
const {sendTodayOrderEmail} = require("./todays.order.email");

module.exports = () => {
    cron.schedule('*/10 * * * * *', removeOldAuthTokens)
    cron.schedule('0 0 * * * *', checkOrderTokens)
    cron.schedule('0 4 1 * * *', sendTodayOrderEmail)
}