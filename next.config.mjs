import withPWA from 'next-pwa';

const nextConfig = {
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ['es-ES'],
    defaultLocale: 'es-ES',
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
