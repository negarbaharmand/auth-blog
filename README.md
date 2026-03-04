# Workshop – Bygg en frontend mot ett autentiserat API 🏗️

I den här workshopen bygger du ett React-frontend som kommunicerar [med ett befintligt Express-API](https://github.com/chasacademy-sandra-larsson/lektion_2026_03_03_middleware_auth) som innehåller resurserna `users` och `posts` och relationen att en user kan ha flera inlägg (one-to-many). Express-API:et innehåller även registrering och inloggning samt aktorisering av skyddade routes med JWT. 

Fokus ligger på tre saker:

1. Få förståelse för befintligt Express-API med Drizzle ORM, autentisering & JWT-token
2. Hur man gör fetch-anrop mot ett backend-API
3. Hur man sparar och använder en JWT-token i frontend
4. Hur man skyddar routes i React Router

---

## Förutsättningar ✅

- Backend-servern körs på `http://localhost:3000` (`cd server && npm run dev`)
- Du har grundläggande koll på React, useState, useEffect och fetch

---

## Steg 1 – Sätt upp projektet 🚀

Skapa ett nytt Vite-projekt med React och TypeScript:

```bash
npm create vite@latest client -- --template react-ts
cd client
npm install
```

Installera React Router 7 och Tailwind (valfritt):

```bash
npm install react-router
```


## Steg 2 – Sätt upp routing 🗺️

Skapa filen `src/routes.tsx`. Här samlar vi alla routes på ett ställe.

```tsx
// src/routes.tsx
import { Navigate } from "react-router";

const routes = [
  { index: true, element: <Navigate to="/posts" replace /> },
  { path: "/posts", element: <PostsPage> },
  { path: "/signin", element: <SignInPage> },
  { path: "/signup", element: <SignUpPage> },
];

export default routes;
```

Glöm inte att uppdatera `src/App.tsx` till att använda routern:


---

## Steg 3 – Registrering och inloggning 🔐

### Vad händer när en användare loggar in? 🤔

Backend returnerar ett **JWT-token** och ett användarobjekt:

```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "email": "test@test.se" }
}
```

Tokenet sparar vi i `localStorage` så att det finns kvar även om sidan laddas om:

```ts
localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));
```

Det är en fördel att returnera användarobjektet, så slipper man inte göra en extra HTTP-request när användardatat behövs.

### Skapa SignUpPage 📝

Skapa filen `src/pages/SignUpPage.tsx` och skapa ett formulär som gör en fetch med POST för att skickar `email` och `password` till servern

```tsx

  const API = "http://localhost:3000";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Något gick fel");
      return;
    }

    // Spara token och användare i localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/posts"); // importera useNavigate från React Router
  }
```

### Skapa SignInPage 🔑

Skapa `src/pages/SignInPage.tsx` på samma sätt, men anropa `/auth/signin` istället. Länken i botten ska gå till `/signup`.

> **Tips:** Skillnaden mot SignUpPage är bara vilken endpoint du anropar och texterna.

Glöm inte att lägga till sidorna i `src/routes.tsx`.

---

## Steg 4 – Visa inlägg (öppen route) 📰

Skapa `src/pages/PostsPage.tsx`. Den här sidan hämtar alla inlägg utan token — det är en öppen endpoint. Anropa `/posts` med fetch (GET-request) och rendera listan med alla inlägg.


Använd samma interface från drizzle-schemat i backend.

```tsx
interface Post {
  id: number;
  title: string;
  content: string;
  author: { id: number; email: string };
}
```

Verifiera att alla inlägg från databasen visas.

---

## Steg 5 – ProtectedRoute 🛡️

En `ProtectedRoute` är en komponent som kontrollerar om användaren är inloggad. Om inte, skickas hen vidare till inloggningssidan.

Skapa `src/components/ProtectedRoute.tsx`:

```tsx
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
```

`<Outlet />` renderar den matchade child-routen om token finns. Annars omdirigeras användaren.

Lägg till skyddade routes i `src/routes.tsx`:

```tsx
import ProtectedRoute from "./components/ProtectedRoute";

const routes = [
  // ... övriga routes
  {
    element: <ProtectedRoute />,
    children: [
      { path: "posts/new", element: <CreatePostPage> },
      { path: "posts/:id/edit", element: <EditPostPage> },
    ],
  },
];
```

Testa att gå till `/posts/new` utan att vara inloggad — du ska hamna på `/signin`.

---

## Steg 6 – Skapa inlägg (skyddad route) ✍️

Nu ska ni anropa ett skyddat API-anrop för att skapa ett inlägg som inloggad användare. Tokenet skickas med i `Authorization`-headern:


Skapa `src/pages/CreatePostPage.tsx` och använd dig av följande fetch

```tsx

  const API = "http://localhost:3000";

  const token = localStorage.getItem("token");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Något gick fel");
      return;
    }

    navigate("/posts");
  }
```

Uppdatera `posts/new`-routen i `src/routes.tsx` att använda `<CreatePostPage />`.

---

## Steg 7 – Redigera inlägg ✏️

### Uppgift 📋

Skapa `src/pages/EditPostPage.tsx`. Den ska:

1. Läsa `id` ur URL-parametern med `useParams<{ id: string }>()`
2. Hämta alla inlägg från `GET /posts` och hitta rätt inlägg via `id`
3. Fylla i formuläret med befintlig titel och innehåll
4. Skicka `PUT /posts/:id` med token i Authorization-headern vid submit

> **Tips:** Strukturen är nästan identisk med `CreatePostPage`, men du behöver en `useEffect` för att hämta och fylla i befintliga värden.

Uppdatera `posts/:id/edit`-routen i `src/routes.tsx` att använda `<EditPostPage />`.

---

## Steg 8 – Ta bort inlägg och logga ut 🗑️

### Ta bort inlägg 💣

Lägg till en delete-funktion i `PostsPage`:

```ts
async function handleDelete(id: number) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

Exempel på att visa redigera/ta bort-knappar bara för inläggets ägare:

```tsx
const user = JSON.parse(localStorage.getItem("user") ?? "null");

// I listan:
{user?.id === post.author.id && (
  <div className="flex gap-2 mt-3">
    <Link to={`/posts/${post.id}/edit`} className="text-sm text-indigo-600">
      Redigera
    </Link>
    <button onClick={() => handleDelete(post.id)} className="text-sm text-red-500">
      Ta bort
    </button>
  </div>
)}
```

### Logga ut 👋

Logga ut genom att ta bort token och användare ur localStorage:

```ts
localStorage.removeItem("token");
localStorage.removeItem("user");
window.location.reload();
```

---

## Klart! 🎉


## Extrauppgifter 🌟

**1. Navbar**
Skapa en `Navbar`-komponent som visas på alla sidor. Den ska visa länkar till inlägg och antingen inlogga/registrera-knappar eller logga ut beroende på om token finns. För att Navbar ska uppdateras reaktivt när man loggar in/ut behöver du troligen...

**2. AuthContext**
Flytta token och user-data till ett React Context istället för att läsa `localStorage` direkt i varje komponent. Detta sätt (eller Zustand som vi ska göra i nästa vecka) är ett bättre alternativ att ha inloggningsoinformation i globalt state än att hela tiden skriva/läsa till LocalStorage.

**3. Seeda databasen**
Seeda en databas innebär att populera testdata (mockdata). Detta kan göras med egna script, api som [Faker API](https://fakerapi.it/) eller med [Drizzle:s seed-funktionalitet](https://orm.drizzle.team/docs/seed-overview#drizzle-seed)

**3. React Hot Tost**
Använd dig Reactbiblioteket [React Hot Toast](https://react-hot-toast.com/) för s.k toast-notifieringar på olika händelser. Användaren är registrerad, inloggad, inlägg skapat / ändrat / tagits bort

**4. React Hook Form**
Använd dig av biblioteket [React Hoook Form](https://react-hook-form.com) för att simplifiera formulärhantering i React
