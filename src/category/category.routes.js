import {Router} from 'express'
import { addCategory, allCategories, updateCategory, deleteCategory } from '../category/category.controller.js'
import { validateJwt, adminValidation } from '../../middlewares/validate.jwt.js'
import {addCategoryValidator, updateCategoryValidation} from '../../helpers/validators.js'

const api = Router()

//Rutas privadas
api.post('/addCategory', [validateJwt, adminValidation, addCategoryValidator], addCategory)
api.get('/allCategories', [validateJwt, adminValidation], allCategories)
api.put('/updateCategory/:id', [validateJwt, adminValidation, updateCategoryValidation], updateCategory)
api.delete('/deleteCategory/:id', [validateJwt, adminValidation], deleteCategory)

export default api