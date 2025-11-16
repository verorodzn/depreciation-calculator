const button = document.getElementById("dropdownButton");
const menu = document.getElementById("dropdownMenu");
const selectedText = document.getElementById("selectedText");
const caretIcon = document.getElementById("caretIcon");
const hiddenInput = document.getElementById("dropdownValue");
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
    selectedText.classList.remove("text-gray-400");
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
