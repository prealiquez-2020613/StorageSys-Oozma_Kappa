import User from '../src/user/user.model.js'
import {isValidObjectId, Schema} from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username});
    if(alreadyUsername){
        console.error(`Username ${username} already exist`);
        throw new error(`Username ${username} already exist`);
    }
};

export const findUser = async (id)=>{
    try {
        const userExist = await User.findById(id)
        if (!userExist) return false
        return userExist
    } catch (error) {
        console.error(error)
        return false
    }
}

export const existEmail = async(email)=>{
    const alreadyExist = await User.findOne({email})
    if(alreadyExist){
        console.error(`Email ${email} already exist`)
        throw new error(`Email ${email} already exist`)
    }
}