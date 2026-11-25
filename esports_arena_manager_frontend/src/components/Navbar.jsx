export function Navbar({ session, vistaActual, onCambiarVista, onLogout }) {
  const links = [['torneos', 'Torneos']];
  if (session) {
    links.push(['equipos', 'Equipos'], ['inscripciones', 'Inscripciones'], ['perfil', 'Perfil']);
    if (session.rol === 'ADMIN') links.push(['admin', 'Administrar torneos']);
  } else {
    links.push(['login', 'Iniciar sesión'], ['registro', 'Crear cuenta']);
  }

  return (
    <nav className="navbar navbar-dark bg-superficie border-bottom border-secondary mb-4" aria-label="Navegación principal">
      <div className="container gap-2">
        <a className="navbar-brand text-acento fw-bold" href="#torneos"
          onClick={event => { event.preventDefault(); onCambiarVista('torneos'); }}>
          🎮 eSports Arena Manager
        </a>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {links.map(([view, label]) => (
            <button key={view} type="button" aria-current={vistaActual === view ? 'page' : undefined}
              className={`btn btn-sm ${vistaActual === view ? 'btn-primario' : 'btn-outline-light'}`}
              onClick={() => onCambiarVista(view)}>{label}</button>
          ))}
          {session && <button type="button" className="btn btn-sm btn-outline-light" onClick={onLogout}>Cerrar sesión</button>}
        </div>
      </div>
    </nav>
  );
}
