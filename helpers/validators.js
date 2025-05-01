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