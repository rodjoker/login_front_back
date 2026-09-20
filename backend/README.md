# user_crud_express

Backend base (boilerplate) listo para producción: **Express 5 + MongoDB/Mongoose + JWT**, con bloqueo de cuenta por intentos fallidos, validación robusta, seguridad HTTP y una suite de tests de integración que corre en memoria (sin tocar tu base de datos real).

Pensado para usarse como punto de partida de proyectos nuevos que necesiten autenticación de usuarios.

---

## Stack técnico

| Capa | Elección | Por qué |
|---|---|---|
| Runtime | Node.js (ESM, `"type": "module"`) | Sintaxis `import`/`export` nativa, sin transpilar |
| Framework HTTP | Express 5 | Manejo nativo de promesas rechazadas en rutas async |
| Base de datos | MongoDB Atlas vía Mongoose 9 | Esquemas con validación, hooks y virtuals |
| Hashing de contraseñas | `bcryptjs` | Implementación 100% JS, sin compilación nativa — evita problemas de instalación en cualquier SO |
| Autenticación | JSON Web Tokens (`jsonwebtoken`) | Stateless, estándar de la industria |
| Validación de entrada | `zod` | Schemas declarativos, mensajes de error claros |
| Seguridad HTTP | `helmet`, `cors`, `express-rate-limit` | Cabeceras seguras, control de origen, límite de tasa |
| Testing | `vitest` + `supertest` + `mongodb-memory-server` | Tests de integración reales contra un Mongo real (en memoria), rápidos y aislados |

---

## Estructura del proyecto

```text
src/
  ├── config/
  │   ├── env.js            # variables de entorno centralizadas y validadas
  │   └── db.js              # conexión a MongoDB (solo para el servidor real)
  ├── controllers/
  │   ├── auth.controller.js
  │   └── user.controller.js
  ├── middleware/
  │   ├── auth.middleware.js       # protect (JWT) + restrictTo (roles)
  │   ├── validate.middleware.js   # valida req.body contra un schema de zod
  │   ├── rateLimiter.middleware.js
  │   ├── notFound.middleware.js
  │   └── error.middleware.js      # manejador de errores global
  ├── models/
  │   └── User.model.js      # schema, hash de password, lógica de bloqueo
  ├── routes/
  │   ├── auth.routes.js
  │   ├── user.routes.js
  │   └── index.js
  ├── services/
  │   ├── auth.service.js    # lógica de negocio: registro, login, bloqueo
  │   ├── token.service.js   # firmar/verificar JWT
  │   └── user.service.js    # CRUD de usuarios
  ├── validators/
  │   ├── auth.validator.js
  │   └── user.validator.js
  ├── utils/
  │   ├── AppError.js        # clase de error operacional con statusCode
  │   ├── asyncHandler.js    # wrapper para controllers async
  │   ├── apiResponse.js     # forma estándar de respuesta { success, message, data }
  │   └── logger.js
  ├── app.js                 # Express configurado, SIN app.listen() — así los tests lo importan directo
  └── server.js               # conecta a Mongo y arranca el servidor HTTP
tests/
  ├── integration/
  │   ├── auth.test.js
  │   └── user.test.js
  └── setup.js                # levanta/apaga mongodb-memory-server para toda la suite
```

**Por qué `app.js` y `server.js` están separados:** los tests de integración importan `app.js` directamente y le mandan requests con Supertest, sin necesidad de abrir un puerto real ni depender de que `server.js` haya llamado a `connectDB()`. Cada test conecta a su propia instancia de Mongo en memoria (ver `tests/setup.js`).

---

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Completá `.env` con tus valores reales. Ver la tabla completa más abajo.

### 3. Conectar con MongoDB Atlas

1. Entrá a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y creá (o usá) un cluster.
2. En **Database Access**, creá un usuario de base de datos con contraseña.
3. En **Network Access**, agregá tu IP (o `0.0.0.0/0` solo para desarrollo).
4. En **Database → Connect → Drivers**, copiá el connection string y pegalo en `MONGO_URI` dentro de `.env`, reemplazando `<usuario>`, `<password>` y el nombre de la base:

```
MONGO_URI=mongodb+srv://miUsuario:miPassword@micluster.mongodb.net/user_crud_express?retryWrites=true&w=majority
```

### 4. Generar un JWT_SECRET real

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Pegá el resultado en `JWT_SECRET` dentro de `.env`. **Nunca** uses un secreto corto o predecible en producción.

### 5. Levantar el servidor

