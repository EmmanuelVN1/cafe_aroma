export function iniciarMenu(alCargar) {
    const lista = document.querySelector("#lista-productos");
    const estado = document.querySelector("#estado-menu");
    const reintentar = document.querySelector("#reintentar-menu");
    const buscador = document.querySelector("#buscar-producto");

    if (!lista || !estado || !reintentar || !buscador) {
        return;
    }

    async function cargarProductos() {
        estado.textContent = "Cargando menú...";
        reintentar.hidden = true;
        buscador.disabled = true;
        lista.setAttribute("aria-busy", "true");

        try {
            const respuesta = await fetch("../data/productos.json", {
                cache: "no-store"
            });

            if (!respuesta.ok) {
                throw new Error(`Error HTTP ${respuesta.status}`);
            }

            const productos = await respuesta.json();

            if (!Array.isArray(productos)) {
                throw new Error("El JSON debe contener una lista de productos.");
            }

            const tarjetas = productos.map(crearTarjeta);
            lista.replaceChildren(...tarjetas);

            estado.textContent = productos.length === 0
                ? "Por el momento no hay productos disponibles."
                : "";

            buscador.disabled = productos.length === 0;
            alCargar();

            const destino = document.getElementById(location.hash.slice(1));

            if (destino && destino.classList.contains("producto")) {
                destino.scrollIntoView();
            }
        } catch (error) {
            lista.replaceChildren();
            estado.textContent = "No pudimos cargar el menú. Inténtalo de nuevo.";
            reintentar.hidden = false;
            console.error("Error al cargar el menú:", error);
        } finally {
            lista.setAttribute("aria-busy", "false");
        }
    }

    reintentar.addEventListener("click", cargarProductos);
    cargarProductos();
}

function crearTarjeta(producto) {
    const textos = ["id", "nombre", "descripcion", "imagen", "alt"];

    if (!producto ||
        !textos.every((campo) => typeof producto[campo] === "string") ||
        !Number.isFinite(producto.precio) || producto.precio < 0) {
        throw new Error("Hay un producto con datos incompletos o incorrectos.");
    }

    const tarjeta = document.createElement("li");
    tarjeta.className = "producto";
    tarjeta.id = producto.id;

    const imagen = document.createElement("img");
    imagen.className = "producto__imagen";
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;
    imagen.width = producto.ancho;
    imagen.height = producto.alto;
    imagen.loading = "lazy";
    imagen.decoding = "async";
    tarjeta.append(imagen);

    if (producto.recomendado === true) {
        tarjeta.classList.add("producto--recomendado");

        const etiqueta = document.createElement("span");
        etiqueta.className = "producto__etiqueta";
        etiqueta.textContent = "Recomendado";
        tarjeta.append(etiqueta);
    }

    const titulo = document.createElement("h2");
    titulo.className = "producto__titulo";
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.className = "producto__descripcion";
    descripcion.textContent = producto.descripcion;

    const precio = document.createElement("p");
    precio.className = "producto__precio";
    precio.textContent = `$${producto.precio} MXN`;

    tarjeta.append(titulo, descripcion, precio);

    return tarjeta;
}