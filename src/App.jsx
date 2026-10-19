import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ListaTorneos } from './components/ListaTorneos';
import { FormInscripcion } from './components/FormInscripcion';
import { GestionEquipos } from './components/GestionEquipos';
import { PerfilJugador } from './components/PerfilJugador';
import { INITIAL_TORNEOS, JUGADORES_SANCIONADOS } from './data/mockData';

export function App() {
  // 1. Estados Globales
  const [torneos, setTorneos] = useState(INITIAL_TORNEOS);
  const [vistaActual, setVistaActual] = useState('torneos');
  const [usuarioActual, setUsuarioActual] = useState('ShadowStriker');
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

  // Verificar si el usuario seleccionado está en la lista de sancionados
  const esSancionado = JUGADORES_SANCIONADOS.includes(usuarioActual);

  // 2. Transición a la vista de inscripción
  const handleSeleccionarTorneo = (torneo) => {
    setTorneoSeleccionado(torneo);
    setVistaActual('inscripcion');
  };

  // 3. Actualizar cupos cuando se completa una inscripción
  const handleInscripcionExitosa = (idTorneo) => {
    setTorneos(
      torneos.map((t) =>
        t.id === idTorneo ? { ...t, inscritos: t.inscritos + 1 } : t
      )
    );
    // Volver al catálogo
    setVistaActual('torneos');
    setTorneoSeleccionado(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-light">
      {/* Navegador principal */}
      <Navbar 
        usuarioActual={usuarioActual}
        onCambiarUsuario={setUsuarioActual}
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
      />

      {/* Renderizado condicional según la vista activa */}
      <main className="flex-grow-1">
        {vistaActual === 'torneos' && (
          <ListaTorneos 
            torneos={torneos} 
            onSeleccionarTorneo={handleSeleccionarTorneo} 
          />
        )}

        {vistaActual === 'inscripcion' && torneoSeleccionado && (
          <div className="container my-4">
            <button 
              className="btn btn-outline-secondary mb-3"
              onClick={() => setVistaActual('torneos')}
            >
              ← Volver a Torneos
            </button>
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <FormInscripcion 
                  torneo={torneoSeleccionado}
                  onInscripcionExitosa={handleInscripcionExitosa}
                />
              </div>
            </div>
          </div>
        )}

        {vistaActual === 'equipos' && (
          <GestionEquipos />
        )}

        {vistaActual === 'perfil' && (
          <PerfilJugador 
            apodoActual={usuarioActual}
            onActualizarApodo={setUsuarioActual}
            esSancionado={esSancionado}
          />
        )}
      </main>

      {/* Pie de página institucional */}
      <footer className="bg-superficie border-top border-secondary text-center py-3 text-muted mt-auto">
        <small>eSports Arena Manager — Duoc UC 2026</small>
      </footer>
    </div>
  );
}

export default App;