//Rutas de autenticación
import { Router } from 'express'
import { test } from './auth.controller.js'

const api = Router()

api.get('/testing', test)

export default api