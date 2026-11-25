# eSports Arena — Spring Boot + PostgreSQL

Proyecto académico monolítico, con PostgreSQL, JPA, Swagger, JWT HS256, roles ADMIN/JUGADOR y CRUD.

## Requisitos
Java 21, Maven 3.9+ y PostgreSQL 16+ (o Docker Desktop para la base de datos).

## Base de datos
Opción Docker: `docker compose up -d` (usuario `postgres`, clave `postgres`, DB `esports_arena`).
Opción PostgreSQL instalado: crear BD `esports_arena` y configurar credenciales locales.

## Variables necesarias (PowerShell)
```powershell
$env:DB_URL='jdbc:postgresql://localhost:5432/esports_arena'
$env:DB_USER='postgres'
$env:DB_PASSWORD='postgres'
$env:JWT_SECRET='UnaClaveDePruebaLargaYUnicaDeAlMenos32Caracteres_2026'
$env:CORS_ORIGIN='http://localhost:5173'
$env:SEED_ADMIN_EMAIL='admin@arena.test'
$env:SEED_ADMIN_PASSWORD='ClaveAdminSegura123!'
mvn spring-boot:run
```
Con Docker la contraseña de PostgreSQL predeterminada es solo de desarrollo: cámbiala antes de publicar.

## Probar
- Salud: `http://localhost:8080/api/health`
- Swagger: `http://localhost:8080/swagger-ui.html`
- Torneos públicos: `http://localhost:8080/api/torneos`
- `POST /api/auth/registro` `{ "nombre":"Jugador Uno", "email":"jugador@test.cl", "password":"ClaveSegura123" }`
- `POST /api/auth/login` `{ "email":"jugador@test.cl", "password":"ClaveSegura123" }`
- Copia `token` de la respuesta. En Swagger botón Authorize pega solo el JWT (sin `Bearer` si la UI lo agrega).
- `POST /api/equipos` con `Authorization: Bearer <token>` y cuerpo:
  `{ "nombre":"Alpha Team", "juego":"Valorant", "integrantes":[{"apodo":"A1pro","rol":"Capitán"},{"apodo":"A2pro","rol":"Titular"},{"apodo":"A3pro","rol":"Titular"},{"apodo":"A4pro","rol":"Titular"},{"apodo":"A5pro","rol":"Titular"}] }`
- `POST /api/inscripciones` con token y `{ "torneoId":"torneo-2", "equipoId":"<id devuelto>" }`.
- Usa login del admin sembrado para administrar torneos y sanciones.

## Conectar React
En `.env.local` del frontend: `VITE_API_URL=http://localhost:8080`.
La API exige login JWT en equipos e inscripciones; el frontend original con localStorage no se conecta automáticamente. Requiere reemplazar sus funciones locales por fetch y añadir login, guardado de sesión y controles por rol.

## Limitaciones deliberadas de este prototipo
- Refresh token JWT sin rotación/revocación; para producción se necesitan refresh tokens con hash en DB, rotación, revocación y cookies HttpOnly.
- La inicialización usa `hibernate.ddl-auto=update` para clases; en producción reemplazar con migraciones Flyway.
- No incluye tests automáticos aún y no debe considerarse listo para producción.
- No hay control transaccional explícito para impedir todas las condiciones de carrera de cupos; antes de uso real se requiere bloqueo de fila o actualización atómica.
- Los administradores solo se crean mediante variables de entorno, nunca desde registro público.
