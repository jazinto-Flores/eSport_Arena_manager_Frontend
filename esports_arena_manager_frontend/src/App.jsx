import { useState, useSyncExternalStore } from 'react';
import { Navbar } from './components/Navbar';
import { ListaTorneos } from './components/ListaTorneos';
import { FormInscripcion } from './components/FormInscripcion';
import { GestionEquipos } from './components/GestionEquipos';
import { PerfilJugador } from './components/PerfilJugador';
import { Acceso } from './components/Acceso';
import { EstadoCarga } from './components/EstadoCarga';
import { Inscripciones } from './components/Inscripciones';
import { AdminTorneos } from './components/AdminTorneos';
import { api, getSession, logout, subscribeSession } from './services/arena';
import { useColeccion } from './services/useColeccion';

export function App() {
  const session = useSyncExternalStore(subscribeSession, getSession);
  const catalogo = useColeccion(api.torneos);
  const [vista, setVista] = useState('torneos');
  const [torneo, setTorneo] = useState(null);
  const [aviso, setAviso] = useState('');
  const admin = session?.rol === 'ADMIN';
  const publico = ['torneos', 'login', 'registro'].includes(vista);
  const vistaActual = !session && !publico ? 'login' : vista === 'admin' && !admin ? 'torneos' : vista;

  function navigate(next) {
    setAviso('');
    setVista(next);
    if (!['login', 'registro'].includes(next)) setTorneo(null);
    if (next === 'torneos') catalogo.reload();
  }

  function select(tournament) {
    setTorneo(tournament);
    setAviso(session ? '' : 'Inicia sesión para inscribir un equipo.');
    setVista(session ? 'inscripcion' : 'login');
  }

  function afterLogin() {
    setAviso('');
    setVista(torneo ? 'inscripcion' : 'torneos');
  }

  function afterRegistration() {
    setAviso('Cuenta creada. Ahora puedes iniciar sesión.');
    setVista('login');
  }

  function afterEnrollment() {
    catalogo.reload();
    if (!getSession()) return;
    setVista(current => current === 'inscripcion' ? 'torneos' : current);
    setAviso('Inscripción confirmada.');
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      <Navbar session={session} vistaActual={vistaActual} onCambiarVista={navigate}
        onLogout={() => { logout(); navigate('torneos'); }} />
      <main className="flex-grow-1">
        {vistaActual === 'torneos' && (
          <>
            {aviso && <p className="container alert alert-success" role="status">{aviso}</p>}
            {!catalogo.items && <div className="container"><EstadoCarga {...catalogo} /></div>}
            {catalogo.items?.length === 0 && <p className="container">Aún no hay torneos publicados.</p>}
            {catalogo.items?.length > 0 && <ListaTorneos torneos={catalogo.items} onSeleccionarTorneo={select} />}
          </>
        )}
        {['login', 'registro'].includes(vistaActual) && (
          <Acceso key={vistaActual} registro={vistaActual === 'registro'}
            aviso={aviso || (!publico && !session ? 'Vuelve a iniciar sesión para continuar.' : '')}
            onComplete={vistaActual === 'registro' ? afterRegistration : afterLogin} />
        )}
        {session && (
          <div key={session.email}>
            {vistaActual === 'inscripcion' && torneo && (
              <div className="container my-4">
                <button type="button" className="btn btn-outline-light mb-3"
                  onClick={() => navigate('torneos')}>Volver a torneos</button>
                <div className="row justify-content-center">
                  <div className="col-12 col-md-8 col-lg-6">
                    <FormInscripcion key={torneo.id} torneo={torneo} onInscripcionExitosa={afterEnrollment}
                      onEquipos={() => navigate('equipos')} />
                  </div>
                </div>
              </div>
            )}
            {vistaActual === 'equipos' && <GestionEquipos admin={admin} />}
            {vistaActual === 'inscripciones' && <Inscripciones torneos={catalogo.items} admin={admin} />}
            {vistaActual === 'perfil' && <PerfilJugador session={session} />}
            {vistaActual === 'admin' && admin && <AdminTorneos catalogo={catalogo} />}
          </div>
        )}
      </main>
      <footer className="bg-superficie border-top border-secondary text-center py-3 text-muted mt-auto">
        <small>eSports Arena Manager — Duoc UC 2026</small>
      </footer>
    </div>
  );
}

export default App;
