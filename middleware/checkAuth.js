import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

const checkAuth = async (req, res, next) => {
    // en "headers" se envia el JWT
    let token
    // si existe la autorizacion y comienza con "Bearer"...
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1] // .split(' ')[1] obtiene solo el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET) // decodificamos la informacion
            req.usuario = await Usuario.findById(decoded.id).select(
                "-password -confirmado -token -createdAt -updatedAt -__v"
                ) // solo mostramos el _id, email y nombre en la respuesta
            return next()
        } catch (error) {
            // en caso de que el token ya haya expirado o no sea un token valido
            return res.status(400).json({msg: "Hubo un error"})
        }
    }
    // si no hay un token..
    if(!token){
        const error = new Error('Token no valido (no hay un token)')
        return res.status(401).json({msg: error.message})
    }
}

export default checkAuth