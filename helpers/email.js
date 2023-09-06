import nodemailer from 'nodemailer'

// se envia el nombre del usuario, el email y el token
export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos
    // copiamos el codigo de la pagina mailtrap
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            // crearse una cuenta en mailtrap para que te den el user y pass
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos <cuentas@uptask.com>"',
        to: email,
        subject: "UpTask - Confirma tu cuenta",
        text: "Comprueba tu cuenta en UpTask",
        html: ` <p>Hola ${nombre}: Comprueba tu cuenta en UpTask</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
        `
    })
}

// se envia el email
export const emailOlvidePassword = async (datos) => {
    const { email, nombre, token } = datos
    // copiamos el codigo de la pagina mailtrap
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            // crearse una cuenta en mailtrap para que te den el user y pass
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // informacion del email
    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos <cuentas@uptask.com>"',
        to: email,
        subject: "UpTask - Reestablece tu Password",
        text: "Reestablece tu Password",
        html: ` <p>Hola ${nombre}: Has solicitado reestablecer tu password.</p>
        <p>Sigue el siguiente enlace para generar un nuevo password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
        <p>Si tu no solicitaste este email, puedes ignorar el mensaje.</p>
        `
    })
}