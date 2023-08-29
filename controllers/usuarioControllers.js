import Usuario from "../models/Usuario.js"

const registrar = async (req, res) => {
    try {
        const usuario = new Usuario(req.body) // crear usuario con la informacion del modelo
        const usuarioAlmacenado = await usuario.save() // almacenar en mongoDB
        res.status(201).json(usuarioAlmacenado) // retornamos el usuario almacenado
    } catch (error) {
        console.error(error)
    }
}

export {
    registrar
}