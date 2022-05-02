const mongoose = require('mongoose');

const connectDB = async () => {
    if (process.env.NODE_ENV === 'test') {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();

        await mongoose.connect(uri);
    } else {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}...`)
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }
}

module.exports = connectDB;
