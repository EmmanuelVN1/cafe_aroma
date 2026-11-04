import { validarNombre, validarCorreo, validarMensaje } from "./validaciones.js";

export function iniciarFormulario() {
    const formulario = document.querySelector("#formulario-contacto");

    if (!formulario) {
        return;
    }

    const resultado = document.querySelector("#resultado-formulario");
    const validadores = {
        nombre: validarNombre,
        correo: validarCorreo,
        mensaje: validarMensaje
    };
    let intentado = false;

    function mostrarError(campo, mensaje) {
        const aviso = document.querySelector(`#error-${campo.name}`);
        aviso.textContent = mensaje;
        campo.setAttribute("aria-invalid", String(mensaje !== ""));
    }

    function revisarFormulario() {
        const datos = new FormData(formulario);
        let primerError = null;

        Object.entries(validadores).forEach(([nombre, validar]) => {
            const campo = formulario.elements.namedItem(nombre);
            const error = validar(datos.get(nombre));
            mostrarError(campo, error);

            if (error && primerError === null) {
                primerError = campo;
            }
        });

        return primerError;
    }

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        intentado = true;
        resultado.textContent = "";
        const primerError = revisarFormulario();

        if (primerError) {
            resultado.textContent = "Revisa los campos señalados.";
            primerError.focus();
            return;
        }

        resultado.textContent = "Datos válidos. Esta demostración no envía el mensaje.";
    });

    formulario.addEventListener("input", () => {
        resultado.textContent = "";

        if (intentado) {
            revisarFormulario();
        }
    });
}