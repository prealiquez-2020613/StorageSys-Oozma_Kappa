import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
    
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            maxLength: [50, `Category name can't exceed 50 characters`]
        },
        categoryStatus: {
            type: Boolean,
            default: true
        }
    }
);

export default model('Category', categorySchema);
