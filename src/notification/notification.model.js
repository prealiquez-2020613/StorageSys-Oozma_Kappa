import { Schema, model } from 'mongoose'

const notificationSchema = Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required']
        },
        type: {
            type: String,
            enum: ['LOW_STOCK', 'EXPIRATION'],
            required: [true, 'Type is required']
        },
        message: {
            type: String,
            required: [true, 'Message is required']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        seen: {
            type: Boolean,
            default: false
        }
    }
)

export default model('Notification', notificationSchema)
