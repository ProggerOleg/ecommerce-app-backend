import jwt from 'jsonwebtoken';
// import 'dotenv/config';

export const generateToken = (id: string | object) => {
    try {
        let secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
        return jwt.sign({ id }, secret, { expiresIn: "3d" });
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

