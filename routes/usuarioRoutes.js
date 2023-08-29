import express from "express"
import { autenticar, confirmar, registrar } from "../controllers/usuarioControllers.js"
const router = express.Router()

// autenticacion, registro y confirmacion de usuarios
router.post("/", registrar) // crea un nuevo usuario -> /api/usuarios
router.post("/login", autenticar) // loguearse -> /api/usuarios/login
router.get("/confirmar/:token", confirmar) // -> /api/usuarios/confirmar/:token

export default router