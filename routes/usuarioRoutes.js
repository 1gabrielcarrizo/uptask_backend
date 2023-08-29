import express from "express"
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar } from "../controllers/usuarioControllers.js"
import checkAuth from "../middleware/checkAuth.js"
const router = express.Router()

// autenticacion, registro y confirmacion de usuarios
router.post("/", registrar) // crea un nuevo usuario -> /api/usuarios
router.post("/login", autenticar) // loguearse -> /api/usuarios/login
router.get("/confirmar/:token", confirmar) // -> /api/usuarios/confirmar/:token
router.post("/olvide-password", olvidePassword) // se le envia al email un link -> /api/usuarios/olvide-password
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword) // get y post

router.get("/perfil", checkAuth, perfil) //  -> /api/usuarios/perfil

export default router