import express from "express";
import { obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto, buscarColaborador, agregarColaborador, eliminarColaborador } from "../controllers/proyectoControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.route("/") // -> /api/proyectos
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth, nuevoProyecto)

router.route("/:id") // -> /api/proyectos/:id
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth, editarProyecto)
    .delete(checkAuth, eliminarProyecto)

router.post("/colaboradores", checkAuth, buscarColaborador) // -> /api/proyectos/colaboradores
router.post("/colaboradores/:id", checkAuth, agregarColaborador) // -> /api/proyectos/colaboradores/:id
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador) // -> /api/proyectos/eliminar-colaborador/:id

export default router