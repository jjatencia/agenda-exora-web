# Agenda Exora Web

PWA creada con Next.js 14, TypeScript y Tailwind CSS. Incluye autenticación con NextAuth y datos de citas mock.

## Scripts
- `pnpm dev` – desarrollo
- `pnpm build` – build
- `pnpm start` – producción
- `pnpm lint` – lint
- `pnpm test` – tests

## Variables de entorno
Crea un fichero `.env` basado en `.env.example`.

## Datos
Actualmente las citas se obtienen de un mock en `app/api/appointments/data.ts`. Sustituye esa lógica por la fuente real cuando esté disponible.

## PWA
Se incluye manifest y configuración de `next-pwa` para service worker y cacheo básico.
