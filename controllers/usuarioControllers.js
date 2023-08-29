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

const confirmar = async (req, res) => {
    const {token} = req.params // escribimos "token" porque en usuarioRoutes lo definimos asi
    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar){
        const error = new Error('Token no valido')
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado = true // cambiamos el false por true
        usuarioConfirmar.token = "" // el token es de un solo uso por eso lo eliminamos
        await usuarioConfirmar.save() // guardamos en la DB
        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.error(error)    
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body
    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    try {
        // si el usuario existe...
        usuario.token = generarId()
        await usuario.save()
        return res.json({msg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.error(error)
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params
    const tokenValido = await Usuario.findOne({token})
    if(tokenValido){
        return res.json({msg: "Token valido y el usuario existe"})
    }else{
        const error = new Error('Token no valido')
        return res.status(403).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body
    const usuario = await Usuario.findOne({token})
    if(usuario){
        usuario.password = password
        usuario.token = ""
        try {
            await usuario.save()
            return res.json({msg: "Password modificado correctamente"})
        } catch (error) {
            console.error(error)
        }
    }else{
        const error = new Error('Token no valido')
        return res.status(403).json({msg: error.message})
    }
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}