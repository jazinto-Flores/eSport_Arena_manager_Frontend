# Integración de eSports Arena Manager
```powershell
npm ci
npm run dev -- --host localhost --port 5173 --strictPort
```

## Prueba manual

1. Abre **Torneos** sin iniciar sesión. Si tu base está vacía, el backend crea dos torneos de ejemplo. Selecciona **Inscribir Equipo** en uno abierto. La aplicación pide iniciar sesión y vuelve al torneo al entrar.
2. Crea una cuenta con un correo nuevo y una contraseña de al menos ocho caracteres. Inicia sesión con esa cuenta. El registro asigna el rol `JUGADOR`.
3. En **Equipos**, crea un equipo con el mismo juego y el mínimo de integrantes del torneo. Los torneos de ejemplo requieren cinco. Agrega cada apodo a la lista antes de guardar. Edita el nombre y vuelve a entrar a **Equipos** para comprobar que el cambio se guardó.
4. En **Torneos**, selecciona tu equipo y confirma. Comprueba que se actualiza el número de cupos y que el registro aparece en **Inscripciones**. Prueba también con un equipo que incluya a `ToxicRage` si tu base conserva la sanción de ejemplo. El servidor debe rechazar ese equipo.
5. Recarga la pestaña y verifica que sigues conectado. Cierra sesión y comprueba que vuelves a ver las opciones públicas. La sesión se guarda por pestaña y el cliente intenta renovarla una vez al recibir un 401 en una petición autenticada.
6. Para probar `ADMIN`, configura `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en Spring Boot antes de arrancar, usando un correo que todavía no exista. Entra con esa cuenta para ver todos los equipos e inscripciones y crear, editar, cerrar o eliminar torneos desde **Administrar torneos**. Con `JUGADOR`, la API devuelve únicamente los equipos y las inscripciones asociados a tu cuenta.
7. Prueba el borrado con un equipo de prueba sin inscripciones. El backend permite borrar equipos o torneos aunque haya inscripciones que los referencien. En ese caso, la lista muestra el ID cuando ya no puede resolver el nombre.

## Contrato utilizado

| Función | Petición | Datos |
| --- | --- | --- |
| Registro | `POST /api/auth/registro` | `{nombre, email, password}` → `{id, email, rol}` |
| Inicio de sesión | `POST /api/auth/login` | `{email, password}` → `{token, refreshToken, rol, nombre, email}` |
| Renovación | `POST /api/auth/refresh` | `{refreshToken}` → nueva sesión |
| Catálogo público | `GET /api/torneos` | Lista con estado, inscritos, cupos máximos, mínimo de integrantes y cierre |
| Administración | `POST /api/torneos`, `PUT/DELETE /api/torneos/{id}` | Permiso `ADMIN`. El backend controla el contador de inscritos |
| Equipos | `GET/POST /api/equipos`, `PUT/DELETE /api/equipos/{id}` | `{nombre, juego, integrantes: [{apodo, rol}]}`. El backend asigna ID y propietario |
| Inscripciones | `GET/POST /api/inscripciones` | Alta con `{torneoId, equipoId}`. Respuesta con ID, propietario y fecha |
| Consulta de sanción | `GET /api/jugadores/{apodo}` | `{apodo, sancionado}` |

Las peticiones protegidas envían `Authorization: Bearer <token>`. Spring Boot valida permisos, propiedad, sanciones, cupos y duplicados. El campo `cierreInscripcion` se muestra como fecha informativa. En esta versión el servidor usa el estado y los cupos para decidir si acepta inscripciones.

La vista **Perfil** muestra los datos de sesión y permite consultar sanciones por apodo, que es lo que ofrece esta API. Los torneos y equipos de demostración guardados en el navegador pertenecen a la versión anterior. Al aplicar el parche, el catálogo y los equipos se cargan desde PostgreSQL a través de la API. Si quieres conservar un equipo de la versión anterior, vuelve a crearlo desde la interfaz.

## Compilación y pruebas

```powershell
npm run build
npm run test:vitest
```

La suite incluida usa respuestas simuladas para comprobar tarjetas, registro, login, inscripción, validación, renovación simultánea y CRUD de equipos. Puedes ejecutarla con Spring Boot apagado. Usa la prueba manual de arriba para comprobar tu instalación local.
