export function EstadoCarga({ error, reload }) {
  if (!error) return <p role="status">Cargando…</p>;
  return (
    <div className="alert alert-danger" role="alert">
      {error} <button type="button" className="btn btn-sm btn-outline-danger" onClick={reload}>Reintentar</button>
    </div>
  );
}
