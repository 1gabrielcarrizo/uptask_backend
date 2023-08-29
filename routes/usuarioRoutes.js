import express from "express"
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, registrar } from "../controllers/usuarioControllers.js"
const router = express.Router()

// autenticacion, registro y confirmacion de usuarios
router.post("/", registrar) // crea un nuevo usuario -> /api/usuarios
router.post("/login", autenticar) // loguearse -> /api/usuarios/login
router.get("/confirmar/:token", confirmar) // -> /api/usuarios/confirmar/:token
router.post("/olvide-password", olvidePassword) // se le envia al email un link -> /api/usuarios/olvide-password
// router.get("/olvide-password/:token", comprobarToken) // valida el token -> /api/usuarios/olvide-password/:token
// router.post("/olvide-password/:token", nuevoPassword) // nuevo password -> /api/usuarios/olvide-password/:token
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

export default router