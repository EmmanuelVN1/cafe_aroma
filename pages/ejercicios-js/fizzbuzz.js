function fizzBuzz(n) {
    if (!Number.isInteger(n) || n <= 0) {
        console.error("Error: n debe ser un número entero mayor que 0, sin decimales.");
        return;
    }

    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log(`FizzBuzz`);
        } else if (i % 3 === 0) {
            console.log(`Fizz`);
        } else if (i % 5 === 0) {
            console.log(`Buzz`);
        } else {
            console.log(`${i}`);
        }
    }
}

// Cambia n para probar otros valores, incluidos los casos inválidos.
const n = 15;
fizzBuzz(n);
