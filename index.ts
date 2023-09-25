import express from 'express';
import { dbConnect } from './src/config/dbConnect';
import { authRouter } from './src/routes/auth.route';
import bodyParser from 'body-parser';
import { notFound, errorHandler } from './src/middlewares/error.handler.middleware';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { productRouter } from './src/routes/product.route';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 4000;

dbConnect();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running at port ${ PORT }`);
});