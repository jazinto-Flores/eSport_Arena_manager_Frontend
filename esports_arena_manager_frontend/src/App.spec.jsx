import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from './App';
import { FormInscripcion } from './components/FormInscripcion';
import { TorneoCard } from './components/TorneoCard';
import { api, getSession, logout } from './services/arena';

const torneo = {
  id: 'torneo-1', nombre: 'Copa Valorant', juego: 'Valorant', estado: 'ABIERTO',
  inscritos: 0, cuposMaximos: 8, integrantesMinimos: 2, cierreInscripcion: '2027-12-01',
};
const equipo = {
  id: 'team-1', nombre: 'Alpha Team', juego: 'Valorant', propietarioEmail: 'jugador@example.com',
  integrantes: [{ apodo: 'Alpha', rol: 'Capitán' }, { apodo: 'Bravo', rol: 'Titular' }],
};
const sesion = {
  token: 'access', refreshToken: 'refresh', rol: 'JUGADOR', nombre: 'Jugador',
  email: 'jugador@example.com',
};
const originalFetch = globalThis.fetch;

function reply(status, data) {
  return {
    status, ok: status >= 200 && status < 300,
    text: async () => data === undefined ? '' : JSON.stringify(data),
  };
}

function mockApi(handler) {
  globalThis.fetch = async (url, options) => handler(
    new URL(url, 'http://localhost').pathname.replace(/^\/api/, ''),
    options,
    options.body ? JSON.parse(options.body) : undefined,
  );
}

afterEach(() => {
  cleanup();
  logout();
  globalThis.fetch = originalFetch;
});

