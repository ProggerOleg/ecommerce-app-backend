import jwt from 'jsonwebtoken';

export const generateToken = (id: string | object) => {
    try {
        let secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
        return jwt.sign({ id }, secret, { expiresIn: "1d" });
    } catch (error) {
        console.error("Error generating token:", error);
        throw error;
    }
};

