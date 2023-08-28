// const express = require('express') // commonjs
import express from 'express' // ESM
// import 'dotenv/config'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'

const app = express()

dotenv.config()

conectarDB()

app.listen(process.env.PORT, () => {
    console.log('Servidor en el puerto 4000')
})