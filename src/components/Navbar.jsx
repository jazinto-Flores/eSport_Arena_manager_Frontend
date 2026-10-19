


export function Navbar({ usuarioActual, onCambiarUsuario, vistaActual, onCambiarVista }) {
  const usuariosPrueba = ["ShadowStriker", "Valkyria99", "ToxicRage"];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-superficie border-bottom border-secondary mb-4">
      <div className="container">
        {/* Marca/Logo de eSports Arena Manager */}
        <a 
          className="navbar-brand text-acento fw-bold" 
          href="#inicio"
          onClick={(e) => { e.preventDefault(); onCambiarVista('torneos'); }}
        >
          🎮 eSports Arena Manager
        </a>

        {/* Botón menú colapsable para móviles */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${vistaActual === 'torneos' ? 'active text-acento' : 'text-light'}`}
                onClick={() => onCambiarVista('torneos')}
              >
                Torneos
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${vistaActual === 'equipos' ? 'active text-acento' : 'text-light'}`}
                onClick={() => onCambiarVista('equipos')}
              >
                Gestión de Equipos
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link btn btn-link ${vistaActual === 'perfil' ? 'active text-acento' : 'text-light'}`}
                onClick={() => onCambiarVista('perfil')}
              >
                Perfil
              </button>
            </li>
          </ul>

          {/* Selector de Perfil de Prueba */}
          <div className="d-flex align-items-center">
            <span className="me-2 text-muted small">Rol:</span>
            <select 
              className="form-select form-select-sm bg-dark text-light border-secondary"
              value={usuarioActual}
              onChange={(e) => onCambiarUsuario(e.target.value)}
            >
              {usuariosPrueba.map((user) => (
                <option key={user} value={user}>
                  {user} {user === 'ToxicRage' ? '(Sancionado)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}