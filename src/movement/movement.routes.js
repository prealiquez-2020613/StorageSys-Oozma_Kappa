import express from 'express'
import { getAllMovements, createMovement, getMovementById, deleteMovement, filterMovements } from './movement.controller.js'
import { createMovementValidator } from '../../helpers/validators.js'
import { adminValidation, validateJwt } from '../../middlewares/validate.jwt.js'

const api = express.Router()

api.get('/movements', [validateJwt],getAllMovements)
api.get('/movements/:id', [validateJwt],getMovementById)
api.post('/movements', [validateJwt], createMovementValidator, createMovement)
api.delete('/movements/:id', [validateJwt], deleteMovement)
api.get('/movements/filter', [validateJwt], filterMovements)

export default api