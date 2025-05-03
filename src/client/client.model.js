//PIRIR
import { Schema, model } from 'mongoose'

const clientSchema = Schema(
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
        company: {
            type: String,
            required: [true, 'Company is required'],
            maxLength: [50, `Can't be overcome 50 characters`]
        }
    }
)

export default model('Client', clientSchema)
