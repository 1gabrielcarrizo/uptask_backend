import nodemailer from 'nodemailer'

// se envia el nombre del usuario, el email y el token
export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos
    try {
        // copiamos el codigo de la pagina mailtrap
    const transport = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        service: "gmail",
        secure: true, // seguridad
        auth: {
            // crearse una cuenta en mailtrap para que te den el user y pass
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    // informacion del email
    const info = await transport.sendMail({
        from: '"ProjectMasterAdm - Administrador de Proyectos <projectmasteradm@gmail.com>"',
        to: email,
        subject: "ProjectMasterAdm - Confirma tu cuenta",
        text: "Comprueba tu cuenta en ProjectMasterAdm",
        html: `<p>Hola ${nombre}:</p>
        <p>Comprueba tu cuenta en ProjectMasterAdm.</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
        `
    })
    } catch (error) {
        console.error("No se pudo enviar el email para registrarse")
    }
}

// se envia el email para crear un nuevo password
export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos
    try {
        // copiamos el codigo de la pagina mailtrap
    const transport = nodemailer.createTransport({
        host: process.env.GMAIL_HOST,
        port: process.env.GMAIL_PORT,
        service: "gmail",
        secure: true, // seguridad
        auth: {
            // crearse una cuenta en mailtrap para que te den el user y pass
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    // informacion del email
    const info = await transport.sendMail({
        from: '"ProjectMasterAdm - Administrador de Proyectos <projectmasteradm@gmail.com>"',
        to: email,
        subject: "ProjectMasterAdm - Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `<p>Hola ${nombre}:</p>
        <p>Has solicitado reestablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
        <p>Si tu no solicitaste este email, puedes ignorar el mensaje.</p>
        `
    })
    } catch (error) {
        console.error("No se pudo enviar el email para crear una nueva contraseña")
    }
}