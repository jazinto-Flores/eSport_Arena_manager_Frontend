import { useState } from 'react';
import { api } from '../services/arena';
import { EstadoCarga } from './EstadoCarga';

const initial = {
  nombre: '', juego: '', estado: 'ABIERTO', cuposMaximos: 8,
  integrantesMinimos: 5, cierreInscripcion: '',
};
const fields = [
  ['nombre', 'Nombre', 'text'],
  ['juego', 'Juego', 'text'],
  ['cuposMaximos', 'Cupos máximos', 'number'],
  ['integrantesMinimos', 'Integrantes mínimos', 'number'],
  ['cierreInscripcion', 'Cierre de inscripción', 'date'],
];

export function AdminTorneos({ catalogo }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function mutate(action, message, reset) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      if (reset) setDraft(initial);
      setNotice(message);
      catalogo.reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    const { id, nombre, juego, estado, cuposMaximos, integrantesMinimos, cierreInscripcion, inscritos } = draft;
    if (!nombre.trim() || !juego.trim() || Number(cuposMaximos) < (inscritos ?? 0)) {
      setError('Completa el nombre y el juego y conserva cupos suficientes para los equipos inscritos.');
      return;
    }
    void mutate(() => api.guardarTorneo({
      nombre: nombre.trim(), juego: juego.trim(), estado,
      cuposMaximos: Number(cuposMaximos), integrantesMinimos: Number(integrantesMinimos),
      cierreInscripcion,
    }, id), id ? 'Torneo actualizado.' : 'Torneo creado.', true);
  }

  return (
    <section className="container my-4">
      <h2 className="text-acento">Administrar torneos</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {!catalogo.items && <EstadoCarga {...catalogo} />}
      <form className="p-4 bg-superficie rounded border border-secondary mb-4" onSubmit={submit}>
        <h3 className="h5">{draft.id ? 'Editar torneo' : 'Nuevo torneo'}</h3>
        <fieldset disabled={busy || !catalogo.items}>
          <div className="row g-3 mb-3">
            {fields.map(([name, label, type]) => (
              <label className="col-md-6" key={name}>{label}
                <input className="form-control" type={type} required value={draft[name] ?? ''}
                  min={type === 'number' ? 1 : undefined} max={type === 'number' ? 2147483647 : undefined}
                  maxLength={type === 'text' ? 255 : undefined}
                  onChange={event => setDraft({ ...draft, [name]: event.target.value })} />
              </label>
            ))}
            <label className="col-md-6">Estado
              <select className="form-select" value={draft.estado}
                onChange={event => setDraft({ ...draft, estado: event.target.value })}>
                <option value="ABIERTO">Abierto</option>
                <option value="CERRADO">Cerrado</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primario">Guardar torneo</button>
          {draft.id && <button type="button" className="btn btn-outline-light ms-2" onClick={() => setDraft(initial)}>Cancelar</button>}
        </fieldset>
      </form>
      <ul className="list-group">
        {catalogo.items?.map(torneo => (
          <li key={torneo.id} className="list-group-item bg-superficie text-light border-secondary">
            <strong>{torneo.nombre}</strong> · {torneo.estado} · {torneo.inscritos}/{torneo.cuposMaximos} inscritos
            <div className="d-flex gap-2 mt-2">
              <button type="button" className="btn btn-sm btn-outline-light" disabled={busy}
                onClick={() => { setDraft(torneo); setError(''); setNotice(''); }}>Editar</button>
              <button type="button" className="btn btn-sm btn-outline-danger" disabled={busy}
                onClick={() => {
                  if (window.confirm(`¿Eliminar el torneo «${torneo.nombre}»?`)) {
                    void mutate(() => api.eliminarTorneo(torneo.id), 'Torneo eliminado.', draft.id === torneo.id);
                  }
                }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
