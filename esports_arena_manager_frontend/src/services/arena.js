const base = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const storageKey = 'arena_sesion';
const listeners = new Set();
const mensajesInscripcion = new Set([
  'Torneo inexistente',
  'Equipo inexistente',
  'Inscripciones cerradas o sin cupos',
  'Juego o cantidad de integrantes incorrecta',
  'Jugador sancionado',
  'Inscripción duplicada',
]);

function restore() {
  try {
    const value = JSON.parse(sessionStorage.getItem(storageKey));
    return value?.token && value?.refreshToken && value?.email ? value : null;
  } catch {
    return null;
  }
}

let session = restore();
let generation = 0;
let pendingRefresh;

function save(value) {
  session = value;
  try {
    if (value) sessionStorage.setItem(storageKey, JSON.stringify(value));
    else sessionStorage.removeItem(storageKey);
  } catch {
    // La sesión sigue disponible en memoria.
  }
  listeners.forEach(listener => listener());
}

export const getSession = () => session;
export function subscribeSession(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function logout() {
  generation++;
  save(null);
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${base}/api${path}`, {
      method, headers, signal, body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa Spring Boot y la configuración de CORS.');
  }

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    if (response.ok) throw new Error('La API devolvió una respuesta inesperada.');
  }

  if (!response.ok) {
    const fallback = {
      400: 'Revisa los datos enviados.',
      401: 'La sesión no es válida.',
      403: 'No tienes permiso para realizar esta acción.',
      404: 'El recurso ya no está disponible.',
      409: 'La operación entra en conflicto con los datos existentes.',
    };
    // Spring Boot devuelve 500 para algunas validaciones de inscripción.
    const knownEnrollmentError = path === '/inscripciones' && method === 'POST'
      && mensajesInscripcion.has(data?.message);
    throw new ApiError(response.status,
      data?.mensaje || (response.status < 500 || knownEnrollmentError ? data?.message : undefined)
      || fallback[response.status] || 'El servidor no pudo completar la operación.');
  }
  return data;
}

function refresh(previous) {
  if (pendingRefresh?.previous === previous) return pendingRefresh.promise;
  const flight = { previous };
  flight.promise = request('/auth/refresh', {
    method: 'POST', body: { refreshToken: previous.refreshToken },
  }).then(next => {
    if (session !== previous) throw new Error('La sesión cambió.');
    save(next);
    return next;
  }).catch(error => {
    if (session === previous && [400, 401, 403].includes(error.status)) logout();
    throw error;
  }).finally(() => {
    if (pendingRefresh === flight) pendingRefresh = null;
  });
  pendingRefresh = flight;
  return flight.promise;
}

async function authenticated(path, options) {
  const previous = session;
  const loginGeneration = generation;
  if (!previous) throw new Error('Debes iniciar sesión.');
  try {
    return await request(path, { ...options, token: previous.token });
  } catch (error) {
    if (error.status !== 401) throw error;
    if (!session || generation !== loginGeneration) throw error;
    const next = session === previous ? await refresh(previous) : session;
    if (session !== next) throw new Error('La sesión cambió.');
    try {
      return await request(path, { ...options, token: next.token });
    } catch (retryError) {
      if (session === next && retryError.status === 401) logout();
      throw retryError;
    }
  }
}

const item = (collection, id) => `/${collection}/${encodeURIComponent(id)}`;
function saveItem(collection, body, id) {
  return authenticated(id == null ? `/${collection}` : item(collection, id), {
    method: id == null ? 'POST' : 'PUT', body,
  });
}

export const api = {
  async login(body, signal) {
    const value = await request('/auth/login', { method: 'POST', body, signal });
    signal?.throwIfAborted();
    generation++;
    save(value);
    return value;
  },
  registro: (body, signal) => request('/auth/registro', { method: 'POST', body, signal }),

  jugador: apodo => authenticated(item('jugadores', apodo)),
  torneos: () => request('/torneos'),
  guardarTorneo: (body, id) => saveItem('torneos', body, id),
  eliminarTorneo: id => authenticated(item('torneos', id), { method: 'DELETE' }),
  equipos: () => authenticated('/equipos'),
  guardarEquipo: (body, id) => saveItem('equipos', body, id),
  eliminarEquipo: id => authenticated(item('equipos', id), { method: 'DELETE' }),
  inscripciones: () => authenticated('/inscripciones'),
  inscribir: body => authenticated('/inscripciones', { method: 'POST', body }),
};
