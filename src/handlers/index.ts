import { Request, Response } from "express"
import slugify from "slugify"
import colors from "colors"
import { validationResult } from "express-validator"
import User from "../models/User"
import { hashPassword } from "../utils/auth"

export const createAccount = async (req: Request, res: Response) => {

    // Manejar errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body 
    const userExists = await User.findOne({email}) 

    if (userExists) {
        const error = new Error('Un usuario con ese email ya está registrado.')
        console.log(colors.bgRed.bold(error.message))
        return res.status(409).json({error: error.message})
    } 

    const handle = slugify(req.body.handle, {lower: true, replacement: ''})
    const handleExists = await User.findOne({handle})

    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible.')
        console.log(colors.bgRed.bold(error.message))
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle
    await user.save()  
    res.status(201).json({message: 'Usuario creado correctamente.'})
}

