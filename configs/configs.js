module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/test',

    ACCESS_SECRET_WORD: process.env.ACCESS_SECRET_WORD,
    REFRESH_SECRET_WORD: process.env.REFRESH_SECRET_WORD,
}