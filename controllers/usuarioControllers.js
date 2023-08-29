import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
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
        usuario.token = generarId() // agregamos la propieda "token" y generamos uno
        const usuarioAlmacenado = await usuario.save() // almacenar en mongoDB
        res.status(201).json(usuarioAlmacenado) // retornamos el usuario almacenado
    } catch (error) {
        console.error(error)
    }
}

const autenticar = async (req, res) => {
    const {email, password} = req.body

    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    // comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({msg: error.message})
    }

    // comprobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('El password es incorrecto (email o password incorrectos)')
        return res.status(403).json({msg: error.message})
    }
}

export {
    registrar,
    autenticar
}