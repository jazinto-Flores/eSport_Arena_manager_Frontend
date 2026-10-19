
import  TorneoCard  from './TorneoCard';

export function ListaTorneos({ torneos, onSeleccionarTorneo }) {
  return (
    // container o container-fluid crea el margen responsivo
    <div className="container my-4">
      
      {/* Encabezado con color de acento (#00F5D4) */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="text-acento fw-bold">Torneos Disponibles</h2>
          <p className="text-muted">Inscribe a tu escuadra antes del cierre de convocatorias.</p>
        </div>
      </div>

      {/* Rejilla Responsiva de Bootstrap */}
      <div className="row g-4">
        {torneos.map((torneo) => (
          /* Aquí aplicamos la responsividad: 12 en móvil, 6 en tablet, 4 en desktop */
          <div key={torneo.id} className="col-12 col-md-6 col-lg-4">
            <TorneoCard 
              torneo={torneo} 
              onSeleccionar={onSeleccionarTorneo} 
            />
          </div>
        ))}
      </div>

    </div>
  );
}