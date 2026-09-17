# Currículum — Soumia Ablam

Página web tipo currículum para **Soumia Ablam — Desarrolladora Web Junior**.
Desplegada en Cloudflare Workers con assets estáticos (HTML + CSS + TypeScript).

## 📁 Estructura

```
cv-soumia/
├── src/
│   └── index.ts          # Worker que sirve los archivos estáticos
├── public/
│   ├── index.html        # Página del currículum
│   ├── styles.css        # Estilos
│   ├── script.js         # Lógica para subir foto (navegador)
│   └── foto.jpg          # ← REEMPLAZA con tu foto
├── wrangler.toml         # Configuración de Cloudflare Workers
├── package.json
└── tsconfig.json
```

## 🚀 Cómo desplegar

```bash
# 1. Instalar dependencias
npm install

# 2. Probar localmente
npm run dev

# 3. Desplegar a Cloudflare Workers
npm run deploy
```

Tu página quedará en: `mywebpage.soumia-abdelaati-lamrahi.workers.dev`

## 📸 Subir tu foto

1. Reemplaza `public/foto.jpg` con tu foto (mismo nombre)
2. O usa el botón "📸 Haz clic para subir tu foto" en la página (solo visible en el navegador, no se guarda en el servidor)
3. Vuelve a desplegar con `npm run deploy`

## ✏️ Personalizar

- **Texto**: edita `public/index.html`
- **Colores**: edita `public/styles.css`
- **Links**: cambia los `href` de LinkedIn y GitHub en `index.html`
- **Sin correo electrónico**: a propósito, no se incluye ningún email en la página