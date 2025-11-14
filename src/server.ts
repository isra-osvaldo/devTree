import express from 'express' 
import 'dotenv/config'
import router from './router'
import { connectDB } from './config/db'

const app = express()

connectDB()  // Conectar a MongoDB

// Leer datos de formulario
app.use(express.json())

app.use('/', router)  

export default app

