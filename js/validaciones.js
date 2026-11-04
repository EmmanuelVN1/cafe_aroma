export function validarNombre(valor) {
    const nombre = valor.trim();

    if (nombre.length < 2 || nombre.length > 60) {
        return "Escribe un nombre de entre 2 y 60 caracteres.";
    }

    return "";
}

export function validarCorreo(valor) {
    const correo = valor.trim();
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formato.test(correo)) {
        return "Escribe un correo válido, por ejemplo: nombre@correo.com.";
    }

    return "";
}

export function validarMensaje(valor) {
    const mensaje = valor.trim();

    if (mensaje.length < 10 || mensaje.length > 500) {
        return "Escribe un mensaje de entre 10 y 500 caracteres.";
    }

    return "";
}