const createNextIntlPlugin = require('next-intl/plugin');

/**
 * @type {import('next').NextConfig}
 */
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    output: "standalone",
  
    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,
  
    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,
  
    // Optional: Change the output directory `out` -> `dist`
    distDir: "dist",
    compress: false,
    
   
  };
  
  module.exports = withNextIntl(nextConfig);
  