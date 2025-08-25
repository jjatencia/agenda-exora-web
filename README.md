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
Antes del despliegue asegúrate de definir las variables `NEXTAUTH_SECRET` y `NEXTAUTH_URL`,
ya que la aplicación lanzará un error si faltan.

## Datos
Actualmente las citas se obtienen de un mock en `app/api/appointments/data.ts`. Sustituye esa lógica por la fuente real cuando esté disponible.

## PWA
Se incluye manifest y configuración de `next-pwa` para service worker y cacheo básico.
