// Format number as currency
function formatNumber(num) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Dropdown functionality
const button = document.getElementById("dropdownButton");
const menu = document.getElementById("dropdownMenu");
const selectedText = document.getElementById("selectedText");
const caretIcon = document.getElementById("caretIcon");
const hiddenInput = document.getElementById("metodoDepreciacion"); // Changed from dropdownValue
const options = menu.querySelectorAll("[data-value]");

// Toggle dropdown
button.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  caretIcon.classList.toggle("rotate-180");
});

// Select option
options.forEach((option) => {
  option.addEventListener("click", () => {
    selectedText.textContent = option.textContent;
    selectedText.classList.remove("text-gray-500");
    selectedText.classList.add("text-gray-700");
    hiddenInput.value = option.dataset.value;
    menu.classList.add("hidden");
    caretIcon.classList.remove("rotate-180");
  });
});

// Close when clicking outside
window.addEventListener("click", (e) => {
  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add("hidden");
    caretIcon.classList.remove("rotate-180");
  }
});

const calcularBtn = document.getElementById("calcularBtn");
const resultsContainer = document.getElementById("resultsContainer");

calcularBtn.addEventListener("click", calcular);

function calcular() {
  const metodo = hiddenInput.value;
  const precioInicial = parseFloat(
    document.getElementById("precioInicial").value
  );
  const vidaUtil = parseInt(document.getElementById("vidaUtil").value);
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
  if (isNaN(valorRescate) || valorRescate < 0) {
    alert("Por favor ingresa un valor de rescate válido");
    return;
  }
  if (valorRescate >= precioInicial) {
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
  } else if (metodo === "saldo-doble-decreciente") {
    calcularSMARC(precioInicial, vidaUtil, valorRescate);
  }
}

function calcularLineaRecta(precioInicial, vidaUtil, valorRescate) {
  // Calcular depreciación anual
  const depreciacionAnual = (precioInicial - valorRescate) / vidaUtil;

  // Create results table
  let html = `
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Depreciación Anual</h3>
        <p class="text-3xl font-bold text-blue-600">$${formatNumber(
          depreciacionAnual
        )}</p>
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
        <td class="border-r ${
          !isLastRow ? "border-b" : ""
        } border-gray-300 px-4 py-3">Año ${i}</td>
        <td class="${
          !isLastRow ? "border-b" : ""
        } border-gray-300 px-4 py-3 font-semibold">$${formatNumber(
      valorActual
    )}</td>
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
  // Calcular depreciación anual
  const depreciacionTasa = 1 - Math.pow(valorRescate / precioInicial, 1 / 5);

  // Create results table
  let html = `
    <h3 class="font-bold text-lg mb-4">Resultados - Saldo Decreciente</h3>
    <div class="space-y-4 w-full">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-2">Tasa de Depreciación</h3>
        <p class="text-3xl font-bold text-blue-600">${
          depreciacionTasa.toFixed(4) * 100
        }%</p>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-300">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="border-r border-b border-gray-300 px-4 py-3 text-left font-bold">Año</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Depreciación</th>
              <th class="border-b border-gray-300 px-4 py-3 text-left font-bold">Valor en Libros</th>
            </tr>
          </thead>
          <tbody>
  `;

  let valorActual = precioInicial;
  let depreciacion = 0;

  for (let i = 1; i <= vidaUtil; i++) {
    depreciacion = valorActual * depreciacionTasa;
    valorActual = valorActual - depreciacion;
    const isLastRow = i === vidaUtil;
    html += `
      <tr class="hover:bg-gray-50 currency">
        <td class="border-r ${
          !isLastRow ? "border-b" : ""
        } border-gray-300 px-4 py-3">Año ${i}</td>
        <td class="border-r ${
          !isLastRow ? "border-b" : ""
        } border-gray-300 px-4 py-3 font-semibold">$${formatNumber(
      depreciacion
    )}</td>
    <td class="${
      !isLastRow ? "border-b" : ""
    } border-gray-300 px-4 py-3 font-semibold">$${formatNumber(
      valorActual
    )}</td>
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
