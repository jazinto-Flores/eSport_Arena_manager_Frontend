import { useEffect, useRef, useState } from 'react';
import { api } from '../services/arena';

export function Acceso({ registro, aviso, onComplete }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const inflight = useRef(null);
  useEffect(() => () => inflight.current?.abort(), []);

  async function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = { email: values.get('email').trim(), password: values.get('password') };
    setError('');
    if (registro && (!values.get('nombre').trim() || new TextEncoder().encode(body.password).length > 72)) {
      setError('Ingresa un nombre y usa una contraseña de hasta 72 bytes.');
      return;
    }
    const controller = new AbortController();
    inflight.current = controller;
    const { signal } = controller;
    setBusy(true);
    try {
      if (registro) await api.registro({ ...body, nombre: values.get('nombre').trim() }, signal);
      else await api.login(body, signal);
      if (!signal.aborted) onComplete();
    } catch (failure) {
      if (signal.aborted) return;
      setError(!registro && [401, 500].includes(failure.status)
        ? 'No se pudo iniciar sesión. Revisa las credenciales o vuelve a intentarlo.'
        : failure.message);
    } finally {
      if (!signal.aborted) setBusy(false);
    }
  }

  return (
    <section className="container my-4" style={{ maxWidth: 520 }}>
      <form className="bg-superficie p-4 rounded border border-secondary" onSubmit={submit}>
        <h2 className="text-acento">{registro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
        {aviso && <p role="status">{aviso}</p>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <fieldset disabled={busy}>
          {registro && <label className="form-label d-block mb-3">Nombre
            <input name="nombre" autoComplete="name" className="form-control" required maxLength={255} />
          </label>}
          <label className="form-label d-block mb-3">Correo electrónico
            <input name="email" type="email" autoComplete="username" className="form-control" required maxLength={255} />
          </label>
          <label className="form-label d-block mb-3">Contraseña
            <input name="password" type="password" autoComplete={registro ? 'new-password' : 'current-password'}
              className="form-control" required minLength={registro ? 8 : undefined} />
          </label>
          <button className="btn btn-primario" type="submit">
            {busy ? 'Enviando…' : registro ? 'Registrarme' : 'Entrar'}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
