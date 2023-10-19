import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

interface IDataInterface {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendEmailMiddleware = async (data: IDataInterface, req: Request, res: Response) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_ID,
            pass: process.env.MP,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Hey 👻" ${ process.env.EMAIL_ID }`, // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body
    });

    console.log("Message sent: %s", info.messageId);
};

export const sendEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data: IDataInterface = req.body; // Assuming the data is in the request body

    try {
        await sendEmailMiddleware(data, req, res);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Email sending failed' });
    }
});