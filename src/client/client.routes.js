import { Router } from 'express'
import { save, getAll, update, eliminate } from '../client/client.controller.js'
import { validateJwt, adminValidation } from '../../middlewares/validate.jwt.js'
import { addClientValidator, updateClientValidation } from '../../helpers/validators.js'

const api = Router()

api.post('/addClient', [validateJwt, adminValidation, addClientValidator], save)
api.get('/allClients', [validateJwt, adminValidation], getAll)
api.put('/updateClient/:id', [validateJwt, adminValidation, updateClientValidation], update)
api.delete('/deleteClient/:id', [validateJwt, adminValidation], eliminate)

export default api