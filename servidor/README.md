# Servidor — opciones para alojar la radio online (100+ canciones)

## Fase 1 (actual): radio online por catálogo — suficiente para empezar
Cualquier hosting estático sirve `index.html + style.css + script.js + catalogo.json + /musica/`:
- **Gratis / barato:** GitHub Pages (límite 1 GB por repo, 100 MB por archivo), Codeberg Pages, Netlify, Cloudflare Pages + R2 (10 GB gratis, ideal para 500 MB de MP3), Backblaze B2 + Cloudflare.
- **Prueba local:** `python3 -m http.server 8000` en la carpeta del proyecto (abrir con `file://` bloquea `fetch` de `catalogo.json`).
- **Subida:** arrastra la carpeta al panel del hosting o usa `git push` / `rclone`.

100 MP3 a 128 kbps ≈ 400 MB. Comprime a Opus 96k si el hosting va justo.

## Fase 2 (24/7 sincronizado para todos) → ver `oracle/LEEME.md`
VPS Oracle Cloud Always Free (0 €) + Icecast + Liquidsoap como AutoDJ en aleatorio.
Pack listo en `servidor/oracle/`: `instalar.sh`, `icecast.xml`, `radio.liq`,
`metrallapunk.service`. Al terminar, pon la URL en `streamUrl` de `catalogo.json`.

## No hacer
- Hotlink a YouTube/SoundCloud/Bandcamp sin permiso explícito de alojamiento/emisión.
- Afirmar “100 canciones libres” sin registrar licencia de cada una.
