import express from "express"
import { autenticar, registrar } from "../controllers/usuarioControllers.js"
const router = express.Router()

// autenticacion, registro y confirmacion de usuarios
router.post("/", registrar) // crea un nuevo usuario -> /api/usuarios
router.post("/login", autenticar) //  -> /api/usuarios/login

export default router