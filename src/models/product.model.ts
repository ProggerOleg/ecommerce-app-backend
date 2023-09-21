import mongoose, { Types } from 'mongoose';


interface IProduct {
    title: string;
    slug: string;
    description: string;
    price: number;
    category: Types.ObjectId;
    brand: string;
    quantity: number;
    sold: number;
    images: [] | undefined;
    color: string;
    ratings: number;

}

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    brand: {
        type: String,
        enum: [ "Apple", "Samsung", "Lenovo" ]
    },
    quantity: Number,
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: [ "Black", "Brown", "Red" ]
    },
    ratings: [ {
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId }
    } ],
}, {
    timestamps: true
}
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
