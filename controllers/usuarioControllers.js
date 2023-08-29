import Usuario from "../models/Usuario.js"

const registrar = async (req, res) => {
    // evitar registros duplicados
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({email})
    if(existeUsuario){
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({msg: error.message}) // ".message" accede al mensaje de arriba
    }
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