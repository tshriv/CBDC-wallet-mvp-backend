require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log(`Attempting to connect to MongoDB Atlas...`);

if (!uri) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
        console.log('Connected successfully to MongoDB Atlas');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection failed:', err.message);
        if (err.message.includes('bad auth')) {
            console.error('Hint: Check your username and password in the URI.');
        } else if (err.message.includes('ECONNREFUSED')) {
            console.error('Hint: Check if your IP is whitelisted in MongoDB Atlas Network Access.');
        }
        process.exit(1);
    });
