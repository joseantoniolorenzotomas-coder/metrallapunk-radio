# Carpeta /musica — catálogo de la radio online

Aquí van los 100+ archivos de audio del servidor.

## Formato recomendado
- MP3 128–192 kbps u Opus/OGG para ahorrar espacio. 100 canciones ≈ 400–700 MB.
- Nombre: `artista-titulo.mp3` en minúsculas, sin espacios (usa `-`).

## Cómo añadir una pista verificada
1. Verifica que la licencia permite alojamiento + comunicación pública como radio online.
2. Copia el archivo aquí, ej: `musica/grupo-cancion.mp3`.
3. Añade la entrada en `../catalogo.json`:
```json
{
  "id": "grupo-cancion",
  "titulo": "Nombre canción",
  "artista": "Grupo",
  "archivo": "musica/grupo-cancion.mp3",
  "origenUrl": "https://origen-oficial/descarga",
  "licencia": "CC BY 4.0",
  "licenciaUrl": "https://creativecommons.org/licenses/by/4.0/",
  "atribucion": "Grupo — Canción (CC BY 4.0)",
  "permiteEmisionOnline": true,
  "evidencia": "enlace o archivo de permiso guardado"
}
```
4. No añadas nada sin evidencia. Estado actual: 0 pistas — no afirmar que ya hay 100.

## Fuentes para buscar (verificar una por una)
- Jamendo Licensing / Jamendo Community (filtrar por licencia que permita emisión).
- Free Music Archive (FMA), ccMixter, Internet Archive (dominio público / CC).
- Netlabels y bandas que autoricen por escrito la emisión online.