describe('Integración del frontend con la API', () => {
  it('muestra cupos y deshabilita la inscripción en torneos cerrados o llenos', () => {
    render(<>
      <TorneoCard torneo={torneo} />
      <TorneoCard torneo={{ ...torneo, estado: 'CERRADO' }} />
      <TorneoCard torneo={{ ...torneo, inscritos: 8 }} />
    </>);
    expect(screen.getByText('8 CUPOS')).toBeTruthy();
    expect(screen.getByText('CERRADO')).toBeTruthy();
    expect(screen.getByText('CUPOS AGOTADOS')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: 'Inscripciones Cerradas' }).every(button => button.disabled)).toBe(true);
  });

  it('registra una cuenta y retoma la inscripción después del login', async () => {
    let cupos = 0;
    let registration;
    let credentials;
    let enrollment;
    let authorization;
    mockApi((path, options, body) => {
      if (path === '/torneos') return reply(200, [{ ...torneo, inscritos: cupos }]);
      if (path === '/auth/registro') {
        registration = body;
        return reply(201, { id: 1, email: sesion.email, rol: sesion.rol });
      }
      if (path === '/auth/login') {
        credentials = body;
        return reply(200, sesion);
      }
      if (path === '/equipos') return reply(200, [equipo]);
      if (path === '/inscripciones') {
        enrollment = body;
        authorization = options.headers.Authorization;
        cupos++;
        return reply(201, { id: 'ins-1', ...body });
      }
      return reply(404);
    });

    const password = 'password-de-prueba';
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Inscribir Equipo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Jugador' } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: sesion.email } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }));
    await screen.findByText('Cuenta creada. Ahora puedes iniciar sesión.');
    expect(registration).toEqual({ nombre: 'Jugador', email: sesion.email, password });
    expect(getSession()).toBe(null);

    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: sesion.email } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    await screen.findByRole('option', { name: /Alpha Team/ });
    expect(credentials).toEqual({ email: sesion.email, password });
    expect(screen.queryByRole('button', { name: 'Administrar torneos' })).toBe(null);
    const submit = screen.getByRole('button', { name: 'Confirmar inscripción' });
    expect(submit.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Equipo'), { target: { value: equipo.id } });
    fireEvent.click(submit);
    await screen.findByText('Inscripción confirmada.');
    await screen.findByText('7 CUPOS');
    expect(enrollment).toEqual({ equipoId: equipo.id, torneoId: torneo.id });
    expect(authorization).toBe('Bearer access');
    expect(JSON.parse(sessionStorage.getItem('arena_sesion')).email).toBe(sesion.email);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(sessionStorage.getItem('arena_sesion')).toBe(null);
    expect(screen.queryByRole('button', { name: 'Equipos' })).toBe(null);
    await screen.findByText('7 CUPOS');
  });

  it('filtra equipos incompatibles y muestra el mensaje de sanción de la API', async () => {
    let success = false;
    mockApi((path) => {
      if (path === '/auth/login') return reply(200, sesion);
      if (path === '/equipos') return reply(200, [
        equipo, { ...equipo, id: 'team-2', nombre: 'Equipo LoL', juego: 'League of Legends' },
        { ...equipo, id: 'team-3', nombre: 'Equipo incompleto', integrantes: [equipo.integrantes[0]] },
      ]);
      return reply(500, { message: 'Jugador sancionado' });
    });
    await api.login({});
    render(<FormInscripcion torneo={torneo} onInscripcionExitosa={() => { success = true; }} />);
    await screen.findByRole('option', { name: /Alpha Team/ });
    expect(screen.getAllByRole('option').length).toBe(2);
    fireEvent.change(screen.getByLabelText('Equipo'), { target: { value: equipo.id } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar inscripción' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Jugador sancionado');
    expect(success).toBe(false);
  });

  it('renueva una sola vez ante dos respuestas 401 y actualiza el rol', async () => {
    const renovada = { ...sesion, token: 'new-access', refreshToken: 'new-refresh', rol: 'ADMIN' };
    const refreshRequests = [];
    mockApi((path, options, body) => {
      if (path === '/auth/login') return reply(200, sesion);
      if (path === '/auth/refresh') {
        refreshRequests.push(body);
        return reply(200, renovada);
      }
      if (options.headers.Authorization === 'Bearer access') return reply(401);
      if (options.headers.Authorization === 'Bearer new-access') return reply(200, []);
      return reply(403);
    });
    await api.login({});
    expect(await Promise.all([api.equipos(), api.inscripciones()])).toEqual([[], []]);
    expect(refreshRequests).toEqual([{ refreshToken: 'refresh' }]);
    expect(getSession()).toEqual(renovada);
  });

  it('permite crear, editar y eliminar un equipo con los métodos del backend', async () => {
    const calls = [];
    let current;
    const confirm = window.confirm;
    window.confirm = () => true;
    try {
      mockApi((path, options, body) => {
        if (path === '/auth/login') return reply(200, { ...sesion, rol: 'ADMIN' });
        if (path === '/torneos') return reply(200, []);
        if (path === '/equipos' && options.method === 'GET') return reply(200, current ? [current] : []);
        calls.push([path, options.method, body, options.headers.Authorization]);
        if (options.method === 'DELETE') {
          current = null;
          return reply(200);
        }
        current = { ...equipo, ...body };
        return reply(options.method === 'POST' ? 201 : 200, current);
      });
      await api.login({});
      render(<App />);
      expect(screen.getByRole('button', { name: 'Administrar torneos' })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: 'Equipos' }));
      await screen.findByText('Aún no hay equipos registrados.');
      fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Alpha Team' } });
      fireEvent.change(screen.getByLabelText('Juego'), { target: { value: 'Valorant' } });
      fireEvent.change(screen.getByLabelText('Apodo del integrante'), { target: { value: 'Alpha' } });
      fireEvent.click(screen.getByRole('button', { name: 'Agregar integrante' }));
      fireEvent.click(screen.getByRole('button', { name: 'Guardar equipo' }));
      await screen.findByText('Equipo creado.');
      fireEvent.click(await screen.findByRole('button', { name: 'Editar' }));
      fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Alpha 2' } });
      fireEvent.click(screen.getByRole('button', { name: 'Actualizar equipo' }));
      await screen.findByText('Alpha 2');
      fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
      await screen.findByText('Equipo eliminado.');
      await waitFor(() => expect(screen.queryByText('Alpha 2')).toBe(null));
      const payload = { nombre: 'Alpha Team', juego: 'Valorant', integrantes: [{ apodo: 'Alpha', rol: 'Titular' }] };
      expect(calls).toEqual([
        ['/equipos', 'POST', payload, 'Bearer access'],
        ['/equipos/team-1', 'PUT', { ...payload, nombre: 'Alpha 2' }, 'Bearer access'],
        ['/equipos/team-1', 'DELETE', undefined, 'Bearer access'],
      ]);
    } finally {
      window.confirm = confirm;
    }
  });
});
