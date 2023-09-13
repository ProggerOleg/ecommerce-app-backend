import { connect } from 'mongoose';

const dbConnect = () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw Error(".env file doesn't have database url");
        } else {
            const conn = connect(process.env.MONGODB_URL);
            console.log("Database Conected Successfully");
        }
    } catch (err: any) {
        console.log("Database Conection error");
        throw new Error(err.message);
    }
};

export { dbConnect };