import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
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


interface UserAttributes {
    id: number;
    name: string;
    email: string;
    refreshToken: string;
    password: string;
    passwordChangedAt: string;
    passwordResetToken: string | undefined;
    passwordResetExpires: string | undefined;
}

interface UserCreationAttributes extends Omit<UserAttributes, "id"> { }

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
    isPasswordMatched(enteredPassword: string): Promise<boolean>;
    createPasswordResetToken(): string;
}

const User = sequelize.define<UserInstance, UserCreationAttributes>("users", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
    },
    passwordChangedAt: {
        type: DataTypes.DATE,
    },
    passwordResetToken: {
        type: DataTypes.STRING,
    },
    passwordResetExpires: {
        type: DataTypes.DATE,
    }
}, { timestamps: false });

User.prototype.hashPassword = async function() {
    if (this.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
};

// Define a hook to call the hashPassword instance method before creating a user
User.beforeCreate((user) => {
    return (user as any).hashPassword();
});

User.prototype.isPasswordMatched = async function(enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
};
User.prototype.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.password = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes to reset password
    return resetToken;
};

sequelize.sync().then(() => {
    console.log('Users table connected successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export { User };