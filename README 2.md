# Middleware & Auth – Express API

Ett REST-API byggt med Express, TypeScript, Drizzle ORM och PostgreSQL. Demonstrerar JWT-autentisering och skyddade routes med middleware.

## Kom igång

### Krav

- Node.js
- PostgreSQL (lokalt eller via t.ex. Supabase)

### Installation

```bash
cd server
npm install
```

### Miljövariabler

Skapa en `.env`-fil i `server/`-mappen:

```env
PORT=3000
DATABASE_URL=postgres://@localhost:5432/din_databas
JWT_SECRET=ditt_hemliga_värde
```

### Skapa databasen

```bash
npm run db:push
```

### Starta servern

```bash
npm run dev
```

Servern körs på `http://localhost:3000`.

---

## API-endpoints

### Auth

#### `POST /auth/signup` — Registrera ny användare

**Body:**
```json
{
  "email": "user@example.com",
  "password": "lösenord123"
}
```

**Svar (201):**
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "email": "user@example.com" }
}
```

---

#### `POST /auth/signin` — Logga in

**Body:**
```json
{
  "email": "user@example.com",
  "password": "lösenord123"
}
```

**Svar (200):**
```json
{
  "token": "<jwt>",
  "user": { "id": 1, "email": "user@example.com" }
}
```

---

### Posts

#### `GET /posts` — Hämta alla inlägg (publik)

**Svar (200):**
```json
[
  {
    "id": 1,
    "title": "Mitt inlägg",
    "content": "Text här",
    "author": { "id": 1, "email": "user@example.com" }
  }
]
```

---

#### `POST /posts` — Skapa inlägg (kräver JWT)

**Header:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Mitt inlägg",
  "content": "Text här"
}
```

**Svar (201):** Det skapade inlägget.

---

#### `PUT /posts/:id` — Redigera inlägg (kräver JWT, måste vara ägare)

**Header:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Uppdaterad titel",
  "content": "Uppdaterad text"
}
```

**Svar (200):** Det uppdaterade inlägget.

---

#### `DELETE /posts/:id` — Ta bort inlägg (kräver JWT, måste vara ägare)

**Header:**
```
Authorization: Bearer <token>
```

**Svar (204):** Tomt svar.

---

## Sammanfattning

| Metod  | Route          | Auth              | Beskrivning              |
| ------ | -------------- | ----------------- | ------------------------ |
| POST   | /auth/signup   | —                 | Registrera användare     |
| POST   | /auth/signin   | —                 | Logga in, få JWT         |
| GET    | /posts         | —                 | Hämta alla inlägg        |
| POST   | /posts         | Bearer token      | Skapa inlägg             |
| PUT    | /posts/:id     | Bearer token      | Redigera eget inlägg     |
| DELETE | /posts/:id     | Bearer token      | Ta bort eget inlägg      |

## Teknikstack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Databas:** PostgreSQL via Drizzle ORM
- **Auth:** JWT (`jsonwebtoken`) + lösenordshashning (`bcrypt`)
- **Logging:** Morgan
