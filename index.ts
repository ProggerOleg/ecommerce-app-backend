import express from 'express';
import { authRouter } from './src/routes/auth.route';
import bodyParser from 'body-parser';
import { notFound, errorHandler } from './src/middlewares/error.handler.middleware';
import cookieParser from 'cookie-parser';
import { productRouter } from './src/routes/deal.route';
import morgan from 'morgan';
import 'dotenv/config';
import cors from 'cors';
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'test',
    `${ process.env.DATABASE_USERNAME }`,
    process.env.DATABASE_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);


const app = express();
const PORT = process.env.PORT || 4000;

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database: ', error);
});

app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/api/user', authRouter);
app.use('/api/deals', productRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running at port ${ PORT }`);
});