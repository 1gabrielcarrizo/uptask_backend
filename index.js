// const express = require('express') // commonjs
import express from 'express' // ESM
// import 'dotenv/config'
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from './config/db.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'
import Usuario from './models/Usuario.js'

const app = express()

// permite leer lo que viene del body
app.use(express.json())

// variables de entorno
dotenv.config()

// conectar al mongoDB
conectarDB()

// configurar cors
const whiteList = [process.env.FRONTEND_URL]
const corsOptions= {
    // quien esta viendo el request
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // puede consultar la API
            callback(null, true)
        }else{
            // no tiene permitido consultar la API
            callback(new Error('Error de Cors'))
        }
    }
}

app.use(cors(corsOptions))

// Crear usuario por defecto si no existe
const crearUsuarioPorDefecto = async () => {
    try {
        const existeUsuario = await Usuario.findOne({ email: 'admin@admin.com' });
        if (!existeUsuario) {
            // Si no existe el usuario por defecto, lo crea
            const usuarioPorDefecto = new Usuario({
                nombre: 'Admin',
                email: 'admin@admin.com',
                password: '123456',
                confirmado: true // "true" evita verificar el usuario por medio del correo
            });
            await usuarioPorDefecto.save();
            console.log('Usuario por defecto creado exitosamente.');
        }
    } catch (error) {
        console.error('Error al crear el usuario por defecto:', error);
    }
}

// Llama a la función para crear el usuario por defecto
crearUsuarioPorDefecto();

// routing
app.use("/api/usuarios", usuarioRoutes)
app.use("/api/proyectos", proyectoRoutes)
app.use("/api/tareas", tareaRoutes)

const servidor = app.listen(process.env.PORT, () => {
    console.log('Servidor en el puerto 4000')
})



// Socket.io
import {Server} from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

// abrir conexion con socket.io
io.on("connection", (socket) => {
    console.log("Conectado a socket.io")
    // definir los eventos de socket.io
    socket.on('abrir proyecto', (proyecto) => {
        // "join" hace que los usuarios entren a un proyecto diferente
        socket.join(proyecto)
    })
    // agregar una nueva tarea
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })
    // eliminar una tarea
    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })
    // actualizar una tarea
    socket.on('actualizar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })
    // completar una tarea
    socket.on('cambiar estado', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })
})