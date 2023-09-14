import express from "express";
import { agregarTarea, obtenerTarea, actualizarTarea, eliminarTarea, cambiarEstado } from "../controllers/tareaControllers.js";
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router()

router.post("/", checkAuth, agregarTarea) // -> /api/tareas

router.route("/:id") // -> /api/tareas/:id
    .get(checkAuth, obtenerTarea)
    .put(checkAuth, actualizarTarea)
    .delete(checkAuth, eliminarTarea)

router.post("/estado/:id", checkAuth, cambiarEstado) // -> /api/tareas/estado/:id

export default router