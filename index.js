import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/db.js';

console.log('ENV CHECK:', process.env.MONGO_URI);

const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();