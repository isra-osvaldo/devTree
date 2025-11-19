import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount, login } from './handlers'
import { handleInputErrors } from './middleware/validation'

const router = Router()

// Autenticación y Registro
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handler no puede estar vacío'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('email')
        .isEmail()
        .withMessage('El email no es válido'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password debe tener mínimo 8 caracteres'),
    handleInputErrors,
    createAccount)


router.post('/auth/login', 
    body('email')
        .isEmail()
        .withMessage('El email no es válido'),
    body('password')
        .notEmpty()
        .withMessage('El password es obligatorio'),
    handleInputErrors,
    login
)

export default router