import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"
// import Tarea from "../models/Tarea.js"


// get para todos los proyecto
const obtenerProyectos = async (req, res) => {
    // muestra los proyectos creados por un usuario en especifico
    const proyectos = await Proyecto.find({
        // operador OR porque pueden ser colaboradores o creadores
        '$or': [
            {'colaboradores': {$in: req.usuario}},
            {'creador': {$in: req.usuario}}
        ]
    }).select("-tareas")
    res.json(proyectos)
}
// post para crear un proyecto
const nuevoProyecto = async (req, res) => {
    delete req.body.id
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
    // .populate('tareas') // se escribe "tareas" por el model en proyecto
    .populate({path: 'tareas', populate: {path: 'completado', select: 'nombre'}})
    .populate('colaboradores', 'nombre email') // se escribe "colaboradores" por el model en proyecto
    if(!proyecto){
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador o un colaborador..
    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some((colaborador) => colaborador._id.toString() === req.usuario._id.toString())){
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
// post para buscar un colaborador
const buscarColaborador = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    return res.json(usuario)
}
// post para agregar un colaborador
const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id)
    // si no existe el proyecto
    if(!proyecto){
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador...
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida (No eres el creador del proyecto)')
        return res.status(404).json({msg: error.message})
    }
    // 
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if(!usuario){
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    // el colaborador no es el admin del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El Creador del Proyecto no puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }
    // revisar que no este ya agregado al proyecto
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El usuario ya pertenece al proyecto')
        return res.status(404).json({msg: error.message})
    }
    // esta bien, se puede agregar
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    return res.json({msg: 'Colaborador agregado correctamente'})
}
// delete para eliminar un colaborador
const eliminarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id)
    // si no existe el proyecto
    if(!proyecto){
        const error = new Error('Proyecto no encontrado')
        return res.status(404).json({msg: error.message})
    }
    // si no es el creador...
    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida (No eres el creador del proyecto)')
        return res.status(404).json({msg: error.message})
    }
    // esta bien, se puede agregar
    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    return res.json({msg: 'Colaborador eliminado correctamente'})
}

export{
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
}