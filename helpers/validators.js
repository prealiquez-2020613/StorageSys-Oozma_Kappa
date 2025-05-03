import {body} from 'express-validator'
import {validateErrorWithoutImg} from './validate.error.js'
import {existUsername, existEmail, existCategory} from './db.validators.js'

export const registerValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('surname', 'Surname cannot be empty').notEmpty(),
    body('email', 'Email cannot be empty').notEmpty().isEmail().custom(existEmail),
    body('username', 'Username cannot be empty').notEmpty().toLowerCase().custom(existUsername),
    body('password', 'Password cannot be empty').notEmpty().isStrongPassword().isLength({min : 8}),
    body('phone', 'Phone cannot be empty').notEmpty().isMobilePhone(),
    validateErrorWithoutImg
]

export const loginValidator = [
    body('username', 'Username cannot be empty').notEmpty(),
    body('password', 'Password cannot be empty').notEmpty().isLength({min : 8}),
    validateErrorWithoutImg
]

export const UpdateValidator = [
    body('name', 'Name cannot be empty').optional().notEmpty(),
    body('surname', 'Surname cannot be empty').optional().notEmpty(),
    body('email', 'Email cannot be empty or is not a valid email').isEmail().optional().notEmpty().custom(existEmail),
    body('username', 'Username cannot be empty').optional().notEmpty().toLowerCase().custom(existUsername),
    body('phone', 'Phone cannot be empty or is not a valid phone').optional().notEmpty().isMobilePhone(),
    validateErrorWithoutImg
]

export const newPasswordValidation = [
    body('actualPassword', 'Actual password is required').notEmpty(),
    body('newPassword', 'New password cannot be empty').notEmpty().isStrongPassword().isLength({min : 8}),
    validateErrorWithoutImg
]

export const deleteAccountValidation = [
    body('password', 'Password is required').notEmpty(),
    validateErrorWithoutImg
]

export const updateRoleValidation = [
    body('newRole', 'Role is required').notEmpty(),
    validateErrorWithoutImg
]

export const addCategoryValidator = [
    body('name', 'Name is required').notEmpty().isLength({max : 50}).custom(existCategory),
    validateErrorWithoutImg
]

export const updateCategoryValidation = [
    body('name', 'Name is required').notEmpty().isLength({max : 50}).custom(existCategory),
    validateErrorWithoutImg
]

export const addProductValidator = [
    body('name', 'Name cannot be empty').notEmpty(),
    body('category', 'Category is required').notEmpty(),
    body('stock', 'Stock is required').notEmpty(),
    body('supplier', 'Supplier is required').notEmpty(),
    body('entryDate', 'Entry date is required').notEmpty().isISO8601().toDate(),
    body('expirationDate', 'Expiration date is required').notEmpty().isISO8601().toDate(),
    body('minStock', 'Min stock must be numeric').optional(),
    validateErrorWithoutImg
]

export const updateProductValidator = [
    body('name', 'Name cannot be empty').optional().notEmpty(),
    body('category', 'Category is required').optional().notEmpty(),
    body('stock', 'Stock is required').optional().notEmpty(),
    body('supplier', 'Supplier is required').optional().notEmpty(),
    body('entryDate', 'Entry date is required').optional().notEmpty().isISO8601().toDate(),
    body('expirationDate', 'Expiration date is required').optional().notEmpty().isISO8601().toDate(),
    body('minStock', 'Min stock must be numeric').optional(),
    validateErrorWithoutImg
]

// ----------------------------------------------- MOVEMENT ------------------------------------------------------------------

export const createMovementValidator = [
    body('product')
        .notEmpty().withMessage('Product is required')
        .isMongoId().withMessage('Product must be a valid MongoDB ID'),

    body('type')
        .notEmpty().withMessage('Type is required')
        .isString().withMessage('Type must be a string')
        .isIn(['ENTRY', 'EXIT']).withMessage('Type must be either "ENTRY" or "EXIT"'),

    body('quantity')
        .notEmpty().withMessage('Quantity is required')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

    body('employee')
        .notEmpty().withMessage('Employee is required')
        .isMongoId().withMessage('Employee must be a valid MongoDB ID'),

    body('reason')
        .notEmpty().withMessage('Reason is required')
        .isString().withMessage('Reason must be a string')
        .isLength({ max: 255 }).withMessage('Reason cannot exceed 255 characters'),

    body('destination')
        .notEmpty().withMessage('Destination is required')
        .isString().withMessage('Destination must be a string')
        .isLength({ max: 255 }).withMessage('Destination cannot exceed 255 characters'),

    validateErrorWithoutImg
]