```bash
npm run dev     # con recarga automática (node --watch)
npm start       # modo producción
```

El servidor queda escuchando en `http://localhost:4000` (o el `PORT` que hayas definido). Podés confirmar que está vivo con:

```bash
curl http://localhost:4000/health
```

---

## Variables de entorno

| Variable | Obligatoria | Default | Descripción |
|---|---|---|---|
| `PORT` | No | `4000` | Puerto del servidor HTTP |
| `NODE_ENV` | No | `development` | `development` \| `production` \| `test` |
| `MONGO_URI` | **Sí** (fuera de tests) | — | Connection string de MongoDB Atlas |
| `JWT_SECRET` | **Sí** | — | Secreto para firmar los JWT — largo y aleatorio |
| `JWT_EXPIRES_IN` | No | `1d` | Duración del token (formato de [`ms`](https://github.com/vercel/ms): `1d`, `12h`, `30m`, etc.) |
| `MAX_LOGIN_ATTEMPTS` | No | `3` | Intentos fallidos consecutivos antes de bloquear la cuenta |
| `LOCK_TIME_MINUTES` | No | `15` | Minutos que dura el bloqueo |
| `BCRYPT_SALT_ROUNDS` | No | `10` | Costo del hash de bcrypt |
| `CORS_ORIGIN` | No | `*` | Origen permitido para CORS (usar un dominio real en producción) |

`MONGO_URI` no hace falta en tests: la suite levanta su propia base en memoria (`mongodb-memory-server`) y nunca toca `.env`.

---

## Testing

```bash
npm test              # corre toda la suite una vez
npm run test:watch    # modo watch, para desarrollo
npm run test:coverage # corre la suite y genera un reporte de cobertura
```

Los tests de integración (`tests/integration/`) usan **Supertest** contra la app de Express real, con **MongoDB en memoria** (`mongodb-memory-server`) — nunca tocan tu base de Atlas. Cada test arranca con la base vacía (`tests/setup.js` limpia todas las colecciones después de cada test).

> **Primera corrida:** `mongodb-memory-server` descarga un binario de MongoDB la primera vez que se usa. Necesita conexión a internet una sola vez; después queda cacheado localmente.

### Qué cubre la suite

- Registro exitoso de usuario, con y sin duplicados.
- Validación de entrada (correo inválido, contraseña corta).
- Login exitoso devolviendo un JWT válido.
- Login fallido: incrementa `loginAttempts`, sin bloquear antes de tiempo.
- Bloqueo de cuenta en el 3er intento fallido consecutivo (HTTP 423).
- Rechazo de login en una cuenta bloqueada, incluso con la contraseña correcta.
- Reseteo de `loginAttempts`/`lockUntil` tras un login exitoso.
- Mensaje idéntico para "usuario inexistente" y "contraseña incorrecta" (anti-enumeración).
- `GET /api/auth/me` con y sin token válido.
- CRUD de usuarios: listar, editar (solo el propio usuario o un admin), eliminar, y que no se puedan pisar `password`/`role` desde el endpoint de edición.

---

## Lógica de bloqueo de cuenta

Cada `User` tiene `loginAttempts` (contador) y `lockUntil` (fecha hasta la que la cuenta está bloqueada, `null` si no lo está).

1. Cada contraseña incorrecta suma 1 a `loginAttempts`.
2. Al llegar a `MAX_LOGIN_ATTEMPTS` (default 3), la cuenta se bloquea: `lockUntil = ahora + LOCK_TIME_MINUTES`, y `loginAttempts` vuelve a 0 (el próximo ciclo de intentos, una vez expire el bloqueo, arranca limpio).
3. Mientras `lockUntil` siga en el futuro, **cualquier** intento de login —incluso con la contraseña correcta— responde `423 Locked` con el tiempo restante.
4. Un login exitoso resetea `loginAttempts` a `0` y `lockUntil` a `null`.
5. El login nunca revela si el problema fue "el correo no existe" o "la contraseña está mal" — mismo mensaje en los dos casos, para no facilitar que alguien confirme qué correos están registrados.

---

## Seguridad incluida

- **Hash de contraseñas** con `bcryptjs`, nunca en texto plano ni siquiera en memoria más de lo necesario (`select: false` en el schema).
- **JWT** firmado con secreto propio, expiración configurable.
- **Bloqueo de cuenta** tras intentos fallidos (ver arriba).
- **Helmet**: cabeceras HTTP seguras por defecto.
- **CORS** configurable por variable de entorno.
- **Rate limiting**: límite general en toda `/api`, y uno más estricto en `/api/auth` (protege contra fuerza bruta a nivel de endpoint, complementario al bloqueo por cuenta).
- **Validación de entrada** con `zod` en cada endpoint que recibe body — nada llega a un controller sin pasar por un schema.
- **Manejador de errores centralizado**: traduce errores de Mongoose/JWT a respuestas HTTP consistentes, nunca expone un stack trace en producción.
- Un usuario **solo puede editar/eliminar su propia cuenta**, salvo que tenga rol `admin`.

---

## Endpoints disponibles

Todas las respuestas siguen la forma:

```json
{ "success": true, "message": "...", "data": { ... } }
```

o, en caso de error:

```json
{ "success": false, "message": "..." }
```

### `GET /health`

Chequeo de salud del servidor, sin autenticación.

```bash
curl http://localhost:4000/health
```

---

### `POST /api/auth/register`

Registra un usuario nuevo y devuelve un JWT.

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "SuperSecreta123"
  }'
```

**201 Created**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com", "role": "user", "createdAt": "...", "updatedAt": "..." },
    "token": "eyJhbGciOi..."
  }
}
```

**409 Conflict** si el correo ya existe. **400 Bad Request** si algún campo no pasa la validación (`name` ≥ 2 caracteres, `email` con formato válido, `password` ≥ 8 caracteres).

---

### `POST /api/auth/login`

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "ada@example.com", "password": "SuperSecreta123" }'
```

**200 OK** — mismo formato que el registro (`user` + `token`).

**401 Unauthorized** — credenciales inválidas (correo inexistente o contraseña incorrecta, mismo mensaje en ambos casos).

**423 Locked** — cuenta bloqueada por intentos fallidos:
```json
{
  "success": false,
  "message": "Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intenta de nuevo en 15 minuto(s)."
}
```

---

### `GET /api/auth/me`

Perfil del usuario autenticado.

```bash
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOi..."
```

**200 OK**
```json
{
  "success": true,
  "message": "Perfil obtenido correctamente",
  "data": { "user": { "id": "...", "name": "Ada Lovelace", "email": "ada@example.com", "role": "user" } }
}
```

**401 Unauthorized** sin token o con un token inválido/expirado.

---

### `GET /api/users`

Lista todos los usuarios (requiere estar autenticado).

```bash
curl http://localhost:4000/api/users \
  -H "Authorization: Bearer eyJhbGciOi..."
