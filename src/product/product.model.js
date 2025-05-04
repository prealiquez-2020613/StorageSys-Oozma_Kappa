import { Schema, model } from 'mongoose';

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            maxLength: [100, 'Product name cannot exceed 100 characters'],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required']
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative']
        },
        supplier: {
            type: Schema.Types.ObjectId,
            ref: 'Supplier',
            required: [true, 'Supplier is required']
        },
        entryDate: {
            type: Date,
            required: [true, 'Etry date is required']
        },
        expirationDate: {
            type: Date
        },
        minStock: {
            type: Number,
            default: 15
        },
        soldUnits: {
            type: Number,
            default: 0,
            min: [0, 'Sold units cannot be negative']
        }
    }
);

export default model('Product', productSchema);