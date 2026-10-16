// Apunta el catálogo a las URLs públicas de R2 sin romper el modo local.
// Uso: node aplicar-urls.mjs https://pub-xxx.r2.dev
// Deja `archivo` (localhost) y añade `url` (GitHub Pages la prefiere).
import { readFileSync, writeFileSync } from 'node:fs';

const base = (process.argv[2] || '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) { console.error('Pasa la URL pública, ej: node aplicar-urls.mjs https://pub-xxx.r2.dev'); process.exit(1); }
const path = new URL('../../catalogo.json', import.meta.url).pathname;
const cat = JSON.parse(readFileSync(path, 'utf8'));
for (const t of cat.pistas) {
  const nombre = t.archivo.split('/').pop();
  t.url = `${base}/musica/${encodeURIComponent(nombre)}`;
}
writeFileSync(path, JSON.stringify(cat, null, 2) + '\n');
console.log(`OK: ${cat.pistas.length} pistas → ${base}/musica/…`);
console.log('Comprueba una URL en el navegador, luego: git add catalogo.json && git commit -m "Catálogo con URLs R2" && git push');
