import { useState } from 'react';
import { api } from '../services/arena';
import { useColeccion } from '../services/useColeccion';
import { EstadoCarga } from './EstadoCarga';

export function FormInscripcion({ torneo, onInscripcionExitosa, onEquipos }) {
  const { items, error: loadError, reload } = useColeccion(api.equipos);
  const [equipoId, setEquipoId] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const disponibles = items?.filter(equipo =>
    equipo.juego.toLowerCase() === torneo.juego.toLowerCase()
    && equipo.integrantes.length >= torneo.integrantesMinimos) ?? [];

  async function submit(event) {
    event.preventDefault();
    if (busy || !disponibles.some(equipo => equipo.id === equipoId)) return;
    setError('');
    setBusy(true);
    try {
      const inscripcion = await api.inscribir({ torneoId: torneo.id, equipoId });
      onInscripcionExitosa(inscripcion);
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }

  return (
    <section className="p-4 bg-superficie rounded border border-secondary">
      <h3 className="text-acento mb-3">Inscripción a {torneo.nombre}</h3>
      <p>{torneo.juego} · Mínimo {torneo.integrantesMinimos} integrantes</p>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {!items && <EstadoCarga error={loadError} reload={reload} />}
      {items && disponibles.length === 0 && (
        <>
          <p>Necesitas un equipo de este juego con suficientes integrantes.</p>
          <button type="button" className="btn btn-outline-light" onClick={onEquipos}>Gestionar equipos</button>
        </>
      )}
      {disponibles.length > 0 && (
        <form onSubmit={submit}>
          <label className="form-label d-block mb-3">Equipo
            <select className="form-select" required value={equipoId} disabled={busy}
              onChange={event => setEquipoId(event.target.value)}>
              <option value="">Selecciona un equipo</option>
              {disponibles.map(equipo => <option key={equipo.id} value={equipo.id}>
                {equipo.nombre} ({equipo.integrantes.length} integrantes)
              </option>)}
            </select>
          </label>
          <button type="submit" className="btn btn-primario w-100" disabled={busy || !equipoId}>
            {busy ? 'Enviando…' : 'Confirmar inscripción'}
          </button>
        </form>
      )}
    </section>
  );
}
