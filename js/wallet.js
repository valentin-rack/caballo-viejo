const amountSpan = document.getElementById("walletAmount");
const walletDisplay = document.getElementById("walletDisplay");
const walletInput = document.getElementById("walletInput");
const walletEditBtn = document.getElementById("walletEditBtn");

// cargar valor almacenado
let amount = Number(localStorage.getItem("walletUSD")) || 0;
amountSpan.textContent = amount;

// activar edición
walletEditBtn.addEventListener("click", () => {
  walletDisplay.classList.add("hidden");
  walletInput.classList.remove("hidden");
  walletInput.value = amount; // mostrar el valor actual
  walletInput.focus();
});

// cuando el usuario presiona Enter o sale del campo, guardar
walletInput.addEventListener("blur", saveWallet);
walletInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveWallet();
});

function saveWallet() {
  const value = Number(walletInput.value);
  if (!isNaN(value)) {
    amount = value;
    amountSpan.textContent = amount;
    localStorage.setItem("walletUSD", amount);
  }

  walletInput.classList.add("hidden");
  walletDisplay.classList.remove("hidden");
}