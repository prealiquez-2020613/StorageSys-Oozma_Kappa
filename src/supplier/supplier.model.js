import { Schema, model } from 'mongoose'

const supplierSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        },
        contact: {
            type: String,
            required: [true, 'Contact is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
    }
)

export default model('Supplier', supplierSchema)
