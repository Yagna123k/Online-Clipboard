const mongoose = require('mongoose');
require("dotenv").config();

async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MongoURI);
        console.log("Connected to MongoDB🚀");
    } catch (err) {
        console.log("Connection to MongoDB Failed😵", err);
    }
}

module.exports = connectMongoDB;
