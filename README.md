# Compostela Móvil · Herramientas comerciales

Aplicación React para herramientas de apoyo comercial. La primera herramienta es un simulador orientativo de financiación con resumen de cuotas, calendario de amortización, descarga CSV e impresión.

## Desarrollo

```bash
npm install
npm run dev
```

## Despliegue

- **Vercel:** importa el repositorio y deja el preset Vite, el comando de compilación `npm run build` y la carpeta de salida `dist`. Añade el subdominio deseado en la configuración de dominios del proyecto y crea en el DNS del dominio el registro que indique Vercel.
- **GitHub Pages:** el workflow incluido compila y publica la rama `main`. En GitHub, selecciona `Settings → Pages → Build and deployment → GitHub Actions`.

El archivo `vercel.json` deja configurado el despliegue de Vercel. La web no recopila ni envía los valores introducidos. Las estimaciones no son una oferta vinculante y excluyen costes que no estén especificados.
