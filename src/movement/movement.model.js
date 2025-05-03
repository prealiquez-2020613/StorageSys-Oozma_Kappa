//MIKE
import { Schema, model } from 'mongoose'

const movementSchema = Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        type: {
            type: String,
            enum: ['ENTRY', 'EXIT'],
            required: [true, 'Type is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Number is required'],
            min: [1, 'Total amount cannot be 0 or negative']
        },
        date: {
            type: Date,
            default: Date.now
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Employee is required'],
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
        },
        destination: {
            type: String,
            required: [true, 'Destination is required'],
        }
    }
)

export default model('Movement', movementSchema)