```

---

### `GET /api/users/:id`

```bash
curl http://localhost:4000/api/users/<id> \
  -H "Authorization: Bearer eyJhbGciOi..."
```

**404 Not Found** si el id no existe.

---

### `PATCH /api/users/:id`

Actualiza `name`/`email`. Solo el propio usuario o un `admin` pueden editar. Los campos `password`, `role`, `loginAttempts` y `lockUntil` se ignoran silenciosamente aunque vengan en el body (tienen sus propios flujos).

```bash
curl -X PATCH http://localhost:4000/api/users/<id> \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{ "name": "Ada K. Lovelace" }'
```

**403 Forbidden** si intentás editar a otro usuario sin ser `admin`.

---

### `DELETE /api/users/:id`

Elimina una cuenta. Mismo criterio de permisos que `PATCH`.

```bash
curl -X DELETE http://localhost:4000/api/users/<id> \
  -H "Authorization: Bearer eyJhbGciOi..."
```

**200 OK** con `data: null`. **403 Forbidden** si el usuario no es dueño de la cuenta ni `admin`.

---

## Notas para extender este boilerplate

- **Refresh tokens / logout real**: hoy el JWT es stateless puro (sin lista de revocación). Si tu proyecto necesita invalidar tokens antes de que expiren, agregá una colección de sesiones/refresh tokens — es una decisión de producto, no algo que este boilerplate asuma por vos.
- **Roles**: el schema ya tiene `role: 'user' | 'admin'` y el middleware `restrictTo(...roles)` listo para usarse; no hay ningún endpoint que lo use todavía a propósito (crear el primer admin es una decisión operativa de cada proyecto — normalmente un script/seed, no un endpoint público).
- **Cambio de contraseña**: no está implementado — es candidato natural para un endpoint nuevo (`PATCH /api/auth/password`) que reutilice `comparePassword`/el hook de hash ya existentes en el modelo.
- **Logger**: `src/utils/logger.js` es intencionalmente mínimo (sin dependencias). Si el proyecto crece, es un reemplazo directo por `pino`/`winston` sin tocar ningún call-site (`logger.info/warn/error/debug`).
