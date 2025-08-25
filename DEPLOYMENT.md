# Guía de Despliegue - Agenda Exora

## Variables de Entorno Requeridas

**CRÍTICO**: Estas variables DEBEN estar configuradas en producción para evitar errores 404:

```bash
# OBLIGATORIO - Secreto para NextAuth
NEXTAUTH_SECRET=tu_secreto_super_seguro_aqui

# OBLIGATORIO - URL de tu aplicación en producción
NEXTAUTH_URL=https://tu-dominio.com

# RECOMENDADO - URL base pública
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Configuración por Plataforma

### Vercel

**IMPORTANTE**: Antes de hacer deploy, asegúrate de tener instaladas las dependencias correctas:

```bash
npm install
```

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade estas variables EXACTAMENTE:
   ```
   NEXTAUTH_SECRET=tu_secreto_generado_con_openssl
   NEXTAUTH_URL=https://tu-proyecto.vercel.app
   NEXT_PUBLIC_BASE_URL=https://tu-proyecto.vercel.app
   ```
4. Ve a Deployments → Redeploy
5. Si el build falla, verifica que:
   - Las variables de entorno estén configuradas correctamente
   - NEXTAUTH_SECRET sea un string largo y aleatorio
   - NEXTAUTH_URL coincida exactamente con tu dominio de Vercel

**Solución de Problemas en Vercel**:
- Si ves errores de "Cannot find module", borra `.next` y `node_modules` localmente
- Asegúrate de que `next-auth` esté en versión 5.0.0-beta.4
- Verifica que no tengas imports incorrectos en el archivo de autenticación

### Netlify
1. Site settings → Environment variables
2. Añade las variables requeridas
3. Trigger new deploy

### Railway/Render/Otros
1. Busca la sección de Environment Variables
2. Añade las variables requeridas
3. Redeploy

## Verificación

Después del despliegue, visita:
- `https://tu-dominio.com/api/health` - Debe mostrar que las variables están presentes
- `https://tu-dominio.com` - Debe redirigir correctamente a `/login`
- `https://tu-dominio.com/login` - Debe mostrar el formulario de login

## Credenciales de Prueba

- Email: admin@example.com
- Password: password

## Solución de Problemas

Si sigues viendo errores 404:

1. **Verifica las variables de entorno** en el dashboard de tu proveedor
2. **Comprueba los logs** de tu aplicación
3. **Asegúrate de que NEXTAUTH_SECRET esté configurado** - sin esto NextAuth no funciona
4. **Verifica que NEXTAUTH_URL coincida exactamente** con tu dominio (incluyendo https://)

## Cambios Realizados

✅ Simplificados los redirects para usar rutas relativas
✅ Mejorada la configuración de NextAuth con callbacks seguros
✅ Añadido manejo de errores robusto en todas las páginas
✅ Simplificado el middleware
✅ Añadidos logs para debug en producción