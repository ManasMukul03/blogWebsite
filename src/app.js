import express from 'express';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

import protect from './middleware/auth.middleware.js';

app.get('/api/protected', protect, (req, res) => {
    res.json({
        message: 'You accessed protected route',
        user: req.user
    });
});

app.use(errorHandler);

export default app;