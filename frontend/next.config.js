/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: "export",
  
    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,
  
    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,
  
    // Optional: Change the output directory `out` -> `dist`
    distDir: "dist",
    compress: false,
    i18n: {
      locales: ['en', 'es'], // Reemplaza estos códigos de idioma con los que desees usar
      defaultLocale: 'en', // Establece el idioma predeterminado
      // Puedes añadir más configuraciones específicas de i18n aquí si es necesario
  },
  };
  
  module.exports = nextConfig;
  