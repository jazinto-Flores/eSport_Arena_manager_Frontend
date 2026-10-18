
export function TorneoCard({ torneo, onSeleccionar }) {
  const cuposDisponibles = torneo.cuposMaximos - torneo.inscritos;
  const estaLleno = cuposDisponibles <= 0;

  return (
    /* h-100 asegura que todas las tarjetas tengan la misma altura en la fila */
    <div className="card bg-superficie border-superficie text-light h-100 shadow-sm">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-dark text-acento border border-info">
              {torneo.juego}
            </span>
            <span className={`badge ${estaLleno ? 'bg-danger' : 'bg-success'}`}>
              {estaLleno ? 'CUPOS AGOTADOS' : `${cuposDisponibles} CUPOS`}
            </span>
          </div>

          <h4 className="card-title text-light fw-bold mb-2">{torneo.nombre}</h4>
          <p className="text-secondary small mb-1">
            Cierre de inscripción: <strong className="text-light">{torneo.cierreInscripcion}</strong>
          </p>
        </div>

        <div className="mt-4">
          <button 
            className="btn btn-primario w-100 py-2"
            onClick={() => onSeleccionar(torneo)}
            disabled={estaLleno}
          >
            {estaLleno ? 'Inscripciones Cerradas' : 'Inscribir Equipo'}
          </button>
        </div>
      </div>
    </div>
  );
}