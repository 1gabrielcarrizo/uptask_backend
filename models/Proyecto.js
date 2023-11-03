import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    presupuesto: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        required: true
    },
    fechaEntrega: {
        type: Date,
        default: Date.now()
    },
    cliente: {
        type: String,
        trim: true,
        required: true
    },
    creador: { // hace referencia al modelo de Usuario
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tareas: [ // los [] indican que puede haber mas de 1 tarea
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tarea"
        }
    ],
    colaboradores: [ // los [] indican que puede haber mas de 1 colaborador
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ]
}, {
    timestamps: true // crea 2 conlumnas mas, "creado" y "actualizado"
})

const Proyecto = mongoose.model("Proyecto", proyectoSchema)
export default Proyecto