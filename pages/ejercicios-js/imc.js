// Calculadora de IMC: peso en kilogramos y altura en metros.
function calcularIMC(peso, altura) {
    if (!Number.isFinite(peso) || !Number.isFinite(altura) || peso <= 0 || altura <= 0) {
        console.error("Error: el peso y la altura deben ser números mayores que 0.");
        return null;
    }

    const imc = peso / (altura * altura);

    if (!Number.isFinite(imc) || imc <= 0) {
        console.error("Error: esos valores no permiten calcular un IMC válido.");
        return null;
    }

    return imc;
}

function clasificarIMC(imc) {
    if (!Number.isFinite(imc) || imc <= 0) {
        return "Error: el IMC debe ser un número mayor que 0.";
    }

    if (imc < 18.5) {
        return "Bajo peso";
    } else if (imc < 25) {
        return "Normal";
    } else if (imc < 30) {
        return "Sobrepeso";
    } else {
        return "Obesidad";
    }
}

// Cambia estos dos valores para probar otros casos.
const peso = 70;
const altura = 1.75;
const imc = calcularIMC(peso, altura);

if (imc !== null) {
    console.log(`Peso: ${peso} kg`);
    console.log(`Altura: ${altura} m`);
    console.log(`IMC: ${imc.toFixed(2)}`);
    console.log(`Clasificación: ${clasificarIMC(imc)}`);
}
