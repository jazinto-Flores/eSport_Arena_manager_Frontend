import { useState } from 'react';
import { api } from '../services/arena';
import { useColeccion } from '../services/useColeccion';
import { EstadoCarga } from './EstadoCarga';

const initial = { nombre: '', juego: '', integrantes: [] };

export function GestionEquipos({ admin }) {
  const { items, error: loadError, reload } = useColeccion(api.equipos);
  const [draft, setDraft] = useState(initial);
  const [apodo, setApodo] = useState('');
  const [rol, setRol] = useState('Titular');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  function edit(equipo) {
    setDraft(equipo);
    setApodo('');
    setRol('Titular');
    setError('');
    setNotice('');
  }

  function addMember() {
    const name = apodo.trim();
    if (!name) return;
    if (draft.integrantes.some(item => item.apodo.toLowerCase() === name.toLowerCase())) {
      setError('Ese integrante ya está agregado.');
      return;
    }
    setDraft({ ...draft, integrantes: [...draft.integrantes, { apodo: name, rol }] });
    setApodo('');
    setError('');
  }

  async function mutate(action, message, reset) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      if (reset) edit(initial);
      setNotice(message);
      reload();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  function save(event) {
    event.preventDefault();
    const nombre = draft.nombre.trim();
    const juego = draft.juego.trim();
    if (!nombre || !juego || !draft.integrantes.length || apodo.trim()) {
      setError('Completa el nombre y el juego. Agrega a la lista todos los integrantes antes de guardar.');
      return;
    }
    void mutate(() => api.guardarEquipo({ nombre, juego, integrantes: draft.integrantes }, draft.id),
      draft.id ? 'Equipo actualizado.' : 'Equipo creado.', true);
  }

  return (
    <section className="container my-4">
      <h2 className="text-acento">Gestión de equipos</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {!items && <EstadoCarga error={loadError} reload={reload} />}
      <form className="p-4 bg-superficie rounded border border-secondary mb-4" onSubmit={save}>
        <h3 className="h5">{draft.id ? 'Editar equipo' : 'Nuevo equipo'}</h3>
        <fieldset disabled={busy || !items}>
          <label className="form-label d-block">Nombre
            <input className="form-control" required maxLength={255} value={draft.nombre}
              onChange={event => setDraft({ ...draft, nombre: event.target.value })} />
          </label>
          <label className="form-label d-block">Juego
            <input className="form-control" list="arena-juegos" required maxLength={255} value={draft.juego}
              onChange={event => setDraft({ ...draft, juego: event.target.value })} />
          </label>
          <datalist id="arena-juegos">
            {['League of Legends', 'Valorant', 'Rocket League'].map(game => <option key={game} value={game} />)}
          </datalist>
          <div className="row g-2 align-items-end my-2">
            <label className="col-md">Apodo del integrante
              <input className="form-control" value={apodo} maxLength={255}
                onChange={event => setApodo(event.target.value)}
                onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addMember(); } }} />
            </label>
            <label className="col-md">Rol del integrante
              <select className="form-select" value={rol} onChange={event => setRol(event.target.value)}>
                {['Capitán', 'Titular', 'Suplente'].map(role => <option key={role}>{role}</option>)}
              </select>
            </label>
            <div className="col-md-auto">
              <button type="button" className="btn btn-outline-light" onClick={addMember}>Agregar integrante</button>
            </div>
          </div>
          <ul className="list-group mb-3">
            {draft.integrantes.map(member => (
              <li key={member.apodo} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center gap-2">
                <span>{member.apodo}{member.rol && ` · ${member.rol}`}</span>
                <button type="button" className="btn btn-sm btn-outline-danger"
                  aria-label={`Quitar a ${member.apodo}`}
                  onClick={() => setDraft({ ...draft, integrantes: draft.integrantes.filter(item => item !== member) })}>
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <button type="submit" className="btn btn-primario">{draft.id ? 'Actualizar equipo' : 'Guardar equipo'}</button>
          {draft.id && <button type="button" className="btn btn-outline-light ms-2" onClick={() => edit(initial)}>Cancelar</button>}
        </fieldset>
      </form>
      {items?.length === 0 && <p>Aún no hay equipos registrados.</p>}
      <ul className="list-group">
        {items?.map(equipo => (
          <li key={equipo.id} className="list-group-item bg-superficie text-light border-secondary">
            <strong>{equipo.nombre}</strong> · {equipo.juego} · {equipo.integrantes.length} integrantes
            {admin && <div className="small">{equipo.propietarioEmail}</div>}
            <div className="d-flex gap-2 mt-2">
              <button type="button" className="btn btn-sm btn-outline-light" disabled={busy}
                onClick={() => edit(equipo)}>Editar</button>
              <button type="button" className="btn btn-sm btn-outline-danger" disabled={busy} onClick={() => {
                if (window.confirm(`¿Eliminar el equipo «${equipo.nombre}»?`)) {
                  void mutate(() => api.eliminarEquipo(equipo.id), 'Equipo eliminado.', draft.id === equipo.id);
                }
              }}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
