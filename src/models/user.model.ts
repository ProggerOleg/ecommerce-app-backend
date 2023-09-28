import bcrypt = require('bcrypt');
import mongoose, { Model, Types } from 'mongoose';
import crypto from 'crypto';

// 1. Create an interface representing a document in MongoDB.
interface IUser extends Document {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    password: string;
    isAdmin: boolean;
    isBlocked: boolean;
    cart: [] | undefined;
    address: Types.ObjectId,
    wishlist: Types.ObjectId,
    refreshToken: string;
    passwordChangedAt: Date;
    passwordResetToken: string | undefined;
    passwordResetExpires: Date | undefined;
    isPasswordMatched: (password: string) => boolean;
    createPasswordResetToken: () => string;
}

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
    } ],
    wishlist: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    } ],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
}
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.password = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes to reset password
    return resetToken;
};

// 3. Create a Model.
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
