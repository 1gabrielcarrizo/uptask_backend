import express from "express";
import { obtenerProyectos, nuevoProyecto, obtenerProyecto, editarProyecto, eliminarProyecto, agregarColaborador, eliminarColaborador, obtenerTareas } from "../controllers/proyectoControllers.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router()

router.route("/") // -> /api/proyectos
.get(checkAuth, obtenerProyectos)
.post(checkAuth,nuevoProyecto)

router.route("/:id") // -> /api/proyectos/:id
.get(checkAuth, obtenerProyecto)
.put(checkAuth, editarProyecto)
.delete(checkAuth, eliminarProyecto)

router.get("/tareas/:id", checkAuth, obtenerTareas) // -> /api/tareas/:id

router.post("/agregar-colaborador/:id", checkAuth, agregarColaborador) // -> /api/agregar-colaborador/:id
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador) // -> /api/eliminar-colaborador/:id



export default router