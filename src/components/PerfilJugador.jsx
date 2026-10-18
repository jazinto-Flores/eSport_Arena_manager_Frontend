

export function PerfilJugador({ apodoActual, onActualizarApodo, esSancionado }) {
  const [nuevoApodo, setNuevoApodo] = useState(apodoActual);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Estadísticas simuladas
  const victorias = 14;
  const partidasTotales = 20;
  // Cálculo dinámico de Winrate (Victorias / Partidas Totales * 100)
  const winrate = ((victorias / partidasTotales) * 100).toFixed(1);

  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    // Regla ERS: Apodo sin espacios y entre 3 y 20 caracteres
    const regexApodo = /^[^\s]{3,20}$/;
    if (!regexApodo.test(nuevoApodo)) {
      setMensajeError('El apodo debe tener entre 3 y 20 caracteres y no contener espacios.');
      return;
    }

    onActualizarApodo(nuevoApodo);
    setMensajeExito('Perfil actualizado correctamente.');
  };

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Ficha Competitiva */}
        <div className="col-12 col-md-5 col-lg-4">
          <div className="card bg-superficie text-light border-secondary text-center p-4">
            <div className="mb-3">
              <span className="display-1">👤</span>
            </div>
            <h4 className="text-acento">{apodoActual}</h4>
            <span className={`badge ${esSancionado ? 'bg-danger' : 'bg-success'} my-2`}>
              {esSancionado ? 'Sanción Disciplinaria Activa' : 'Jugador Habilitado'}
            </span>

            <div className="mt-4 text-start">
              <h6 className="text-muted">Estadísticas Competitivas</h6>
              <p className="mb-1">Partidas Jugadas: <strong>{partidasTotales}</strong></p>
              <p className="mb-1">Victorias: <strong>{victorias}</strong></p>
              <p className="mb-1">Rendimiento (Winrate): <strong className="text-acento">{winrate}%</strong></p>
            </div>
          </div>
        </div>

        {/* Edición de Perfil */}
        <div className="col-12 col-md-7 col-lg-8">
          <div className="card bg-superficie text-light border-secondary p-4">
            <h4 className="text-acento mb-4">Editar Datos del Perfil</h4>

            {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}
            {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}

            <form onSubmit={handleGuardarPerfil}>
              <div className="mb-3">
                <label className="form-label">Apodo Competitivo</label>
                <input 
                  type="text" 
                  className="form-control bg-dark text-light border-secondary"
                  value={nuevoApodo}
                  onChange={(e) => setNuevoApodo(e.target.value)}
                  required
                />
                <div className="form-text text-muted">
                  Sin espacios, entre 3 y 20 caracteres.
                </div>
              </div>

              <button type="submit" className="btn btn-primario py-2 px-4">
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}