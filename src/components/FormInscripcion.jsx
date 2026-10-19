import { useState } from 'react';
import { JUGADORES_SANCIONADOS } from '../data/mockData';

export function FormInscripcion({ torneo, onInscripcionExitosa }) {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [capitanApodo, setCapitanApodo] = useState('');
  const [correo, setCorreo] = useState('');
  const [cantidadIntegrantes, setCantidadIntegrantes] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    // Validar si el formulario se envió vacío o incompleto
    if (!nombreEquipo.trim() || !capitanApodo.trim() || !correo.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // 1. Regla: Verificación de apodo del capitán (3 a 20 caracteres sin espacios)
    const apodoRegex = /^[^\s]{3,20}$/;
    if (!apodoRegex.test(capitanApodo)) {
      setError('El apodo del capitán debe tener entre 3 y 20 caracteres y sin espacios.');
      return;
    }

    // 2. Regla: Bloqueo por sanción disciplinaria activa
    if (Array.isArray(JUGADORES_SANCIONADOS) && JUGADORES_SANCIONADOS.includes(capitanApodo)) {
      setError(`El jugador "${capitanApodo}" tiene una sanción disciplinaria vigente y no puede inscribirse.`);
      return;
    }

    // 3. Regla: Verificación de integrantes mínimos según el juego
    if (cantidadIntegrantes < torneo.integrantesMinimos) {
      setError(`Este juego (${torneo.juego}) requiere un mínimo de ${torneo.integrantesMinimos} integrantes.`);
      return;
    }

    // Si pasa todas las validaciones
    if (typeof alert === 'function') {
      alert('¡Inscripción realizada con éxito!');
    }
    if (onInscripcionExitosa) {
      onInscripcionExitosa(torneo.id);
    }
  };

  return (
    <div className="p-4 bg-superficie rounded border border-secondary">
      <h3 className="text-acento mb-3">Inscripción: {torneo?.nombre}</h3>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre del Equipo</label>
          <input 
            type="text" 
            className="form-control bg-dark text-light border-secondary"
            placeholder="Nombre de tu escuadra"
            value={nombreEquipo} 
            onChange={(e) => setNombreEquipo(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Apodo del Capitán</label>
          <input 
            type="text" 
            className="form-control bg-dark text-light border-secondary"
            placeholder="Apodo del capitán"
            value={capitanApodo} 
            onChange={(e) => setCapitanApodo(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo de Contacto</label>
          <input 
            type="email" 
            className="form-control bg-dark text-light border-secondary"
            placeholder="ejemplo@correo.com"
            value={correo} 
            onChange={(e) => setCorreo(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad de Integrantes</label>
          <input 
            type="number" 
            className="form-control bg-dark text-light border-secondary"
            value={cantidadIntegrantes} 
            onChange={(e) => setCantidadIntegrantes(Number(e.target.value))} 
            min="1" 
          />
        </div>

        <button type="submit" className="btn btn-primario w-100">Confirmar Inscripción</button>
      </form>
    </div>
  );
}