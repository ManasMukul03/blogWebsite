import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || "Server Error";

    // Malformed ObjectId, e.g. /api/blog/abc
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path === '_id' ? 'id' : err.path}`;
    }

    // Unique index violation
    if (err.code === 11000) {
        statusCode = 409;
        message = `${Object.keys(err.keyValue || {}).join(', ') || 'Value'} already exists`;
    }

    // File too large, unexpected field, etc.
    if (err instanceof multer.MulterError) {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

export default errorHandler;
