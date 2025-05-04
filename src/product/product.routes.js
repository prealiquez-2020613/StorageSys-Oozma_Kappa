import { Router } from 'express'
import {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getOutOfStockProducts,
    getMostMovedProducts,
    getProductsByCategory,
    searchProductsByName
} from './product.controller.js'

import { validateJwt, adminValidation } from '../../middlewares/validate.jwt.js'
import { addProductValidator, updateProductValidator } from '../../helpers/validators.js'

const router = Router()

router.post('/add', [validateJwt, adminValidation, addProductValidator], addProduct)
router.get('/getProducts', validateJwt, getProducts)
router.get('/searchProduct/:id', validateJwt, getProductById)
router.put('/updateProduct/:id', [validateJwt, adminValidation, updateProductValidator], updateProduct)
router.delete('/deleteProduct/:id', [validateJwt, adminValidation], deleteProduct)
router.get('/getOutOfStock', [validateJwt, adminValidation], getOutOfStockProducts)
router.get('/getMostMoved', validateJwt, getMostMovedProducts)
router.get('/getProductByCategory/:categoryId', validateJwt, getProductsByCategory)
router.get('/searchProduct', validateJwt, searchProductsByName)

export default router
