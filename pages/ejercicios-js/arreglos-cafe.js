const datos = [
    { id: 1, nombre: "Espresso", categoria: "bebida", precio: 45 },
    { id: 2, nombre: "Latte", categoria: "bebida", precio: 60 },
    { id: 3, nombre: "Croissant", categoria: "reposteria", precio: 40 },
    { id: 4, nombre: "Pan dulce", categoria: "reposteria", precio: 35 },
    { id: 5, nombre: "Capuchino", categoria: "bebida", precio: 55 }
];

console.log("Arreglo original antes:", datos);

const filtrados = datos.filter(({ categoria }) => categoria === "bebida");

const total = datos.reduce((acumulado, { precio }) => acumulado + precio, 0);

const promedio = datos.length > 0 ? total / datos.length : 0;

const ordenados = [...datos].sort((a, b) => a.precio - b.precio);

const primeraBebida = filtrados[0]?.nombre ?? "No hay bebidas en la lista";

console.log({ filtrados, total, promedio, ordenados });
console.log("Primera bebida:", primeraBebida);
console.log("Arreglo original despues:", datos);