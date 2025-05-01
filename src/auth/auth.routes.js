//Rutas de autenticación
import { Router } from 'express'
import { login, register, test} from './auth.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import {registerValidator, loginValidator} from '../../helpers/validators.js';

const api = Router()

api.get('/testing', test)
api.post('/login', [loginValidator], login);
api.post('/register',[registerValidator], register);

export default api