import cloudinary from '../config/cloudinary.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {

    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }

    const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'blog-website' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            stream.end(req.file.buffer);
        });
    };

    const result = await uploadFromBuffer();

    res.status(200).json({
        message: 'Image uploaded successfully',
        url: result.secure_url
    });

});
