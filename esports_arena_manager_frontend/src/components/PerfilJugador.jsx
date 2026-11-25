import { useState } from 'react';
import { api } from '../services/arena';

export function PerfilJugador({ session }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function search(event) {
    event.preventDefault();
    const apodo = new FormData(event.currentTarget).get('apodo').trim();
    setResult(null);
    setError('');
    if (!/^[^\s]{3,20}$/.test(apodo)) {
      setError('Ingresa un apodo de 3 a 20 caracteres sin espacios.');
      return;
    }
    setBusy(true);
    try {
      setResult(await api.jugador(apodo));
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container my-4">
      <div className="p-4 bg-superficie rounded border border-secondary">
        <h2 className="text-acento">Perfil</h2>
        <p>{session.nombre} · {session.email} · {session.rol}</p>
        <form onSubmit={search}>
          <label className="form-label d-block">Apodo para consultar sanciones
            <input name="apodo" className="form-control" required maxLength={20} disabled={busy} />
          </label>
          <button type="submit" className="btn btn-primario" disabled={busy}>Consultar sanción</button>
        </form>
        {error && <p role="alert" className="alert alert-danger mt-3">{error}</p>}
        {result && <p role="status" className="mt-3 mb-0">{result.apodo} · {
          result.sancionado ? 'Sanción disciplinaria activa' : 'Sin sanción activa'
        }</p>}
      </div>
    </section>
  );
}
