// Format number as currency
function formatNumber(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Dropdown de Método de Depreciación
const button = document.getElementById("dropdownButton");
const menu = document.getElementById("dropdownMenu");
const selectedText = document.getElementById("selectedText");
const caretIcon = document.getElementById("caretIcon");
const hiddenInput = document.getElementById("metodoDepreciacion");
const options = menu.querySelectorAll("[data-value]");

// Toggle dropdown método
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  caretIcon.classList.toggle("rotate-180");
});

// Select option método
options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedText.textContent = option.textContent;
    selectedText.classList.remove("text-gray-500");
    selectedText.classList.add("text-gray-700");
    hiddenInput.value = option.dataset.value;
    menu.classList.add("hidden");
    caretIcon.classList.remove("rotate-180");
    
    // Manejar cambio de UI según método
    handleMetodoChange(option.dataset.value);
  });
});

// Close when clicking outside método dropdown
window.addEventListener("click", (e) => {
  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
    caretIcon.classList.remove("rotate-180");
  }
});

// Función para inicializar dropdown de vida útil
function initVidaUtilDropdown() {
  const buttonVidaUtil = document.getElementById("dropdownButtonVidaUtil");
  const menuVidaUtil = document.getElementById("dropdownMenuVidaUtil");
  const selectedTextVidaUtil = document.getElementById("selectedTextVidaUtil");
  const caretIconVidaUtil = document.getElementById("caretIconVidaUtil");
  const hiddenInputVidaUtil = document.getElementById("vidaUtilDropdownValue");
  const optionsVidaUtil = menuVidaUtil.querySelectorAll("[data-value]");

  // Toggle dropdown vida útil
  buttonVidaUtil.addEventListener("click", (e) => {
    e.stopPropagation();
    menuVidaUtil.classList.toggle("hidden");
    caretIconVidaUtil.classList.toggle("rotate-180");
  });

  // Select option vida útil
  optionsVidaUtil.forEach((option) => {
    option.addEventListener("click", () => {
      selectedTextVidaUtil.textContent = option.textContent;
      selectedTextVidaUtil.classList.remove("text-gray-500");
      selectedTextVidaUtil.classList.add("text-gray-700");
      hiddenInputVidaUtil.value = option.dataset.value;
      menuVidaUtil.classList.add("hidden");
      caretIconVidaUtil.classList.remove("rotate-180");
    });
  });

  // Close when clicking outside vida útil dropdown
  document.addEventListener("click", (e) => {
    if (!buttonVidaUtil.contains(e.target) && !menuVidaUtil.contains(e.target)) {
      menuVidaUtil.classList.add("hidden");
      caretIconVidaUtil.classList.remove("rotate-180");
    }
  });
}

// Función para manejar cambio de método
function handleMetodoChange(metodo) {
  const vidaUtilInputContainer = document.getElementById("vidaUtilInputContainer");
  const vidaUtilDropdownContainer = document.getElementById("vidaUtilDropdownContainer");
  const valorRescateInput = document.getElementById("valorRescate");
  
  if (metodo === "smarc") {
    // Ocultar input normal y mostrar dropdown
    vidaUtilInputContainer.classList.add("hidden");
    vidaUtilDropdownContainer.classList.remove("hidden");
    
    // Inicializar dropdown de vida útil si no se ha hecho
    initVidaUtilDropdown();
    
    // Deshabilitar valor de rescate
    valorRescateInput.disabled = true;
    valorRescateInput.classList.add("bg-gray-200", "cursor-not-allowed");
    valorRescateInput.value = "0";
  } else {
    // Mostrar input normal y ocultar dropdown
    vidaUtilInputContainer.classList.remove("hidden");
    vidaUtilDropdownContainer.classList.add("hidden");
    
    // Habilitar valor de rescate
    valorRescateInput.disabled = false;
    valorRescateInput.classList.remove("bg-gray-200", "cursor-not-allowed");
  }
}

const calcularBtn = document.getElementById("calcularBtn");
const resultsContainer = document.getElementById("resultsContainer");

calcularBtn.addEventListener("click", calcular);

function calcular() {
  const metodo = hiddenInput.value;
  const precioInicial = parseFloat(
    document.getElementById("precioInicial").value
  );
  
  // Obtener vida útil según el método
  let vidaUtil;
  if (metodo === "smarc") {
    const hiddenInputVidaUtil = document.getElementById("vidaUtilDropdownValue");
    vidaUtil = parseInt(hiddenInputVidaUtil.value);
  } else {
    vidaUtil = parseInt(document.getElementById("vidaUtilManual").value);
  }
  
  const valorRescate = parseFloat(
    document.getElementById("valorRescate").value
  );

  // Validations
  if (!metodo) {
    alert("Por favor selecciona un método de depreciación");
    return;
  }
  if (!precioInicial || precioInicial <= 0) {
    alert("Por favor ingresa un precio inicial válido");
    return;
  }
  if (!vidaUtil || vidaUtil <= 0) {
    alert("Por favor ingresa una vida útil válida");
    return;
  }
  if (metodo !== "smarc" && (isNaN(valorRescate) || valorRescate < 0)) {
    alert("Por favor ingresa un valor de rescate válido");
    return;
  }
  if (metodo !== "smarc" && valorRescate >= precioInicial) {
    alert("El valor de rescate debe ser menor al precio inicial");
    return;
  }

  // Calculation based on method
  if (metodo === "linea-recta") {
    calcularLineaRecta(precioInicial, vidaUtil, valorRescate);
  } else if (metodo === "saldo-decreciente") {
    calcularSaldoDecreciente(precioInicial, vidaUtil, valorRescate);
  } else if (metodo === "saldo-doble-decreciente") {
    calcularSaldoDobleDecreciente(precioInicial, vidaUtil, valorRescate);
  } else if (metodo === "smarc") {
    calcularSMARC(precioInicial, vidaUtil);
  }
}

