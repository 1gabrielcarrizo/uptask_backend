import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

// get para todos los proyecto
const obtenerProyectos = async (req, res) => {
    // muestra los proyectos creados por un usuario en especifico
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)
    res.json(proyectos)
}
// post para crear un proyecto
const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id // req.usuario viene del checkAuth
    try {
        const proyectoAlmacenado = await proyecto.save()
        return res.json(proyectoAlmacenado)
    } catch (error) {
        console.error(error)
    }
}
// get para un proyecto en especifico por su ID
const obtenerProyecto = async (req, res) => {
    const {id} = req.params
    // consultar si el proyecto existe en la DB
    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador o un colaborador..
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no tienes los permisos)")
        return res.status(401).json({msg: error.message})
    }
    
    return res.json(proyecto)
}
// put para editar un proyecto en especifico
const editarProyecto = async (req, res) => {
    const {id} = req.params
    // consultar si el proyecto existe en la DB
    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador o un colaborador..
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no tienes los permisos)")
        return res.status(401).json({msg: error.message})
    }
    // actualiza los campos por separado
    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente

    try {
        const proyectoAlmacenado = await proyecto.save()
        return res.json(proyectoAlmacenado)
    } catch (error) {
        console.error(error)
    }
}
// delete para eliminar un proyecto en especifico
const eliminarProyecto = async (req, res) => {
    const {id} = req.params
    // consultar si el proyecto existe en la DB
    const proyecto = await Proyecto.findById(id)
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador o un colaborador..
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida (no tienes los permisos)")
        return res.status(401).json({msg: error.message})
    }

    try {
        await proyecto.deleteOne() // esto elimina un proyecto de la DB
        return res.json({msg: "Proyecto eliminado"})
    } catch (error) {
        console.error(error)
    }
}
// get para agregar un colaborador
const agregarColaborador = async (req, res) => {
    
}
// delete para eliminar un colaborador
const eliminarColaborador = async (req, res) => {
    
}

export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador
}