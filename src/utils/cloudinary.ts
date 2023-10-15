import { UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'davbaeqte',
    api_key: '715979897411124',
    api_secret: '***************************'
});


export const cloudinaryUploadImg = async (imagePath: string, name: string) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(imagePath, (result) => {
            resolve(
                {
                    url: result?.secure_url,
                },
            );
        });
    });
};
