// 1. Captura de elementos (Asegúrate que los IDs coincidan con tu HTML)
const btnAgregar = document.getElementById('btn-agregar');
const inputNombre = document.getElementById('nombre-gasto');
const inputMonto = document.getElementById('monto-gasto');
const listaGastos = document.getElementById('lista-gastos');
const totalDisplay = document.getElementById('total');

// 2. Estado de la aplicación
let gastos = JSON.parse(localStorage.getItem('misGastos')) || [];
let indiceEdicion = -1; // -1 significa que estamos agregando, no editando

// 3. Función inicial para cargar datos al abrir la página
actualizarInterfaz();

// 4. Lógica del Botón Principal (Agregar / Guardar Cambios)
btnAgregar.onclick = function() {
    const nombre = inputNombre.value.trim();
    const monto = parseFloat(inputMonto.value);
    const fechaHoy = new Date().toLocaleDateString(); // Captura la fecha actual

    if (nombre === "" || isNaN(monto)) return;

    if (indiceEdicion === -1) {
        const gastoExistente = gastos.find(g => g.nombre.toLowerCase() === nombre.toLowerCase());

        if (gastoExistente) {
            gastoExistente.monto += monto;
            gastoExistente.historial.push({ fecha: fechaHoy, monto: monto });
        } else {
            // Estructura de objeto profesional con historial
            gastos.push({ 
                nombre: nombre, 
                monto: monto, 
                historial: [{ fecha: fechaHoy, monto: monto }] 
            });
        }
    } else {
        // Al editar, reiniciamos el historial para ese nuevo valor
        gastos[indiceEdicion] = { 
            nombre: nombre, 
            monto: monto, 
            historial: [{ fecha: fechaHoy, monto: monto + " (Editado)" }] 
        };
        indiceEdicion = -1;
        btnAgregar.innerText = "Agregar Gasto";
    }

    guardarYRefrescar();
    inputNombre.value = ""; inputMonto.value = "";
};

// 5. Funciones de Soporte (Mantenimiento del sistema)
function guardarYRefrescar() {
    localStorage.setItem('misGastos', JSON.stringify(gastos));
    actualizarInterfaz();
}

function actualizarInterfaz() {
    listaGastos.innerHTML = "";
    let totalAcumulado = 0;

    gastos.forEach((gasto, index) => {
        const li = document.createElement('li');
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.padding = "10px";
        li.style.borderBottom = "1px solid #eee";

        li.innerHTML = `
            <div>
                <strong>${gasto.nombre}</strong><br>
                <small>S/ ${gasto.monto.toFixed(2)}</small>
            </div>
            <div>
                <button onclick="prepararEdicion(${index})" style="width:auto; padding:5px 10px; background:#f39c12; color:white; border:none; border-radius:3px; cursor:pointer; margin-right:5px;">Editar</button>
                <button onclick="eliminarGasto(${index})" style="width:auto; padding:5px 10px; background:#e74c3c; color:white; border:none; border-radius:3px; cursor:pointer;">X</button>
                <button onclick="verHistorial(${index})" style="width:auto; padding:5px 10px; background:#3498db; color:white;border:none; border-radius:3px; cursor:pointer;">Ver</button>
            </div>
        `;
        listaGastos.appendChild(li);
        totalAcumulado += gasto.monto;
    });

    totalDisplay.innerText = totalAcumulado.toFixed(2);
}

// 6. Funciones globales para los botones dentro de la lista
window.prepararEdicion = function(index) {
    const gasto = gastos[index];
    inputNombre.value = gasto.nombre;
    inputMonto.value = gasto.monto;
    
    indiceEdicion = index;
    btnAgregar.innerText = "Guardar Cambios";
    btnAgregar.style.backgroundColor = "#2980b9";
    inputNombre.focus();
};

window.eliminarGasto = function(index) {
    if(confirm("¿Seguro que quieres borrar este gasto?")) {
        gastos.splice(index, 1);
        guardarYRefrescar();
    }
};

window.verHistorial = function(index) {
    const gasto = gastos[index];
    const modal = document.getElementById('modal-historial');
    const listaDetalles = document.getElementById('lista-detalles');
    const titulo = document.getElementById('titulo-modal');

    titulo.innerText = `Detalles de: ${gasto.nombre}`;
    listaDetalles.innerHTML = "";

    gasto.historial.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `📅 ${item.fecha} - <strong>S/ ${item.monto}</strong>`;
        listaDetalles.appendChild(li);
    });

    modal.style.display = "block";
};

window.cerrarModal = function() {
    document.getElementById('modal-historial').style.display = "none";
};

// Cerrar si hacen clic fuera de la caja blanca
window.onclick = function(event) {
    const modal = document.getElementById('modal-historial');
    if (event.target == modal) modal.style.display = "none";
};

const Enter = (e) => {
    if (e.key === 'Enter') {
        btnAgregar.click();
    }
};

inputNombre.addEventListener('keydown', Enter);
inputMonto.addEventListener('keydown', Enter);