const lista = document.querySelector("#lista-fotos");
const estado = document.querySelector("#estado-galeria");
const reintentar = document.querySelector("#reintentar-galeria");
const formulario = document.querySelector("#formulario-foto");
const guardar = document.querySelector("#guardar-foto");
const resultado = document.querySelector("#resultado-foto");

async function pedirGaleria(opciones = {}) {
    let respuesta;
    let datos;

    try {
        respuesta = await fetch("../api/galeria.php", {
            cache: "no-store",
            ...opciones
        });
        datos = await respuesta.json();
    } catch {
        throw new Error("La galería no está disponible. Vuelve a intentarlo.");
    }

    if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo completar la solicitud.");
    }

    return datos;
}

function crearFigura(foto) {
    const figura = document.createElement("figure");
    figura.className = "galeria__item";
    figura.dataset.id = foto.id;

    const imagen = document.createElement("img");
    imagen.src = "../assets/img/" + encodeURIComponent(foto.imagen);
    imagen.alt = foto.descripcion;
    imagen.loading = "lazy";
    imagen.decoding = "async";

    const titulo = document.createElement("figcaption");
    titulo.textContent = foto.titulo + " · " + foto.categoria;

    figura.append(imagen, titulo);
    return figura;
}

async function cargarGaleria() {
    estado.textContent = "Cargando fotos…";
    guardar.disabled = true;
    reintentar.hidden = true;

    try {
        const fotos = await pedirGaleria();

        if (!Array.isArray(fotos)) {
            throw new Error("No se pudo leer la lista de fotos.");
        }

        lista.replaceChildren(...fotos.map(crearFigura));
        estado.textContent = fotos.length ? "" : "Todavía no hay fotos.";
        guardar.disabled = false;
    } catch (error) {
        estado.textContent = error.message;
        reintentar.hidden = false;
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (guardar.disabled) return;

    const datos = Object.fromEntries(new FormData(formulario));
    guardar.disabled = true;
    resultado.textContent = "Guardando foto…";

    let creada;

    try {
        creada = await pedirGaleria({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
    } catch (error) {
        resultado.textContent = error.message;
        guardar.disabled = false;
        return;
    }

    formulario.reset();
    resultado.textContent = "Se guardó la foto: " + creada.titulo + ".";
    await cargarGaleria();
});

reintentar.addEventListener("click", cargarGaleria);
cargarGaleria();