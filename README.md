# Portfolio de Soumia Abdelaati Lamrahi

Portfolio profesional para una desarrolladora web junior, desplegable en Cloudflare Workers.

## Desarrollo y despliegue

```bash
npm install
npm run dev
npm run deploy
```

## Imagen y currículums

- Para mostrar una foto desde el primer momento, añade `public/foto.jpg` y vuelve a desplegar.
- El área de edición está en el punto discreto situado al centro, bajo el pie de página. Desde ahí se pueden cargar una foto, cuatro CV en PDF y los enlaces de tres proyectos.
- En modo local, `npm run dev` inicia un servidor de demostración que guarda los cambios en `data/content.json`. Las fotos, PDFs y datos permanecen al recargar o reiniciar el servidor local.
- El servidor local está pensado solo para la demostración en tu ordenador. Para publicar y conservar estos cambios en Internet habría que conectar almacenamiento persistente (R2/D1).

## Acceso de administración

El correo y la contraseña no se incluyen en el código público. Antes de desplegar, configura los secretos en Cloudflare:

```bash
npx wrangler secret put ADMIN_EMAIL
npx wrangler secret put ADMIN_PASSWORD
```

El Worker verifica esas dos variables en `POST /api/login`. No guardes contraseñas en `public/script.js` ni en el repositorio.
