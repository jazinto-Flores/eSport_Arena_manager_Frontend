import { render, screen, fireEvent } from '@testing-library/react';

// Si exportaste con "export default":
import {TorneoCard} from './components/TorneoCard.jsx';
import {FormInscripcion} from './components/FormInscripcion.jsx';
import {PerfilJugador} from './components/PerfilJugador.jsx';

describe('Suite de Pruebas Unitarias - eSports Arena Manager', () => {

  // Mock de datos para las pruebas
  const torneoEjemplo = {
    id: 1,
    nombre: 'Torneo Relámpago Valorant',
    juego: 'Valorant',
    cuposMaximos: 8,
    inscritos: 3,
    integrantesMinimos: 5,
    cierreInscripcion: '2026-11-01'
  };

  const torneoLleno = {
    id: 2,
    nombre: 'Copa Champions LoL',
    juego: 'League of Legends',
    cuposMaximos: 4,
    inscritos: 4,
    cierreInscripcion: '2026-10-30'
  };

  // -------------------------------------------------------------
  // BLOQUE 1: Renderizado e Interfaz de Usuario (Tests 1 - 4)
  // -------------------------------------------------------------
  it('1. Debe renderizar el nombre del torneo en la tarjeta TorneoCard', () => {
    render(<TorneoCard torneo={torneoEjemplo} onSeleccionar={() => {}} />);
    expect(screen.getByText('Torneo Relámpago Valorant')).toBeTruthy();
  });

  it('2. Debe mostrar la cantidad de cupos disponibles correctamente', () => {
    render(<TorneoCard torneo={torneoEjemplo} onSeleccionar={() => {}} />);
    expect(screen.getByText('5 CUPOS')).toBeTruthy();
  });

  it('3. Debe deshabilitar el botón de inscripción si el torneo está lleno', () => {
    render(<TorneoCard torneo={torneoLleno} onSeleccionar={() => {}} />);
    const boton = screen.getByRole('button', { name: /Inscripciones Cerradas/i });
    expect(boton.disabled).toBeTruthy();
  });

  it('4. Debe mostrar el distintivo "CUPOS AGOTADOS" cuando no hay cupos', () => {
    render(<TorneoCard torneo={torneoLleno} onSeleccionar={() => {}} />);
    expect(screen.getByText('CUPOS AGOTADOS')).toBeTruthy();
  });

  // -------------------------------------------------------------
  // BLOQUE 2: Reglas de Negocio y Validaciones (Tests 5 - 8)
  // -------------------------------------------------------------
  it('5. Debe rechazar apodos con espacios o menos de 3 caracteres', () => {
    let errorMostrado = false;
    const { container } = render(
      <PerfilJugador 
        apodoActual="AB" 
        onActualizarApodo={() => {}} 
        esSancionado={false} 
      />
    );
    
    const botonGuardar = screen.getByText('Guardar Cambios');
    fireEvent.click(botonGuardar);
    
    const alerta = container.querySelector('.alert-danger');
    expect(alerta).toBeTruthy();
  });

  it('6. Debe permitir la actualización de un apodo válido (ej: ShadowStriker)', () => {
    let apodoActualizado = '';
    render(
      <PerfilJugador 
        apodoActual="ShadowStriker" 
        onActualizarApodo={(nuevo) => { apodoActualizado = nuevo; }} 
        esSancionado={false} 
      />
    );

    const botonGuardar = screen.getByText('Guardar Cambios');
    fireEvent.click(botonGuardar);
    
    expect(screen.getByText('Perfil actualizado correctamente.')).toBeTruthy();
  });

  it('7. Debe detectar el estado de jugador sancionado (ToxicRage) y mostrar alerta', () => {
    render(
      <PerfilJugador 
        apodoActual="ToxicRage" 
        onActualizarApodo={() => {}} 
        esSancionado={true} 
      />
    );
    expect(screen.getByText('Sanción Disciplinaria Activa')).toBeTruthy();
  });

  it('8. Debe rechazar la inscripción si el formulario se envía vacío', () => {
    const { container } = render(
      <FormInscripcion torneo={torneoEjemplo} onInscripcionExitosa={() => {}} />
    );
    
    const botonEnviar = screen.getByText('Confirmar Inscripción');
    fireEvent.click(botonEnviar);

    const alerta = container.querySelector('.alert-danger');
    expect(alerta).toBeTruthy();
  });

  // -------------------------------------------------------------
  // BLOQUE 3: Eventos y Simulaciones (Tests 9 - 10)
  // -------------------------------------------------------------
  it('9. Debe invocar el callback onSeleccionar al presionar Inscribir Equipo', () => {
    let seleccionado = false;
    render(
      <TorneoCard 
        torneo={torneoEjemplo} 
        onSeleccionar={() => { seleccionado = true; }} 
      />
    );

    const boton = screen.getByRole('button', { name: /Inscribir Equipo/i });
    fireEvent.click(boton);

    expect(seleccionado).toBeTruthy();
  });

  it('10. Debe procesar con éxito la inscripción al completar los datos del equipo', () => {
    let inscripcionCompletada = false;
    render(
      <FormInscripcion 
        torneo={torneoEjemplo} 
        onInscripcionExitosa={() => { inscripcionCompletada = true; }} 
      />
    );

    const inputEquipo = screen.getByPlaceholderText(/Nombre de tu escuadra/i);
    const inputCapitan = screen.getByPlaceholderText(/Apodo del capitán/i);
    const inputContacto = screen.getByPlaceholderText(/ejemplo@correo.com/i);

    fireEvent.change(inputEquipo, { target: { value: 'Alpha Team' } });
    fireEvent.change(inputCapitan, { target: { value: 'CapitanPro' } });
    fireEvent.change(inputContacto, { target: { value: 'alpha@team.com' } });

    const botonSubmit = screen.getByText('Confirmar Inscripción');
    fireEvent.click(botonSubmit);

    expect(inscripcionCompletada).toBeTruthy();
  });

});