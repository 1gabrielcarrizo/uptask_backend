import Projecto from "../models/Proyecto.js"

// get para todos los proyecto
const obtenerProyectos = async (req, res) => {

}
// post para crear un proyecto
const nuevoProyecto = async (req, res) => {
    const proyecto = new Projecto(req.body)
    proyecto.creador = req.usuario._id // req.usuario viene del checkAuth
    try {
        const proyectoAlmacenado = await proyecto.save()
        return res.json(proyectoAlmacenado)
    } catch (error) {
        console.error(error)
    }
}
// get para un proyecto en especifico
const obtenerProyecto = async (req, res) => {
    
}
// put para editar un proyecto en especifico
const editarProyecto = async (req, res) => {
    
}
// delete para eliminar un proyecto en especifico
const eliminarProyecto = async (req, res) => {
    
}
// get para agregar un colaborador
const agregarColaborador = async (req, res) => {
    
}
// delete para eliminar un colaborador
const eliminarColaborador = async (req, res) => {
    
}
// get para todas las tareas
const obtenerTareas = async (req, res) => {
    
}

export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas
}