import { Sequelize, DataTypes } from "sequelize";
import 'dotenv/config';

const sequelize = new Sequelize(
    'test',
    `${ process.env.DATABASE_USERNAME }`,
    process.env.DATABASE_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);


export const Deal = sequelize.define("deals", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
    },
    yield: {
        type: DataTypes.FLOAT,
    },
    tiket: {
        type: DataTypes.INTEGER,
    },
    days: {
        type: DataTypes.INTEGER,
    },
    sold: {
        type: DataTypes.INTEGER,
    }
}, { timestamps: false });

sequelize.sync().then(() => {
    console.log('Deals table connected successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
