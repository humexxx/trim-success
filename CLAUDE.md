# CLAUDE.md

Guía para agentes que trabajan en este repo. Complementa el [README](README.md) con las convenciones internas y los gotchas que no se infieren del código.

---

## Qué es

TrimSuccess es una SPA React + Firebase. Un usuario sube un Excel, el cubo se construye en el backend (Cloud Functions) y se visualiza en dos módulos: **Inventario** (scorecard, drivers, rendimiento por categoría) y **Ventas** (resumen, tendencia mensual, portafolio). Multi-tenant: cada usuario tiene su propio cubo en su namespace de Firestore/Storage.

---

## Arquitectura — lo que no es obvio leyendo el código

### AuthContext es la única fuente de verdad

[src/context/AuthContext.tsx](src/context/AuthContext.tsx) expone:

- `currentUser` — usuario de Firebase Auth.
- `isAdmin` — del claim `admin` del ID token.
- `customUser` + `setCustomUser` — el usuario que un admin está **impersonando**. Se hidrata desde `localStorage` en el initializer del `useState` y se persiste vía el setter. **No uses `useLocalStorage` aparte para el mismo dato** — eso fue la causa de un bug histórico donde el dropdown y el contexto divergían.

`setCustomUser(null)` limpia ambos. `logout()` en `utils/auth.ts` también remueve la key — pero por defensa en profundidad, no porque sea necesario.

### CubeContext lee del usuario "efectivo"

[src/context/CubeContext.tsx](src/context/CubeContext.tsx) determina qué cubo cargar con `isAdmin ? customUser!.uid : currentUser!.uid`. No toca `localStorage` directamente — confía en que AuthContext ya hidrató `customUser`. Si modificas la lógica de impersonación, no agregues otra capa de lectura de storage aquí.

### Charts pasan por el wrapper de shadcn

Todos los charts usan `<ChartContainer>` de [src/components/ui/chart.tsx](src/components/ui/chart.tsx), que envuelve a recharts con CSS vars y estilos consistentes con la paleta del tema. Los colores de categoría salen de [src/lib/categoryColors.ts](src/lib/categoryColors.ts) — usa `colorForCategory(cat, allCategories)` para que el mismo SKU mantenga su tono entre vistas (área / barra / radial).

Las 5 variables `--chart-1` a `--chart-5` están en [src/index.css](src/index.css) con valores distintos para light/dark.

### Rutas pasan por el constante centralizado

[src/lib/consts.ts](src/lib/consts.ts) tiene:

- `ROUTES` — todas las rutas. Nunca hardcodees paths en `Link`/`navigate`.
- `DEV_ACCOUNTS` + `DEV_ACCOUNT_EMAILS` — cuentas demo. Compartido entre el sign-in (botones "Entrar como X") y el filtro del picker de impersonación. Si agregas/quitas una cuenta demo, **solo edita este array** y corre `npm run seed:demo`.
- `LOCAL_STORAGE_KEYS` — claves de localStorage.
- `APP_NAME`, `APP_TAGLINE`, `APP_DESCRIPTION` — branding.

### Páginas usan PageWrapper

[src/components/layout/Page.tsx](src/components/layout/Page.tsx) (exportado como `PageWrapper`) ya:

- Aplica el container `mx-auto px-4 max-w-screen-xl` (1280px por defecto).
- Llama a `useDocumentMetadata` para el `<title>` y `<meta name="description">`.

**No duplicar** — si la página llama a `<PageWrapper title="X" description="...">`, no necesita un `useDocumentMetadata` aparte.

### Layouts incluyen ImpersonationBanner

[InventoryLayout](src/layouts/InventoryLayout.tsx) y [SalesLayout](src/layouts/SalesLayout.tsx) renderizan `<ImpersonationBanner />` arriba del `<Outlet />`. El banner se auto-oculta si no hay impersonación activa o si la ruta actual es el picker.

### Sign-in routea según el claim del token, no según AuthContext

