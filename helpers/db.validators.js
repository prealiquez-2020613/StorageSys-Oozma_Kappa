import User from '../src/user/user.model.js'
import Category from '../src/category/category.model.js'
import {isValidObjectId, Schema} from 'mongoose'

export const existUsername = async(username)=>{
    const alreadyUsername = await User.findOne({username});
    if(alreadyUsername){
        console.error(`Username ${username} already exist`);
        throw new error(`Username ${username} already exist`);
    }
}

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

export const existCategory = async(name)=>{
    const alreadyExist = await Category.findOne({name})
    if(alreadyExist){
        console.error(`Category ${name} already exist`)
        throw new error(`Category ${name} already exist`)
    }
}

//Notification

// Verifica si un producto existe por ID
export const existProductById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error(`ID ${id} is not a valid MongoDB ID`)
    }
    
    const productExists = await Product.findById(id)
    if (!productExists) {
        throw new Error(`Product with ID ${id} does not exist`)
    }
}

// Verifica si una notificación existe por ID
export const existNotificationById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error(`ID ${id} is not a valid MongoDB ID`)
    }
    
    const notificationExists = await Notification.findById(id)
    if (!notificationExists) {
        throw new Error(`Notification with ID ${id} does not exist`)
    }
}

// Verifica si ya existe una notificación similar para evitar duplicados
export const checkDuplicateNotification = async (product, type) => {
    const existingNotification = await Notification.findOne({
        product,
        type,
        seen: false
    })
    
    if (existingNotification) {
        throw new Error(`An unseen notification of type ${type} already exists for this product`)
    }
}