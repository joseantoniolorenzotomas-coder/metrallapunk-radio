# Subir los 1.7 GB a Cloudflare R2 por consola (gratis, 10 GB)

## 1. En el panel de Cloudflare (solo esta vez, 5 min)
1. Crea cuenta en cloudflare.com → menú **R2** → **Create bucket** `metrallapunk`.
2. En el bucket: **Settings → Public access → Allow Access** (activa el dominio `*.r2.dev`).
   Apunta el dominio público, ej: `https://pub-xxxx.r2.dev`.
3. **Manage API tokens → Create token** con permiso **Object Read & Write** en ese bucket.
   Apunta: endpoint `https://<account-id>.r2.cloudflarestorage.com`, key y secret.

## 2. Por consola (desde `servidor/r2/`)
```bash
cd servidor/r2
npm install
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com \
R2_KEY=tu-key R2_SECRET=tu-secret R2_BUCKET=metrallapunk \
node subir.mjs
```
Sube con multipart (archivos de 300 MB sin problema) y omite lo ya subido: puedes
cortar y repetir. Tardará según tu subida (1.7 GB).

## 3. Apuntar el catálogo y publicar
```bash
node aplicar-urls.mjs https://pub-xxxx.r2.dev
# abre una URL en el navegador para comprobar que suena el MP3
cd ../..
git add catalogo.json && git commit -m "Catálogo con URLs R2" && git push
```
La web prefiere `url` (remota) y usa `archivo` (local) como respaldo: sonará en
localhost y en GitHub Pages sin cambiar nada más.

## Coste
R2 gratis: 10 GB de almacenamiento + 10 M peticiones/mes. 1.7 GB cabe de sobra.
