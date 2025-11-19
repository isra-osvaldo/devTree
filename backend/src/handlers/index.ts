import { Request, Response } from "express"
import slugify from "slugify"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"

export const createAccount = async (req: Request, res: Response) => {

    const { email, password } = req.body 
    const userExists = await User.findOne({email}) 

    if (userExists) {
        const error = new Error('Un usuario con ese email ya está registrado.')
        return res.status(409).json({error: error.message})
    } 

    const handle = slugify(req.body.handle, {lower: true, replacement: ''})
    const handleExists = await User.findOne({handle})

    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible.')
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body)
    user.password = await hashPassword(password)
    user.handle = handle
    await user.save()  
    res.status(201).json({message: 'Usuario creado correctamente.'})
}


export const login = async (req: Request, res: Response) => {
    
    const { email, password } = req.body 

    // Comprobar si el usuario está registrado
    const user = await User.findOne({email}) 
    console.log(user)

    if (!user) {
        const error = new Error('El usuario no existe.')
        return res.status(404).json({error: error.message})
    } 
    
    // Comprobar el password 
    const isPasswordValid = await checkPassword(password, user.password)
    if (!isPasswordValid) {
        const error = new Error('Password incorrecto.')
        return res.status(401).json({error: error.message})
    }

    res.send('Autenticación exitosa.')
}

