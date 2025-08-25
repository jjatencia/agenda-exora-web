# agenda-exora-web

## Migración de agenda-exora a PWA

Este repositorio sirve como punto de partida para portar la aplicación Expo/React Native **agenda-exora** a una Aplicación Web Progresiva (PWA) en React, CSS y JavaScript estándar. A continuación se resume la arquitectura del proyecto original y las tareas necesarias para la migración.

### 1. Dependencias y scripts
- Expo 53, React 19, React Native 0.79
- Librerías adicionales: `react-native-gesture-handler`, `react-native-reanimated`, `react-native-calendars`, `react-native-modal`, `dayjs`
- Scripts típicos de Expo (`npm start`, `expo start --web`, etc.)

### 2. Navegación
- `app/_layout.js`: Stack sin cabecera, envuelve la app en `GestureHandlerRootView` y `ThemeProvider`.
- `app/index.js`: redirige a `login.js` (pantalla de inicio de sesión).

### 3. Pantalla de Inicio de Sesión (`app/login.js`)
- Manejo de estados de email/contraseña y checkbox "Recordarme".
- Al validar, navega a `/agenda`.
- UI: `SafeAreaView` con estilos en línea, logo, campos de texto y botón "Entrar".

### 4. Pantalla de Agenda (`app/agenda/index.js`)
- Navegación por citas día a día con gestos horizontales (`Gesture.Pan`).
- Uso de Haptics para feedback y `dayjs` para formatear fechas.
- Controles: botón "Hoy" y modal de selección de fecha (`DatePickerModal`).
- Renderiza la lista de citas (`SwipeCard`) o `EmptyState` si no hay citas.

### 5. Componentes reutilizables
- **SwipeCard**: datos de la cita y botón "no show".
- **DatePickerModal**: calendario (`react-native-calendars`) dentro de `react-native-modal`.
- **EmptyState**: mensaje cuando no existen citas en la fecha actual.

### 6. Datos de ejemplo
- `lib/mockCitas.js`: objeto `citasByDate` con citas ficticias agrupadas por fecha.
- Función `getCitasByDate(fecha)` para obtener las citas del día.

### 7. Tema visual
- `src/theme/exora.js`: paleta de colores, radios, espaciados y tipografía (Work Sans).

## Objetivo de la migración a PWA

### A. Configuración del entorno
- Crear una app React (Vite, CRA) o usar el soporte web de Expo.
- Añadir `manifest.json` y registrar un Service Worker (p. ej. Workbox) para modo offline e instalación.

### B. Conversión de UI
- Opciones: reutilizar componentes RN vía `react-native-web` o reescribir con HTML/JSX + CSS.
- Reemplazar `StyleSheet` por CSS Modules, Styled Components o variables CSS.
- Sustituir librerías nativas:
  - `expo-haptics` → `navigator.vibrate`
  - `react-native-gesture-handler` → eventos `Pointer/Touch` o `react-use-gesture`
  - `react-native-reanimated` → `framer-motion`, GSAP o animaciones CSS

### C. Navegación
- Usar `react-router` o `expo-router` sobre Expo web.
- Replicar las rutas `/login`, `/agenda`, etc.

### D. Funciones y datos
- Mantener la lógica de negocio y módulos no dependientes de móvil.
- Adaptar APIs nativas a equivalentes web o polyfills.
- Portar `lib/mockCitas.js` a un servicio o API REST conservando la estructura.

### E. Compilación y despliegue
- Ajustar `package.json` con scripts `npm run build` y `npm run serve`.
- Configurar CI para generar la PWA.
- Asegurar que la versión web pasa linters y pruebas.

## Recomendaciones
- Migrar de forma incremental, pantalla por pantalla.
- Conservar interacciones (gestos, animaciones, selección de fechas, navegación).
- Mantener el tema visual usando CSS variables o Tailwind.
- **login.js**: crear formulario HTML semántico, validar campos y redirigir al calendario.
- **agenda/index.js**: renderizar citas en una lista DOM, usar `react-use-gesture` o eventos `Pointer` para swipes, botón "Hoy", modal de calendario (`react-date-picker` o similar).
- Implementar Service Worker + manifest para modo offline e instalación.

## Resultado esperado
- PWA con pantalla de login y agenda de citas navegable día a día.
- Componentes: tarjetas de citas, modal de calendario y estado vacío.
- Estilos acordes al tema `exora`.
- Arquitectura React + CSS + JS con soporte offline e instalación.

Este archivo sirve como prompt base para que una IA generadora de código continúe la migración en este repositorio.
