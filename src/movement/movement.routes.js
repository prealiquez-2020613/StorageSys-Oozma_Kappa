import express from 'express'
import { getAllMovements, createMovement, getMovementById, deleteMovement, filterMovements } from './movement.controller.js'
import { createMovementValidator } from '../../helpers/validators.js'
import { adminValidation, validateJwt } from '../../middlewares/validate.jwt.js'

const api = express.Router()

api.get('/getMovements', [validateJwt],getAllMovements)
api.get('/findMovement/:id', [validateJwt],getMovementById)
api.post('/createMovements', [validateJwt], createMovementValidator, createMovement)
api.delete('/deleteMovements/:id', [validateJwt], deleteMovement)
api.get('/filterMovements/filter', [validateJwt], filterMovements)

export default api