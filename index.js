// const express = require('express') // commonjs
import express from 'express' // ESM
// import 'dotenv/config'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'

const app = express()

// permite leer lo que viene del body
app.use(express.json())

// variables de entorno
dotenv.config()

// conectar al mongoDB
conectarDB()

// routing
app.use("/api/usuarios", usuarioRoutes)

app.listen(process.env.PORT, () => {
    console.log('Servidor en el puerto 4000')
})