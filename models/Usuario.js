import mongoose from "mongoose";
const usuarioSchema = mongoose.Schema({
    nombre: {
        type: 'String',
        required: true,
        trim: true // elimina los espacios
    },
    password: {
        type: 'String',
        required: true,
        trim: true // elimina los espacios
    },
    email: {
        type: 'String',
        required: true,
        trim: true, // elimina los espacios
        unique: true
    },
    token: {
        type: 'String',
    },
    confirmado: {
        type: Boolean,
        default: false // cuando confirme con email, cambiara a true
    }
}, {
    timestamps: true // crea 2 conlumnas mas, "creado" y "actualizado"
})
const Usuario = mongoose.model("Usuario", usuarioSchema)
export default Usuario