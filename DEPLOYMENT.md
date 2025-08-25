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
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Añade las variables mencionadas arriba
4. Redeploy tu aplicación

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