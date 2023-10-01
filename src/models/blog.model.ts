import mongoose, { Model, Types } from "mongoose";


// interface IBlog {
//     title: string;
//     description: string;
//     price: number;
//     category: string;
//     numViews: number;
//     isLiked: boolean;
//     isDisliked: boolean;
//     likes: Types.ObjectId;
//     dislikes: Types.ObjectId;
//     image: string;
//     author: string;
// }

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    } ],
    dislikes: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    } ],
    image: {
        type: String,
        default: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp7348236.jpg&f=1&nofb=1&ipt=2ca2c5e77e56688517a99db644629c4cc2dc4445495c4164a10ea6a1171f398e&ipo=images"
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});


// 3. Create a Model.
export const Blog = mongoose.model('Blog', blogSchema);
