import express from "express"
import { crearUsuario, usuarios } from "../controllers/usuarioControllers.js"
const router = express.Router()

router.get('/', usuarios) // "/" apunta a "/api/usuarios"
router.post('/', crearUsuario) // "/" apunta a "/api/usuarios"


export default router