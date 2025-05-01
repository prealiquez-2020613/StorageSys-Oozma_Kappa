/*import User from '../src/user/user.model.js';
import {isValidObjectId, Schema} from 'mongoose';


export const findUser = async (id)=>{
    try {
        const userExist = await User.findById(id);
        if (!userExist) return false;
        return userExist;
    } catch (error) {
        console.error(error);
        return false;
    }
}*/