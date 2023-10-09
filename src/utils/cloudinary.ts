import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

export const cloudinaryUploadImg = async (fileToUploads: any) => {
    return new Promise((resolve: any) => {
        cloudinary.uploader.upload(fileToUploads, (result: any) => {
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto",
                });
        });
    });
};