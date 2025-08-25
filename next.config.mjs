import withPWA from 'next-pwa';

const nextConfig = {
  // Configuración específica para Vercel
  experimental: {
    serverComponentsExternalPackages: ['next-auth'],
  },
  // No incluir variables de entorno secretas en el build
  // Vercel las manejará automáticamente
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