[src/pages/auth/sign-in/Page.tsx](src/pages/auth/sign-in/Page.tsx) lee `getIdTokenResult()` directo después del `signInWithEmailAndPassword` para decidir el destino (`/impersonate` si admin, `/module-selector` si no). Esto evita el flash que habría si esperara a que `onAuthStateChanged` en AuthContext setea `isAdmin`.

`AutoLogRoute` aplica el mismo criterio para usuarios ya logueados que abren `/login`.

---

## Convenciones de código

### Estructura de carpetas

Cada feature vive en `src/pages/<area>/<feature>/`:

```
Page.tsx          # Punto de entrada de la ruta
components/       # Componentes locales del feature
hooks/            # Hooks locales
index.ts          # Re-exports
```

Componentes verdaderamente compartidos van en `src/components/`. Primitives de UI (Button, Card, Input) en `src/components/ui/` — son shadcn, NO los reescribas, instala más con `npx shadcn-ui add <name>` si necesitas algo nuevo.

### Imports

Hay dos aliases:

- `src/...` — imports desde la raíz de `src/`.
- `@/...` — alias específico para shadcn (`@/components/ui/...`, `@/lib/utils`).

Mantén la consistencia con los archivos vecinos. Shared types/enums viven en `@shared/*`.

### Commit messages

Conventional Commits **obligatorios** — `commitlint` bloquea en pre-commit y en CI. Lee [CONTRIBUTING.md](CONTRIBUTING.md). En resumen:

- `feat:` → minor bump, aparece en CHANGELOG
- `fix:` / `perf:` → patch
- `refactor:` / `docs:` → no bump, aparece
- `style:` / `test:` / `chore:` / `build:` / `ci:` → no bump, oculto

### Estilo

- Tailwind con `cn(...)` de [@/lib/utils](src/lib/utils.ts) para clases condicionales.
- Comentarios solo cuando el "por qué" no es obvio. Nada de docstrings narrativos.
- Sin emojis a menos que el usuario los pida.

---

## Backend

Las Cloud Functions están en [functions/src/](functions/src/), agrupadas por dominio (`cubeFunctions`, `aiFunctions`, `reportsFunctions`, `userFunctions`, `adminFunctions`). El frontend las invoca vía `httpsCallable` desde [src/lib/firebase.ts](src/lib/firebase.ts).

Tipos compartidos entre frontend y functions viven en [shared/](shared/) — cuando cambies un modelo, ambas partes recompilán contra la misma fuente.

---

## Scripts útiles

- `npm run seed:demo` — Crea/actualiza las cuentas Demo + Admin en Auth y Firestore. Requiere `GOOGLE_APPLICATION_CREDENTIALS` apuntando a un service account JSON (ver `.envrc.example`).
- `npx tsx scripts/seed-cube-from-xlsx.ts` — Carga un cubo de prueba a partir de un Excel.
- `npx tsx scripts/repro-init-cube.ts` — Repro stand-alone del flujo de init de cubo, útil para debug del backend sin pasar por la UI.

---

## Gotchas

- **`PageWrapper` ya hace `useDocumentMetadata`.** Si la página vuelve a llamarlo, el último gana — y como ambos pegan al unmount, vas a ver títulos parpadeando. Usa una sola fuente.
- **El cube se recarga cuando cambia `customUser.uid`.** Si haces logic que depende del cube, asegúrate de invalidar o re-fetchear cuando un admin cambia de impersonación.
- **Los charts re-montan en cada cambio de slide en `AuthChartSlideshow`** (key prop) — pero los del producto en `/inventory` y `/sales` NO. Para esos, recharts interpola valores entre renders cuando cambian los `data` props.
- **Los emails demo (`*@trim-success.test`) son TLD reservado** — no envíes correo real ni intentes verificarlos. Si quieres testear flujos de email (forgot-password), usa un email real temporalmente.
- **El admin claim solo se actualiza en el siguiente sign-in.** Si corres `seed:demo` mientras el admin está logueado, debe cerrar sesión y volver a entrar para que `isAdmin` refleje el cambio.
- **Firestore rules ven `admin: true` en custom claims**, no en el doc de `/users`. Si seedeas usuarios y olvidas el claim, no podrán leer cubos ajenos.
