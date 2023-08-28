import express from "express"
const router = express.Router()

router.get('/', (req, res) => { // "/" apunta a "/api/usuarios"
    res.json({
        msg: "Desde GET - API/USUARIOS"
    })
})

router.get('/confirmar', (req, res) => { // "/" apunta a "/api/usuarios"
    res.json('Desde GET - API/USUARIOS/CONFIRMAR')
})

router.post('/', (req, res) => { // "/" apunta a "/api/usuarios"
    res.json('Desde POST - API/USUARIOS')
})

router.put('/', (req, res) => { // "/" apunta a "/api/usuarios"
    res.json('Desde PUT - API/USUARIOS')
})

router.delete('/', (req, res) => { // "/" apunta a "/api/usuarios"
    res.json('Desde DELETE - API/USUARIOS')
})

export default router