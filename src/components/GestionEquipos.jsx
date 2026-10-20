import {
  leerEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo
} from '../data/equiposStorage';
import  {useState}  from 'react';

export function GestionEquipos() {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [juego, setJuego] = useState('League of Legends');
  const [integrantes, setIntegrantes] = useState([]);
  const [nuevoIntegrante, setNuevoIntegrante] = useState('');
  const [rolIntegrante, setRolIntegrante] = useState('Titular');
  const [error, setError] = useState('');
  const [equiposGuardados, setEquiposGuardados] =
      useState(leerEquipos);
  const [idEditando, setIdEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');

  // Agregar un integrante a la lista local
  const handleAgregarIntegrante = (e) => {
    e.preventDefault();
    setError('');

    if (!nuevoIntegrante.trim()) return;

    // Regla: Evitar integrantes duplicados en el equipo
    if (integrantes.some((i) => i.apodo.toLowerCase() === nuevoIntegrante.toLowerCase())) {
      setError(`El jugador "${nuevoIntegrante}" ya está agregado en esta escuadra.`);
      return;
    }

    setIntegrantes([...integrantes, { apodo: nuevoIntegrante.trim(), rol: rolIntegrante }]);
    setNuevoIntegrante('');
  };

  // Eliminar integrante
  const handleEliminarIntegrante = (apodo) => {
    setIntegrantes(integrantes.filter((i) => i.apodo !== apodo));
  };


  const handleGuardarEquipo = () => {
    if (!nombreEquipo.trim() || integrantes.length === 0) {
      setError('Debes indicar un nombre y agregar integrantes.');
      setMensajeExito('');
      return;
    }

    const datos = {
      nombre: nombreEquipo.trim(),
      juego,
      integrantes
    };

    if (idEditando) {
      actualizarEquipo(idEditando, datos);
      setMensajeExito('Escuadra actualizada correctamente.');
    } else {
      crearEquipo(datos);
      setMensajeExito('Escuadra creada correctamente.');
    }

    setEquiposGuardados(leerEquipos());

    setNombreEquipo('');
    setIntegrantes([]);
    setIdEditando(null);
    setError('');
  };

  const handleEditarEquipo = (equipo) => {
    setIdEditando(equipo.id);
    setNombreEquipo(equipo.nombre);
    setJuego(equipo.juego);
    setIntegrantes([...equipo.integrantes]);
    setError('');
    setMensajeExito('');
  };

  const handleEliminarEquipo = (id) => {
    eliminarEquipo(id);
    setEquiposGuardados(leerEquipos());

    if (idEditando === id) {
      setIdEditando(null);
      setNombreEquipo('');
      setIntegrantes([]);
    }

    setMensajeExito('Escuadra eliminada correctamente.');
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card bg-superficie text-light border-secondary p-4">
            <h3 className="text-acento mb-4">Gestión de Escuadras</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Formulario Principal de Equipo */}
            <div className="mb-3">
              <label className="form-label">Nombre de la Escuadra</label>
              <input 
                type="text" 
                className="form-control bg-dark text-light border-secondary"
                value={nombreEquipo}
                onChange={(e) => setNombreEquipo(e.target.value)}
                placeholder="Ej. Alpha Squad"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Disciplina / Juego</label>
              <select 
                className="form-select bg-dark text-light border-secondary"
                value={juego}
                onChange={(e) => setJuego(e.target.value)}
              >
                <option value="League of Legends">League of Legends</option>
                <option value="Valorant">Valorant</option>
                <option value="Rocket League">Rocket League</option>
              </select>
            </div>

            <hr className="border-secondary my-4" />

            {/* Sub-formulario para agregar miembros */}
            <h5 className="text-light mb-3">Agregar Integrantes</h5>
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-5">
                <input 
                  type="text" 
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Apodo del jugador"
                  value={nuevoIntegrante}
                  onChange={(e) => setNuevoIntegrante(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <select 
                  className="form-select bg-dark text-light border-secondary"
                  value={rolIntegrante}
                  onChange={(e) => setRolIntegrante(e.target.value)}
                >
                  <option value="Capitán">Capitán</option>
                  <option value="Titular">Titular</option>
                  <option value="Suplente">Suplente</option>
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button 
                  type="button" 
                  className="btn btn-primario w-100"
                  onClick={handleAgregarIntegrante}
                >
                  + Agregar
                </button>
              </div>
            </div>

            {/* Lista dinámica de miembros */}
            <ul className="list-group list-group-flush mb-4">
              {integrantes.map((item) => (
                <li 
                  key={item.apodo} 
                  className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{item.apodo}</strong> 
                    <span className="badge bg-secondary ms-2">{item.rol}</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleEliminarIntegrante(item.apodo)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <button
                className="btn btn-success w-100 py-2 fw-bold"
                disabled={!nombreEquipo.trim() || integrantes.length === 0}
                onClick={handleGuardarEquipo}
            >
              {idEditando ? 'Actualizar Escuadra' : 'Guardar Escuadra'}
            </button>
          </div>

          {mensajeExito && (
              <div className="alert alert-success mt-3" role="status">
                {mensajeExito}
              </div>
          )}

          <section className="mt-4">
            <h4 className="text-acento mb-3">
              Escuadras registradas
            </h4>

            {equiposGuardados.length === 0 && (
                <p>Aún no hay escuadras registradas.</p>
            )}

            {equiposGuardados.map((equipo) => (
                <div
                    key={equipo.id}
                    className="card bg-superficie text-light border-secondary p-3 mb-3"
                >
                  <h5>{equipo.nombre}</h5>
                  <p className="mb-2">
                    {equipo.juego} — {equipo.integrantes.length} integrantes
                  </p>

                  <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleEditarEquipo(equipo)}
                    >
                      Editar
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleEliminarEquipo(equipo.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}