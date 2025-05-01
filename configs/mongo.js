import mongoose from "mongoose"

export const connect = async()=>{
    try {

        mongoose.connection.on('error', ()=>{
            console.log('Mongo DB | Could not be connected to MongoDB')
        });
        mongoose.connection.on('connecting', ()=>{
            console.log('Mongo DB | Try Connecting')
        });
        mongoose.connection.on('connected', ()=>{
            console.log('Mongo DB | Connected to MongoDB')
        });
        mongoose.connection.once('open', ()=>{
            console.log('Mongo DB | Connected to Database')
        });
        mongoose.connection.on('reconnected', ()=>{
            console.log('Mongo DB | Reconnecting to MongoDB')
        });
        mongoose.connection.on('disconnect', ()=>{
            console.log('Mongo DB | Disconnected')
        });


        await mongoose.connect(
            `${process.env.DB_SERVICE}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
            {
                maxPoolSize : 50,
                serverSelectionTimeoutMS : 5000
            }
        );
    } catch (error) {
        console.error('Database connection failed', error)
    }
}