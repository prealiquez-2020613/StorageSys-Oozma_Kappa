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
router.get('/', validateJwt, getProducts)
router.get('/:id', validateJwt, getProductById)
router.put('/update/:id', [validateJwt, adminValidation, updateProductValidator], updateProduct)
router.delete('/delete/:id', [validateJwt, adminValidation], deleteProduct)
router.get('/out-of-stock', [validateJwt, adminValidation], getOutOfStockProducts)
router.get('/most-moved', validateJwt, getMostMovedProducts)
router.get('/by-category/:categoryId', validateJwt, getProductsByCategory)
router.get('/search', validateJwt, searchProductsByName)

export default router
