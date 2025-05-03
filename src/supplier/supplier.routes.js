import { Router } from 'express';
import {
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSuppliers,
    getSupplierById
} from './supplier.controller.js';
import { validateJwt, adminValidation } from '../../middlewares/validate.jwt.js';
import {registerSupplierValidator,updateSupplierValidator} from '../../helpers/validators.js';

const router = Router();

router.post('/createSupplier', [validateJwt, adminValidation, registerSupplierValidator], createSupplier);
router.put('/updateSupplier/:id', [validateJwt, adminValidation, updateSupplierValidator], updateSupplier);
router.delete('/deleteSupplier/:id', [validateJwt, adminValidation], deleteSupplier);
router.get('/getSuppliers', [validateJwt], getSuppliers);
router.get('/getSupplier/:id', [validateJwt], getSupplierById);

export default router;
