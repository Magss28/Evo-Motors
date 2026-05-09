
let acumuladoFullTuning = 0;

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

function ocultarTodas() {
    const secciones = ["habitual", "completo", "vista-info"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.classList.remove("seccion-activa");
        }
    });
}

function mostrarHabitual() {
    ocultarTodas();
    const el = document.getElementById("habitual");
    if (el) {
        el.style.display = "block";
        el.classList.add("seccion-activa");
    }
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

function mostrarCompleto() {
    ocultarTodas();
    const el = document.getElementById("completo");
    if (el) {
        el.style.display = "block";
        el.classList.add("seccion-activa");
    }
    document.getElementById("titulo-principal").style.display = "block";
    calcular();
}

function mostrarInfo() {
    ocultarTodas();
    const el = document.getElementById("vista-info");
    if (el) {
        el.style.display = "block";
    }
    document.getElementById("titulo-principal").style.display = "none";
}


function calcular() {
    const habitual = document.getElementById("habitual");
    const completo = document.getElementById("completo");
    

    const contenedor = habitual.classList.contains("seccion-activa") ? habitual : 
                       (completo.classList.contains("seccion-activa") ? completo : null);
    
    if (!contenedor) return;

    let totalPiezas = 0;
    const filas = contenedor.querySelectorAll("tbody tr");

    filas.forEach((fila) => {
        const input = fila.querySelector("input");
        if (!input) return;

 
        const cantidad = Math.max(0, parseInt(input.value) || 0);
        input.value = cantidad; 

        // Obtener precio de la columna 3 (Precio)
        const precioTexto = fila.cells[3].innerText;
        const precio = parseInt(precioTexto.replace(/\D/g, ""));
        
        // Calcular total por fila
        const totalFila = cantidad * precio;
        fila.cells[4].innerText = "$" + totalFila.toLocaleString();
        
        totalPiezas += totalFila;
    });

  
    const montoFinal = totalPiezas + acumuladoFullTuning;

    // Actualizar todos los SPAN con clase monto-total dentro del contenedor activo
    contenedor.querySelectorAll(".monto-total").forEach(span => {
        span.innerText = montoFinal.toLocaleString();
    });


    const tablaDesc = contenedor.querySelector(".tabla-descuento");
    if (tablaDesc) {
        const filasDesc = tablaDesc.querySelectorAll("tbody tr");
        const porcentajes = [0.05, 0.10, 0.15]; 

        filasDesc.forEach((fila, index) => {
            // Columna 0: Monto Total original
            fila.cells[0].innerText = "$" + montoFinal.toLocaleString();
      
            const resultado = montoFinal - (montoFinal * porcentajes[index]);
            fila.cells[2].innerText = "$" + Math.round(resultado).toLocaleString();
        });
    }
}

function aplicarFullTuning() {
    acumuladoFullTuning += 110000;
    calcular();
}


function reiniciar() {
    document.querySelectorAll("input").forEach(i => i.value = 0);
    acumuladoFullTuning = 0;
    calcular();
}


function copiarTotal() {
    const activo = document.querySelector(".seccion-activa");
    if (!activo) return;
    
    const totalTexto = activo.querySelector(".monto-total").innerText;
    const soloNumero = totalTexto.replace(/\./g, "");

    const input = document.createElement("input");
    input.value = soloNumero;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}

function copiarMontoEspecifico(boton, monto) {
    const soloNumero = monto.replace(/\$/g, "").replace(/\./g, "");
    
    const input = document.createElement("input");
    input.value = soloNumero;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    // Feedback visual: El botón cambia un segundo y luego vuelve a la normalidad
    const iconoOriginal = boton.innerText;
    boton.innerText = "✅"; // Cambia a un check
    boton.style.background = "#2ecc71"; // Cambia a verde
    
    setTimeout(() => {
        boton.innerText = iconoOriginal;
        boton.style.background = ""; // Vuelve al color del CSS
    }, 1000);
}

window.onload = function() {
    mostrarCompleto();
};