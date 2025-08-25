import withPWA from 'next-pwa';

const nextConfig = {
  // Optimizaciones para producción
  experimental: {
    serverComponentsExternalPackages: ['next-auth'],
  },
  // Asegurar que las variables de entorno estén disponibles
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
