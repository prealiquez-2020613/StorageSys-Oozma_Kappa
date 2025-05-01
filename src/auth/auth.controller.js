import User from '../user/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

//REGISTRO
export const register = async(req, res)=>{
    try{

        let data = req.body
        let user = new User(data)

        user.password = await encrypt(user.password)

        user.role = 'EMPLOYEE'
        user.userStatus = true

        await user.save()
        return res.send({succes : true, message: `Registered successfully, can be logged with username: ${user.username}`})

    }catch(err){
        console.error(err)
        return res.status(500).send({succes : false, message: 'General error with registering user', err})
    }
}

//LOGIN
export const login = async(req, res)=>{
    try {

        let {username, password} = req.body

        let user = await User.findOne({username})

        if(user && await checkPassword(user.password, password)){

            let loggedUser = {
                uid : user._id,
                name : user.name,
                username : user.username,
                role : user.role
            }

            let token = await generateJwt(loggedUser)

            return res.send({succes : true, message : `Welcome, ${user.name}`, loggedUser, token})
        }
        return res.status(404).send({succes : false, message : 'Wrong email ir password'})
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({succes : false, message: 'General error with login function', error})
    }
}