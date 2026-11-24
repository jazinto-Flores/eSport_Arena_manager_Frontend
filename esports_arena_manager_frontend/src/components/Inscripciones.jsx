import { api } from '../services/arena';
import { useColeccion } from '../services/useColeccion';
import { EstadoCarga } from './EstadoCarga';

export function Inscripciones({ torneos, admin }) {
  const registros = useColeccion(api.inscripciones);
  const equipos = useColeccion(api.equipos);

  return (
    <section className="container my-4">
      <h2 className="text-acento">{admin ? 'Inscripciones registradas' : 'Mis inscripciones'}</h2>
      {!registros.items && <EstadoCarga {...registros} />}
      {registros.items?.length === 0 && <p>Aún no hay inscripciones registradas.</p>}
      {registros.items?.length > 0 && (
        <>
          {!equipos.items && <EstadoCarga {...equipos} />}
          <ul className="list-group">
            {registros.items.map(registro => (
              <li key={registro.id} className="list-group-item bg-superficie text-light border-secondary">
                <strong>{torneos?.find(torneo => torneo.id === registro.torneoId)?.nombre ?? registro.torneoId}</strong>
                {' · '}{equipos.items?.find(equipo => equipo.id === registro.equipoId)?.nombre ?? registro.equipoId}
                {registro.fecha && <div>{new Date(registro.fecha).toLocaleString('es-CL')}</div>}
                {admin && <div>{registro.propietarioEmail}</div>}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
