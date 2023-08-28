
const usuarios = (req, res) => { // "/" apunta a "/api/usuarios"
    res.json({
        msg: "Desde GET - API/USUARIOS"
    })
}

const crearUsuario = (req, res) => { // "/" apunta a "/api/usuarios"
    res.json({
        msg: "Creando usuario"
    })
}

export {
    usuarios,
    crearUsuario
}