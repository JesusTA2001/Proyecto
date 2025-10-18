// Mapeo de siglas a nombres completos de carreras
export const carrerasMap = {
  ITIC: "Ingeniería en Tecnologías de la Información y Comunicación",
  ISC: "Ingeniería en Sistemas Computacionales",
  IE: "Ingeniería Electrónica",
  IIAS: "Ingeniería en Innovación Agrícola Sustentable",
  CP: "Contador Público",
  II: "Ingeniería Industrial",
  IGE: "Ingeniería en Gestión Empresarial",
  IIA: "Ingeniería en Industrias Alimentarias",
  A: "Arquitectura",
};

// Convertimos el mapa en una lista para usarla en los <select>
export const carrerasOptions = Object.entries(carrerasMap).map(([sigla, nombre]) => ({
  value: sigla,
  label: nombre,
}));

// Opciones para otros select
export const generoOptions = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
];

export const gradoEstudioOptions = [
    { value: "Licenciatura", label: "Licenciatura" },
    { value: "Maestría", label: "Maestría" },
    { value: "Doctorado", label: "Doctorado" },
];