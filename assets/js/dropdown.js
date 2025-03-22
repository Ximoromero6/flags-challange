export function dropdown() {
  const dropdown = document.querySelector(".countries-filter__dropdown");
  const dropdownButton = document.querySelector(
    ".countries-filter__dropdown-button"
  );
  const dropdownList = document.querySelector(
    ".countries-filter__dropdown-list"
  );

  if (dropdown && dropdownButton && dropdownList) {
    // Evento para abrir/cerrar el dropdown
    dropdownButton.addEventListener("click", () => {
      dropdownList.classList.toggle("active");
    });

    // Cerrar dropdown si se hace clic fuera
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdownList.classList.remove("active");
      }
    });

    // Manejar selección de opción en el dropdown
    dropdownList.addEventListener("click", (event) => {
      if (event.target.classList.contains("countries-filter__dropdown-item")) {
        dropdownButton.querySelector("label").textContent =
          event.target.textContent;
        dropdownList.classList.remove("active");

        console.log("Filtro seleccionado:", event.target.dataset.region);
      }
    });
  }
}
