# TrimSuccess

Plataforma web para analizar el costo de mantener inventario y el comportamiento de ventas sobre un único cubo de datos cargado desde Excel. Scorecard, drivers, rendimiento por categoría y resumen de ventas, todo sincronizado.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Estilos | Tailwind CSS + shadcn/ui (Radix) |
| Charts | Recharts (via shadcn `ChartContainer`) |
| Forms | React Hook Form + Yup |
| Routing | React Router v6 |
| Backend | Firebase (Auth + Firestore + Functions + Storage) |
| Test E2E | Playwright |
| Release | `standard-version` + Conventional Commits |

---

## Getting started

### 1. Variables de entorno

```bash
cp .env.example .env
```

Rellena las credenciales del proyecto Firebase (Project Settings → General → SDK setup).

### 2. (Opcional) Service account para scripts de admin

Algunos scripts (`npm run seed:demo`, `repro-init-cube.ts`) y `firebase deploy` necesitan credenciales con permisos sobre el proyecto. La forma recomendada usa `direnv` para que cada repo cargue las suyas sin contaminar tu gcloud global:

```bash
cp .envrc.example .envrc
# Edita .envrc y apunta GOOGLE_APPLICATION_CREDENTIALS a tu service account JSON
direnv allow
```

Setup completo en los comentarios de [.envrc.example](.envrc.example).

### 3. Instalar y correr

```bash
npm install
npm run dev          # http://localhost:5173
```

---

## Cuentas demo

En desarrollo, el sign-in muestra dos botones "Entrar como Demo" / "Entrar como Admin". Los emails y passwords viven en [src/lib/consts.ts](src/lib/consts.ts) bajo `DEV_ACCOUNTS`:

| Rol | Email | Password |
|-----|-------|----------|
| Demo | `demo@trim-success.test` | `Demo1234!` |
| Admin | `admin@trim-success.test` | `Admin1234!` |

Para crear (o resetear) estas cuentas en Firebase Auth + Firestore:

```bash
npm run seed:demo
```

El script es idempotente: crea/actualiza ambos usuarios, fija el claim `admin: true` y upsertea los docs `/users/{uid}` con metadata (nombre, descripción) que el picker de impersonación lee.

---

## Project structure

```
src/
├── pages/                     # Vistas por ruta
│   ├── auth/                  # sign-in, sign-up, forgot-password
│   ├── inventory/             # dashboard, scorecard, data-mining, etc.
│   ├── sales/
│   ├── admin/                 # user-select (impersonación), testing
│   ├── LandingPage.tsx
│   └── ModuleSelector.tsx
├── components/
│   ├── ui/                    # shadcn primitives (Button, Card, Chart, …)
│   ├── layout/                # PageWrapper, PageHeader, PageContent
│   ├── auth/                  # AuthLayout, AuthChartSlideshow
│   ├── ImpersonationBanner.tsx
│   └── ...
├── context/                   # AuthContext, CubeContext, LocalThemeContext
├── hooks/                     # useLocalStorage, useCubeSummary, useDocumentMetadata
├── layouts/                   # InventoryLayout, SalesLayout, ModuleSelectLayout
├── lib/                       # consts, routes, firebase init, formatters
└── utils/                     # auth helpers, etc.

shared/                        # Tipos + enums + utils compartidos con functions/
functions/                     # Firebase Cloud Functions (cube, ai, reports, user, admin)
scripts/                       # Seed + repro scripts (corren con tsx)
e2e/, tests/                   # Playwright
public/                        # Assets estáticos
```

---

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compila TS + bundle de producción
npm run lint         # ESLint (CI usa --max-warnings 0)
npm run lint:fix
npm run preview      # Sirve el build de producción local

npm run test:e2e     # Playwright headless
npm run test:e2e:ui  # Playwright en modo UI

npm run seed:demo    # Crea/actualiza las cuentas demo (requiere SA)

npm run release      # standard-version local (commits + tag, sin push)
npm run release:dry  # Muestra qué bump haría sin tocar nada
```

---

## Auth + impersonación

- **AuthContext** ([src/context/AuthContext.tsx](src/context/AuthContext.tsx)) es la única fuente de verdad para el usuario actual y la impersonación activa. `customUser` se hidrata desde `localStorage` en el initializer y se persiste vía `setCustomUser` — así un refresh mantiene la impersonación.
- **Admin → impersonar**: al loguearse como admin, el sign-in redirige directo a `/inventory/admin/impersonate`. El picker filtra a los usuarios cuyo email está en `DEV_ACCOUNT_EMAILS` y excluye al propio admin.
- **Indicadores**: cuando hay impersonación activa, el header muestra un chip amber con botones para cambiar/salir, y cada página dentro de `/inventory` y `/sales` renderiza un banner persistente arriba.
- Sin impersonación, el admin no puede acceder al selector de módulos: `ModuleSelector` redirige a `/impersonate` y los links de "Módulos" (sidebar + breadcrumb) aparecen disabled.

---

## Releases

Lee [CONTRIBUTING.md](CONTRIBUTING.md). TL;DR: Conventional Commits, `standard-version` corre en CI sobre `main` y bumpea + taguea solo.

---

## Firebase

Proyecto: `trim-success`. Configuración en [firebase.json](firebase.json), reglas en [firestore.rules](firestore.rules), funciones en [functions/](functions/).

Para deploy local de funciones o reglas:

```bash
firebase deploy --only functions
firebase deploy --only firestore:rules
```

(Ambos requieren el SA cargado vía `.envrc`.)
