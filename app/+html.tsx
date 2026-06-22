import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    // Cambiado a español por accesibilidad y SEO
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Previene el scroll del body en web para imitar el comportamiento nativo */}
        <ScrollViewStyleReset />

        {/* CSS Inyectado para sincronizar el fondo con el Tailwind Config antes del render */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// Colores sincronizados con tu tailwind.config.js (surface y brand.municipalidad)
const responsiveBackground = `
body {
  background-color: #FFFFFF; 
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1A1B1E;
  }
}`;

