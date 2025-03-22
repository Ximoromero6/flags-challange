export function toggleTheme() {
  const body = document.body;
  const toggleButton = document.getElementById("theme-toggle");
  const toggleButtonIcon = toggleButton.querySelector("i");
  const toggleButtonText = toggleButton.querySelector("label");

  // Aplicar el tema almacenado en localStorage
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleButtonIcon.className = "fi fi-rc-sun";
    toggleButtonText.textContent = "Light Mode";
  } else {
    toggleButtonIcon.className = "fi fi-rc-moon";
    toggleButtonText.textContent = "Dark Mode";
  }

  // Evento para cambiar de tema
  toggleButton?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    //Cambiar icono, luna o sol
    toggleButtonIcon.className = body.classList.contains("dark-mode")
      ? "fi fi-rc-sun"
      : "fi fi-rc-moon";

    //Cambiar el texto del boton
    toggleButtonText.textContent = body.classList.contains("dark-mode")
      ? "Light Mode"
      : "Dark Mode";

    localStorage.setItem(
      "theme",
      body.classList.contains("dark-mode") ? "dark" : "light"
    );
  });
}
