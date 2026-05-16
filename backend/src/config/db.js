const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async (attempt = 1) => {
	if (!process.env.MONGO_URI) {
		console.error('MONGO_URI is not defined. Please set MONGO_URI in your environment variables');
		process.exit(1);
	}

	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 10000,
			connectTimeoutMS: 10000,
		});

		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		const maxAttempts = Number(process.env.MONGO_RETRY_ATTEMPTS || 5);
		console.error(`Error connecting to MongoDB (attempt ${attempt}/${maxAttempts}): ${error.message}`);

		if (attempt >= maxAttempts) {
			process.exit(1);
		}

		const delayMs = attempt * 5000;
		console.log(`Retrying MongoDB connection in ${delayMs / 1000} seconds...`);
		await sleep(delayMs);
		return connectDB(attempt + 1);
	}
};

module.exports = connectDB;