// ------------------------ THEMES LOGIC ------------------------ //

const body = document.body;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");

// Tema por defecto: oscuro
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

lightBtn.addEventListener("click", () => {
  applyTheme("light");
  localStorage.setItem("theme", "light");
});

darkBtn.addEventListener("click", () => {
  applyTheme("dark");
  localStorage.setItem("theme", "dark");
});

function applyTheme(theme) {
  // No tocamos las otras clases del body (font, min-h-screen, etc.)
  body.classList.remove("dark", "light");
  body.classList.add(theme);
}