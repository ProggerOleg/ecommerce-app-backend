import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const multerStorage = multer.diskStorage({
    destination: function(request: Request, file: Express.Multer.File, cb: DestinationCallback): void {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function(req: Request, file: Express.Multer.File, cb: FileNameCallback): void {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});

const multerFilter = (request: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const productImgResize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file: any) => {
            await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/products/${ file.filename }`);
        })
    );
};

export const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 200000 }
});