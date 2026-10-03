import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const getToken = (req) => {
    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    return token;
};

const protect = async (req, res, next) => {
    try {

        const token = getToken(req);

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Attaches req.user when a valid token is present, but never rejects the request.
export const optionalAuth = async (req, res, next) => {
    try {
        const token = getToken(req);

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
    } catch (error) {
        // invalid/expired token: treat as anonymous
    }

    next();
};

export default protect;
