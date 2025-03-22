export const fetchCountries = async () => {
  try {
    const response = await fetch("assets/data/data.json");
    if (!response.ok) throw new Error("Error al cargar los datos");
    return await response.json();
  } catch (error) {
    console.error("Error al obtener los países:", error);
    return [];
  }
};
