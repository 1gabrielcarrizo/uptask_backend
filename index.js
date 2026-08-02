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
    // Esto permite notificar a un usuario especifico (para el dashboard)
    socket.on('conectado', (id) => {
        socket.join(id)
    })
    // agregar una nueva tarea
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto._id || tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })
    // eliminar una tarea
    socket.on('eliminar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id || tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })
    // actualizar una tarea
    socket.on('actualizar tarea', (tarea) => {
        const proyecto = tarea.proyecto._id || tarea.proyecto
        socket.to(proyecto).emit('tarea actualizada', tarea)
    })
    // completar una tarea
    socket.on('cambiar estado', (tarea) => {
        const proyecto = tarea.proyecto._id || tarea.proyecto
        socket.to(proyecto).emit('nuevo estado', tarea)
    })
    // --- CAMBIO PARA ERROR 2: Eventos de Colaboradores ---
    socket.on('nuevo colaborador', (datos) => {
        const colaboradorId = datos.colaborador._id
        // Le avisamos SOLO al colaborador que fue agregado
        socket.to(colaboradorId).emit('colaborador agregado', datos.proyecto)
    })
    socket.on('eliminar colaborador', (datos) => {
        const colaboradorId = datos.colaborador._id
        // Le avisamos SOLO al colaborador que fue eliminado
        socket.to(colaboradorId).emit('colaborador eliminado', datos.proyecto)
    })
    // --- NUEVOS EVENTOS ---
    socket.on('editar proyecto', (proyecto) => {
        // 1. Avisar a los que están DENTRO del proyecto (vista detallada)
        socket.to(proyecto._id).emit('proyecto actualizado', proyecto)
        
        // 2. Avisar a los colaboradores en sus Dashboards
        if(proyecto.colaboradores) {
            proyecto.colaboradores.forEach(colaborador => {
                // A veces colaborador es un objeto (si vino populado) o un ID.
                const colaboradorId = colaborador._id || colaborador
                socket.to(colaboradorId).emit('proyecto actualizado', proyecto)
            })
        }
    })
    socket.on('eliminar proyecto', (proyecto) => {
        // 1. Avisar a los que están DENTRO del proyecto (para redirigirlos)
        socket.to(proyecto._id).emit('proyecto eliminado', proyecto)

        // 2. Avisar a los colaboradores (para eliminarlo de su Dashboard)
        if(proyecto.colaboradores) {
            proyecto.colaboradores.forEach(colaborador => {
                const colaboradorId = colaborador._id || colaborador
                socket.to(colaboradorId).emit('proyecto eliminado', proyecto)
            })
        }
    })
    // -----------------------
})