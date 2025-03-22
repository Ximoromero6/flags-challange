import { toggleTheme } from "./theme.js";
import { dropdown } from "./dropdown.js";
import { fetchCountries } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Aplicación iniciada 🚀");

  //Función para cambiar el tema de la página
  toggleTheme();

  //Función para el dropdown
  dropdown();

  const container = document.querySelector(".countries-container");
  const searchInput = document.querySelector("#search-input");

  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = "Loading countries...";
  container.appendChild(loader);

  const filterItems = document.querySelectorAll(
    ".countries-filter__dropdown-item"
  );
  const filterButton = document.querySelector(
    ".countries-filter__dropdown-button label"
  );

  window.allCountries = await fetchCountries();

  const countries = window.allCountries;
  loader.remove(); // Elimina el loader cuando se obtienen los datos

  if (countries.length > 0) {
    renderCountries(countries, container);
  } else {
    container.innerHTML = "<p>Countries not found...</p>";
  }

  //Filtrar paises por búsqueda manual
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );

    if (filteredCountries.length > 0) {
      renderCountries(filteredCountries, container);
    } else {
      container.innerHTML = `<p>No countries match "${query}".</p>`;
    }
  });

  // Agregar evento a cada opción del dropdown
  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      const selectedRegion = item.dataset.continent;
      filterButton.textContent = `Filter: ${selectedRegion}`;

      const filteredCountries =
        selectedRegion === "All"
          ? countries
          : countries.filter((country) => country.region === selectedRegion);

      renderCountries(filteredCountries, container);
    });
  });

  // Manejo de parámetros en la URL
  const params = new URLSearchParams(window.location.search);
  const countryCode = params.get("code");
  if (countryCode) {
    renderCountryDetails(countryCode, countries);
  }

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".country-card");
    if (card) {
      const code = card.getAttribute("data-code");
      viewCountry(code, window.allCountries);
    }
  });

  // Manejar el botón "Atrás" del navegador
  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("code");
    if (countryCode) {
      renderCountryDetails(countryCode, countries);
    } else {
      goBack();
    }
  });

  /* end */
});

/* Function to render each country card */
const renderCountries = (countries, container) => {
  container.innerHTML = countries
    .map(
      (country) => `
      <div class="country-card element" data-code="${country.alpha3Code}">
          <img src="${country.flags.png}" alt="${country.name}'s flag">
          <div class="country-info">
              <h2>${country.name}</h2>
              <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
              <p><strong>Region:</strong> ${country.region}</p>
              ${
                country.capital
                  ? `<p><strong>Capital:</strong> ${country.capital}</p>`
                  : ""
              }
          </div>
      </div>
  `
    )
    .join("");
};

// Función para renderizar detalles del país sin hacer otra llamada a la API
const renderCountryDetails = (code, countries) => {
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    console.error("Error: La lista de países no está disponible.");
    return;
  }
  const countryDetailsContainer = document.querySelector(".country-details");
  const countriesContainer = document.querySelector(".countries-container");
  const countriesFilterContainer = document.querySelector(".countries-filter");

  const country = countries.find((c) => c.alpha3Code === code);

  if (!country) {
    countryDetailsContainer.innerHTML = "<p>Country not found.</p>";
    return;
  }

  // Obtener países fronterizos sin otra llamada a la API
  const borderCountries =
    country.borders
      ?.map((borderCode) => {
        const borderCountry = countries.find(
          (c) => c.alpha3Code === borderCode
        );
        return borderCountry
          ? `<button class="element" onclick="viewCountry('${borderCountry.alpha3Code}', window.allCountries)">${borderCountry.name}</button>`
          : "";
      })
      .join(" ") || "None";

  const nativeName =
    (country.altSpellings?.[1] || country.altSpellings?.[0]) ?? country.name;

  countryDetailsContainer.innerHTML = `
      <button onclick="goBack()" class="goBackButton element">
        <i class="fi fi-rr-arrow-left"></i>
        <label>Back</label>
      </button>
        <div class="country-details-info-container">
          <div class="country-image-container">
            <img src="${country.flags.png}" alt="${country.name} flag" />
          </div>

          <div class="country-info-container">
            <h1>${country.name}</h1>
            <div class="country-data-container">
              <div>
                <p>
                  <strong>Native Name:</strong> ${nativeName}
                </p>
                <p>
                  <strong>Population:</strong>
                  ${country.population.toLocaleString()}
                </p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Sub Region:</strong> ${
                  country.subregion || "N/A"
                }</p>
                <p><strong>Capital:</strong> ${country.capital || "N/A"}</p>
              </div>
              <div>
                <p>
                  <strong>Top Level Domain:</strong> ${country.topLevelDomain}
                </p>
                <p>
                  <strong>Currencies:</strong> ${
                    country.currencies
                      ? country.currencies.map((c) => c.name).join(", ")
                      : "N/A"
                  }
                </p>
                <p>
                  <strong>Languages:</strong> ${
                    country.languages
                      ? country.languages.map((l) => l.name).join(", ")
                      : "N/A"
                  }
                </p>
              </div>
            </div>
            <div class="border-countries-container">
              <p><strong>Border Countries:</strong></p>
              <div class="borders">
                ${borderCountries}
              </div>
            </div>
          </div>
        </div>
  `;

  countriesContainer.style.display = "none";
  countriesFilterContainer.style.display = "none";
  countryDetailsContainer.style.display = "flex";
};

// Función para ver detalles sin llamar otra vez a la API
function viewCountry(code, countries) {
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    console.error("Error: No hay países cargados.");
    return;
  }
  window.history.pushState({}, "", `?code=${code}`);
  renderCountryDetails(code, countries);
}

// Función para volver a la lista de países
function goBack() {
  window.history.pushState({}, "", window.location.pathname);
  document.querySelector(".countries-container").style.display = "grid";
  document.querySelector(".countries-filter").style.display = "flex";
  document.querySelector(".country-details").style.display = "none";
}

// Hacer funciones accesibles globalmente
window.goBack = goBack;
window.viewCountry = (code) => {
  if (
    !window.allCountries ||
    !Array.isArray(window.allCountries) ||
    window.allCountries.length === 0
  ) {
    console.error("Error: No hay datos de países disponibles.");
    return;
  }
  viewCountry(code, window.allCountries);
};

window.allCountries = []; // Variable global para almacenar países y evitar llamadas innecesarias
