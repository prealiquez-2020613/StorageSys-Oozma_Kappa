import User from './user.model.js'
import { checkPassword, encrypt } from "../../utils/encrypt.js"


//ELIMINAR CUENTA
export const deleteAccount = async (req, res) => {
    try {

        const userId = req.user.uid
        const {password} = req.body

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' })
        }
        
        if(user && await checkPassword(user.password, password)){

            await User.findByIdAndUpdate(userId, {userStatus : false}, {new : true})
            return res.send({ success: true, message: 'User deleted successfully' })

        };
        
        return res.status(404).send({succes : false, message : 'Wrong password'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error deleting account', error })
    }
};


//ELIMINAR USUARIO
export const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' })
        }
        
        await User.findByIdAndUpdate(userId, {userStatus : false}, {new : true})
        return res.send({ success: true, message: 'User deleted successfully' })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, message: 'General error deleting user', error })
    }
};


//UPDATE USER
export const updateUser = async(req, res) =>{
    try {

        const id = req.user.uid
        const newdata = req.body
        console.log(id)

        if(newdata.password) return res.status(403).send({message : 'You cannot update the password here'})
        if(newdata.role) return res.status(403).send({message : 'You cannot update the role here'})

        const data = await User.findByIdAndUpdate(id, newdata, {new : true})

        if(!data) return res.status(404).send({succes : false, message : 'User not found'})
        return res.send({succes: true, message: 'User updated successfully', data})

    } catch (error) {
        console.error(error);
        return res.status(500).send({success: false, message: 'General Error', error})
    }
};



//UPDATE ROLE
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params
        const { newRole } = req.body

        const validRoles = ['ADMIN', 'CLIENT', 'HOTEL_ADMIN']

        if (!validRoles.includes(newRole.toUpperCase())) {
            return res.status(400).send({ success: false, message: 'Roles can only be ADMIN, CLIENT OR HOTEL_ADMIN' })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' })
        }

        user.role = newRole.toUpperCase()
        await user.save()

        return res.send({ success: true, message: 'User role updated successfully', user })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'General Error', error })
    }
}


// UPDATE PASSWORD
export const updatePassword = async(req, res)=>{
    try {
        const id = req.user.uid
        const {actualPassword, newPassword} = req.body

        const user = await User.findById(id)
        if(!user) return res.status(404).send({message : 'User not found'})

        if(user && await checkPassword(user.password, actualPassword)){

            user.password = await encrypt(newPassword)
            await user.save()

            return res.send({succes : true, message : 'Password Updated Succesfully', user})
        }
        
        return res.status(404).send({succes : false, message : 'Wrong password'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({success: false, message: 'General Error', error})
    }

};


//OBTENER TODOS LOS USUARIOS
export const getAll = async(req, res) =>{
    try {

        const {limit = 20, skip = 0} = req.query
        const users = await User.find().skip(skip).limit(limit)

        if(users.legth === 0) return res.status(404).send({succes : false, message : 'Users not found'})
        return res.send({success: true, message : 'Users found', users, total : users.length})

    } catch (error) {
        console.error(error)
        return res.status(500).send({success: false, message : 'General error', error})
    }
}

//OBTENER UN USARIO POR SU ID
export const get = async(req, res)=>{
    try {

        const {id} = req.params
        const user = await User.findById(id)

        if(!user) return res.status(404).send({success: false, message: 'User not found'})
        return res.send( {success: true, message: 'User found', user})

    } catch (error) {
        return res.status(500).send({success: false, message: 'General Error', error})
    }
}