# Documentación — metrallapunk-radio (radio online)

## 1. Qué es ahora
Radio online con catálogo propio en servidor: `index.html` + `style.css` + `script.js` cargan `catalogo.json` y reproducen `/musica/`. El oyente pulsa **Encender radio** y escucha sin aportar archivos. El modo local (subir archivos propios) queda solo como respaldo.

**Estado comprobado (HTTP)**: Catálogo accesible en `http://localhost:8000`. **40 pistas** registradas en `catalogo.json`, **41 archivos** en `/musica/` (0 referencias rotas). Requiere servir por HTTP (el `fetch` falla con `file://`). Aún **0 pistas verificadas legalmente** — no afirmar que hay 100 hasta completar las verificaciones correspondientes.

## 2. Cómo probarla
**Forma fácil (recomendada):** doble clic en `iniciar.command` (macOS) o
`python3 servir.py`. Abre el navegador solo y elige un puerto libre (8000, 8001…):
no falla aunque ya tengas otro servidor abierto. Además soporta peticiones
*Range*, así que puedes avanzar dentro de una canción igual que en un hosting real.

**Forma manual:**
1. Sirve la carpeta por HTTP (el `fetch` de `catalogo.json` falla con `file://`):
   `python3 -m http.server 8000` → abre `http://localhost:8000`
   Si sale `OSError: [Errno 48] Address already in use`, ya hay algo en el 8000:
   usa `python3 -m http.server 8001` u otro número.
2. Pulsa **Encender radio**. La interacción inicial la exige el navegador.
3. Usa pausa, volumen y el botón **Créditos** para ver el catálogo.
4. Respaldo local: **＋ Archivos propios** reproduce archivos de tu equipo sin subirlos.

## 3. Servidor y despliegue (100 canciones)
Ver `servidor/README.md` y `musica/README.md`.
- Fase 1: hosting estático cualquiera (GitHub/Codeberg Pages, Netlify, Cloudflare Pages+R2). Sube todo el proyecto incluida `/musica/`.
- 100 canciones ≈ 400–700 MB en MP3 128–192 kbps. R2 (10 GB gratis) es la opción gratuita más holgada.
- Fase 2 (24/7 sincronizado): VPS + AzuraCast o Icecast+Liquidsoap, y pon su URL en `streamUrl` de `catalogo.json`.

## 4. Cómo llegar a las 100 canciones legales
Solo vale dominio público o licencia explícita que permita alojamiento + comunicación pública como radio online. Para cada pista registra en `catalogo.json`: título, artista, archivo, URL de origen, licencia exacta + URL, atribución, si permite emisión online y evidencia del permiso.

Fuentes para buscar (verificar una por una): Jamendo, Free Music Archive, ccMixter, Internet Archive, netlabels y permisos directos por escrito.

**No basta “sin copyright”.** NC puede prohibir ciertos usos, ND restringe adaptaciones. Si hay duda, pide permiso directo y guarda la evidencia.

## 5. Estructura del proyecto
- `index.html`: interfaz de la radio online.
- `style.css`: estilos.
- `script.js`: carga `catalogo.json`, mezcla y reproduce.
- `catalogo.json`: catálogo (todas las pistas con licencia).
- `musica/`: audios del servidor + README.
- `servidor/README.md`: opciones de hosting y streaming 24/7.
- `AGENTS.md`: reglas para agentes. `MEMORY.md`: decisiones. `constitution.md`: principios.

## 6. Mejoras futuras
- Completar 100 pistas verificadas con créditos visibles.
- Historial de reproducción y “Ahora suena”.
- `streamUrl` en directo (Icecast/AzuraCast) con reconexión.
- Página “Sobre la radio” y manifiesto.
- Pruebas en Safari, Firefox, Chrome y móviles.
