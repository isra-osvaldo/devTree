import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount } from './handlers'

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
    createAccount)

export default router