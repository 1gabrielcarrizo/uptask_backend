import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

// post para crear una tarea
const agregarTarea = async (req, res) => {
    const { proyecto } = req.body
    const existeProyecto = await Proyecto.findById(proyecto)
    // verificamos que el proyecto exista en la DB
    if (!existeProyecto) {
        const error = new Error("El proyecto no existe")
        return res.status(404).json({ msg: error.message })
    }
    // comprobar si la persona que da de alta el proyecto es quien la creo
    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para añadir tareas")
        return res.status(403).json({ msg: error.message })
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body) // guardamos en la DB
        // almacenar el ID de la tarea en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        return res.json(tareaAlmacenada)
    } catch (error) {
        console.error(error)
    }
}
// get para obtener una tarea por su ID
const obtenerTarea = async (req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    // si no existe la tarea..
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }
    // si no es el creador o un colaborador..
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no eres el creador o un colaborador)")
        return res.status(403).json({ msg: error.message })
    }
    return res.json(tarea)
}
// put para editar una tarea por su ID
const actualizarTarea = async (req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    // si no existe la tarea..
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }
    // si no es el creador o un colaborador..
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no eres el creador o un colaborador)")
        return res.status(403).json({ msg: error.message })
    }
    // actualiza los campos por separado
    tarea.nombre = req.body.nombre || tarea.nombre
    tarea.descripcion = req.body.descripcion || tarea.descripcion
    tarea.recurso = req.body.recurso || tarea.recurso
    tarea.prioridad = req.body.prioridad || tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

    try {
        const tareaAlmacenada = await tarea.save() // guardamos la tarea en la DB
        return res.json(tareaAlmacenada)
    } catch (error) {
        console.error(error)
    }
}
// delete para eliminar una tarea por su ID
const eliminarTarea = async (req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    // si no existe la tarea..
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }
    // si no es el creador o un colaborador..
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no eres el creador o un colaborador)")
        return res.status(403).json({ msg: error.message })
    }

    try {
        // buscamos la tarea relacionada con el proyecto y la eliminamos del DB
        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        return res.json({msg: "La tarea se eliminó correctamente"})
    } catch (error) {
        // return res.status(400).json({msg: "Hubo un error"})
        console.log(error)
    }
}
// post cambiamos el estado de una tarea por su ID
const cambiarEstado = async (req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findById(id).populate("proyecto")
    // si no existe la tarea..
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(404).json({ msg: error.message })
    }
    // si no es el creador o un colaborador..
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some((colaborador) => colaborador._id.toString() === req.usuario._id.toString())){
        const error = new Error("Accion no valida (no eres el creador o un colaborador)")
        return res.status(403).json({ msg: error.message })
    }
    tarea.estado = !tarea.estado
    tarea.completado = req.usuario._id // se asigna el ID del usuario conectado sobre quien completo la tarea
    await tarea.save()
    const tareaAlmacenada = await Tarea.findById(id)
    .populate('proyecto')
    .populate('completado')
    return res.json(tareaAlmacenada)
}

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}