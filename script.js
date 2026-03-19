// 1. Capturamos los elementos del HTML
const btnAgregar = document.getElementById('btn-agregar');
const inputNombre = document.getElementById('nombre-gasto');
const inputMonto = document.getElementById('monto-gasto');
const listaGastos = document.getElementById('lista-gastos');
const totalDisplay = document.getElementById('total');

let totalAcumulado = 0;

// 2. Función que se ejecuta al hacer click
btnAgregar.onclick = function() {
    const nombre = inputNombre.value;
    const monto = parseFloat(inputMonto.value);

    // Validación simple
    if (nombre === "" || isNaN(monto)) {
        alert("Por favor, llena ambos campos correctamente");
        return;
    }

    // 3. Crear el nuevo elemento en la lista
    const nuevoGasto = document.createElement('li');
    nuevoGasto.innerHTML = `${nombre} <span>S/ ${monto.toFixed(2)}</span>`;
    listaGastos.appendChild(nuevoGasto);

    // 4. Actualizar el total
    totalAcumulado += monto;
    totalDisplay.innerText = totalAcumulado.toFixed(2);

    // 5. Limpiar los cuadritos para el siguiente gasto
    inputNombre.value = "";
    inputMonto.value = "";
};