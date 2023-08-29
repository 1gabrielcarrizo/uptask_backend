import express from "express"
import { registrar } from "../controllers/usuarioControllers.js"
const router = express.Router()

// autenticacion, registro y confirmacion de usuarios
router.post("/", registrar) // crea un nuevo usuario

export default router