function calcularLineaRecta(precioInicial, vidaUtil, valorRescate) {
  const depreciacionAnual = (precioInicial - valorRescate) / vidaUtil;

  let html = `
    <h3 class="font-bold text-lg mb-4 text-left w-full">Resultados - Línea Recta</h3>
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Depreciación Anual</h3>
        <p class="text-3xl font-bold text-blue-600">$${formatNumber(depreciacionAnual)}</p>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Año</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Valor en Libros</th>
            </tr>
          </thead>
          <tbody>
  `;

  let valorActual = precioInicial;

  for (let i = 1; i <= vidaUtil; i++) {
    valorActual = precioInicial - depreciacionAnual * i;
    const isLastRow = i === vidaUtil;
    html += `
      <tr class="hover:bg-gray-50">
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3">Año ${i}</td>
        <td class="${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(valorActual)}</td>
      </tr>
    `;
  }

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = html;
}

function calcularSaldoDecreciente(precioInicial, vidaUtil, valorRescate) {
  const depreciacionTasa = 1 - Math.pow(valorRescate / precioInicial, 1 / vidaUtil);

  let html = `
    <h3 class="font-bold text-lg mb-4 text-left w-full">Resultados - Saldo Decreciente</h3>
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Tasa de Depreciación</h3>
        <p class="text-3xl font-bold text-blue-600">${(depreciacionTasa * 100).toFixed(2)}%</p>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Año</th>
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Depreciación</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Valor en Libros</th>
            </tr>
          </thead>
          <tbody>
  `;

  let valorActual = precioInicial;
  let depreciacion = 0;

  for (let i = 1; i <= vidaUtil; i++) {
    if (i === vidaUtil) {
      depreciacion = valorActual - valorRescate;
      valorActual = valorRescate;
    } else {
      depreciacion = valorActual * depreciacionTasa;
      valorActual = valorActual - depreciacion;
    }
    
    const isLastRow = i === vidaUtil;
    html += `
      <tr class="hover:bg-gray-50">
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3">Año ${i}</td>
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(depreciacion)}</td>
        <td class="${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(valorActual)}</td>
      </tr>
    `;
  }

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = html;
}

function calcularSaldoDobleDecreciente(precioInicial, vidaUtil, valorRescate) {
  const depreciacionTasa = 2 / vidaUtil;

  let html = `
    <h3 class="font-bold text-lg mb-4 text-left w-full">Resultados - Saldo Doble Decreciente</h3>
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Tasa de Depreciación</h3>
        <p class="text-3xl font-bold text-blue-600">${(depreciacionTasa * 100).toFixed(2)}%</p>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Año</th>
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Depreciación</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Valor en Libros</th>
            </tr>
          </thead>
          <tbody>
  `;

  let valorActual = precioInicial;
  let depreciacion = 0;

  for (let i = 1; i <= vidaUtil; i++) {
    if (i === vidaUtil) {
      depreciacion = valorActual - valorRescate;
      valorActual = valorRescate;
    } else {
      depreciacion = valorActual * depreciacionTasa;
      valorActual = valorActual - depreciacion;
    }

    const isLastRow = i === vidaUtil;
    html += `
      <tr class="hover:bg-gray-50">
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3">Año ${i}</td>
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(depreciacion)}</td>
        <td class="${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(valorActual)}</td>
      </tr>
    `;
  }

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = html;
}

function calcularSMARC(precioInicial, vidaUtil) {
  // Tabla SMARC completa con todas las tasas
  const tablaSMARC = {
    3: [33.33, 44.45, 14.81, 7.41],
    5: [20.00, 32.00, 19.20, 11.52, 11.52, 5.76],
    7: [14.29, 24.49, 17.49, 12.49, 8.93, 8.92, 8.93, 4.46],
    10: [10.00, 18.00, 14.40, 11.52, 9.22, 7.37, 6.55, 6.55, 6.56, 6.55, 3.28],
    15: [5.00, 9.50, 8.55, 7.70, 6.93, 6.23, 5.90, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 5.90, 5.91, 2.95],
    20: [3.75, 7.22, 6.68, 6.18, 5.71, 5.29, 4.89, 4.52, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 4.46, 2.23]
  };

  const tasas = tablaSMARC[vidaUtil];

  let html = `
    <h3 class="font-bold text-lg mb-4 text-left w-full">Resultados - SMARC</h3>
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Vida Útil</h3>
        <p class="text-3xl font-bold text-blue-600">${vidaUtil} años</p>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Año</th>
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Tasa (%)</th>
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Depreciación</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Valor en Libros</th>
            </tr>
          </thead>
          <tbody>
  `;

  let valorActual = precioInicial;

  for (let i = 0; i < tasas.length; i++) {
    const tasa = tasas[i];
    const depreciacion = (precioInicial * tasa) / 100;
    valorActual = valorActual - depreciacion;
    
    const isLastRow = i === tasas.length - 1;
    html += `
      <tr class="hover:bg-gray-50">
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3">Año ${i + 1}</td>
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3">${tasa.toFixed(2)}%</td>
        <td class="border-r ${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(depreciacion)}</td>
        <td class="${!isLastRow ? "border-b" : ""} border-gray-300 px-4 py-3 font-semibold">$${formatNumber(valorActual)}</td>
      </tr>
    `;
  }

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  resultsContainer.innerHTML = html;
}