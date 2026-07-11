const API_URL = import.meta.env.VITE_API_URL || "https://api-frutas-ad27.onrender.com";

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (res.status === 204) return undefined;
  const body = await res.json();
  if (!res.ok) throw new ApiError(res.status, body.error || "Error desconocido");
  return body;
}

/**
 * @param {{ pagina?: number, por_pagina?: number, categoria?: string, temporada?: string, color?: string }} filtros
 */
function listar(filtros) {
  const params = new URLSearchParams();
  if (filtros?.pagina) params.set("pagina", String(filtros.pagina));
  if (filtros?.por_pagina) params.set("por_pagina", String(filtros.por_pagina));
  if (filtros?.categoria) params.set("categoria", filtros.categoria);
  if (filtros?.temporada) params.set("temporada", filtros.temporada);
  if (filtros?.color) params.set("color", filtros.color);
  const qs = params.toString();
  return request(`/frutas${qs ? `?${qs}` : ""}`);
}

function obtener(id) {
  return request(`/frutas/${id}`);
}

function crear(data) {
  return request("/frutas", { method: "POST", body: JSON.stringify(data) });
}

function actualizar(id, data) {
  return request(`/frutas/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

function eliminar(id) {
  return request(`/frutas/${id}`, { method: "DELETE" });
}

export const api = {
  frutas: { listar, obtener, crear, actualizar, eliminar },
};
