import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true // elimina los espacios
    },
    password: {
        type: String,
        required: true,
        trim: true // elimina los espacios
    },
    email: {
        type: String,
        required: true,
        trim: true, // elimina los espacios
        unique: true
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false // cuando confirme con email, cambiara a true
    }
}, {
    timestamps: true // crea 2 conlumnas mas, "creado" y "actualizado"
})
// se ejecuta antes de guardar en la DB
usuarioSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

// creamos la funcion "comprobarPassword"
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}


const Usuario = mongoose.model("Usuario", usuarioSchema)
export default Usuario