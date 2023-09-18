import bcrypt = require('bcrypt');
import mongoose, { Schema, Types } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IUser {
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
    isPasswordMatched: (password: string) => boolean;
}

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<IUser>({
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
    } ]
}, {
    timestamps: true
}
);

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 3. Create a Model.
export const User = mongoose.model<IUser>('User', userSchema);
