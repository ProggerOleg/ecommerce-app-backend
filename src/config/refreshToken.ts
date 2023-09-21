import jwt from 'jsonwebtoken';

export const generateRefreshToken = (id: string | object) => {
    try {
        let secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
        return jwt.sign({ id }, secret, { expiresIn: "3d" });
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw error;
    }
};

