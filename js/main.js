// =====================
// THEME TOGGLE (claro/oscuro)
// =====================
(function themeToggle(){
  const btn = document.getElementById("themeBtn");
  const saved = localStorage.getItem("tce-theme");

  // Si hay preferencia guardada, úsala.
  if (saved === "dark") document.body.classList.add("dark");
  if (saved === "light") document.body.classList.remove("dark");

  // Si no hay guardado, respeta preferencia del sistema (opcional):
  if (!saved) {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) document.body.classList.add("dark");
  }

  if (!btn) return;

  function updateLabel(){
    btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("tce-theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateLabel();
  });

  updateLabel();
})();

(() => {
  const track = document.getElementById("menuTrack");
  const viewport = document.getElementById("menuViewport");
  const statusText = document.getElementById("statusText");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const chips = Array.from(document.querySelectorAll(".day-chip"));

  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  // Map JS day (0=Dom..6=Sáb) -> slide index (0=Lun..4=Vie)
  // Fin de semana: por defecto cae en Lunes (puedes cambiar a Viernes si quieres).
  function getDefaultIndexFromToday() {
    const d = new Date().getDay(); // 0..6
    if (d === 0 || d === 6) return 0; // Dom/Sáb -> Lunes
    return d - 1; // Lun->0 ... Vie->4
  }

  let index = getDefaultIndexFromToday();
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function clamp(i) {
    return Math.max(0, Math.min(4, i));
  }

  function updateUI() {
    // mover track
    track.style.transform = `translateX(${-index * 100}%)`;

    // status
    statusText.textContent = `${dayNames[index]} (${index + 1}/5)`;

    // chips active
    chips.forEach((c) => c.classList.toggle("is-active", Number(c.dataset.day) === index));

    // a11y
    const slides = Array.from(document.querySelectorAll(".slide"));
    slides.forEach((s, i) => {
      s.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
  }

  function goTo(i) {
    index = clamp(i);
    updateUI();
  }

  // Buttons
  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  // Chips
  chips.forEach((chip) => {
    chip.addEventListener("click", () => goTo(Number(chip.dataset.day)));
  });

  // Keyboard support
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  // Swipe (pointer events)
  viewport.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    prevTranslate = -index * viewport.clientWidth;
    track.style.transition = "none";
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    currentTranslate = prevTranslate + dx;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = "transform 280ms ease";

    const movedBy = currentTranslate - prevTranslate; // px
    const threshold = viewport.clientWidth * 0.18; // sensibilidad

    if (movedBy < -threshold) index = clamp(index + 1);
    else if (movedBy > threshold) index = clamp(index - 1);

    updateUI();
  }

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("pointerleave", endDrag);

  // Init
  updateUI();
})();
