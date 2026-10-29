// Menú de navegación en pantallas pequeñas.
const encabezado = document.querySelector(".encabezado");
const botonMenu = document.querySelector("#boton-menu");
const navegacion = document.querySelector("#navegacion-principal");

if (encabezado && botonMenu && navegacion) {
    encabezado.classList.add("encabezado--interactivo");
    const textoMenu = botonMenu.querySelector("span:last-child");

    botonMenu.addEventListener("click", () => {
        const abierto = navegacion.classList.toggle("encabezado__nav--abierta");
        botonMenu.setAttribute("aria-expanded", String(abierto));
        textoMenu.textContent = abierto ? "Cerrar" : "Menú";
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" &&
            window.matchMedia("(max-width: 800px)").matches &&
            navegacion.classList.contains("encabezado__nav--abierta")) {
            botonMenu.click();
            botonMenu.focus();
        }
    });
}

// Modo claro y oscuro.
const botonTema = document.querySelector("#boton-tema");

if (botonTema) {
    let temaGuardado = null;

    try {
        temaGuardado = localStorage.getItem("cafe-aroma-tema");
    } catch {
        // Si el almacenamiento está bloqueado, se usa el tema del sistema.
    }

    const oscuroInicial = temaGuardado === "oscuro" ||
        (temaGuardado !== "claro" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.body.classList.toggle("modo-oscuro", oscuroInicial);

    function actualizarBotonTema() {
        const oscuro = document.body.classList.contains("modo-oscuro");
        botonTema.textContent = oscuro ? "Modo claro" : "Modo oscuro";
    }

    actualizarBotonTema();
    botonTema.hidden = false;

    botonTema.addEventListener("click", () => {
        const oscuro = document.body.classList.toggle("modo-oscuro");
        actualizarBotonTema();

        try {
            localStorage.setItem("cafe-aroma-tema", oscuro ? "oscuro" : "claro");
        } catch {
            // El botón sigue funcionando aunque no se pueda guardar la elección.
        }
    });
}

// Buscador de productos por nombre.
const buscador = document.querySelector("#buscar-producto");
const resultadoBusqueda = document.querySelector("#resultado-busqueda");

if (buscador && resultadoBusqueda) {
    const productos = document.querySelectorAll(".carta__productos .producto");

    function filtrarProductos() {
        const busqueda = buscador.value.trim().toLowerCase();
        let visibles = 0;

        productos.forEach((producto) => {
            const nombre = producto.querySelector(".producto__titulo")
                .textContent.toLowerCase();
            const coincide = nombre.includes(busqueda);
            producto.hidden = !coincide;

            if (coincide) {
                visibles += 1;
            }
        });

        resultadoBusqueda.textContent = visibles === 0
            ? "No encontramos productos con ese nombre."
            : `Productos encontrados: ${visibles} de ${productos.length}.`;
    }

    buscador.addEventListener("input", filtrarProductos);
    filtrarProductos();

    // Los accesos laterales vuelven a mostrar la carta antes de ir al producto.
    document.querySelectorAll(".opciones__enlace").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            buscador.value = "";
            filtrarProductos();
        });
    });
}