/* =========================
   Tema (Light/Dark)
   ========================= */
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    setTheme(saved);
    return;
  }
  // Preferencia del sistema si no hay guardado
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
})();

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

/* =========================
   Modal de imágenes
   ========================= */
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const modalClose = document.getElementById("modalClose");

function openModal({ name, price, desc, img }) {
  modalName.textContent = name || "";
  modalPrice.textContent = price ? `$${price}` : "";
  modalDesc.textContent = desc || "";
  modalImg.src = img || "";
  modalImg.alt = name ? `Foto de ${name}` : "Foto del platillo";

  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalImg.src = "";
}

document.querySelectorAll(".menu-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal({
      name: btn.dataset.name,
      price: btn.dataset.price,
      desc: btn.dataset.desc,
      img: btn.dataset.img
    });
  });
});

// Cerrar con botón
modalClose.addEventListener("click", closeModal);

// Cerrar tocando fuera del panel (en el fondo)
modal.addEventListener("click", (e) => {
  const panel = modal.querySelector(".modal__panel");
  if (!panel.contains(e.target)) closeModal();
});

// Cerrar con ESC (muy útil en desktop)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

/* =========================
   Año en footer
   ========================= */
document.getElementById("year").textContent = new Date().getFullYear();
