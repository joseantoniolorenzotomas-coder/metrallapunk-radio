# Agentes del proyecto — metrallapunk-radio

## Objetivo
Construir una radio web online gratuita y autogestionada dedicada a punk, ska, Oi!, cantautores y música libertaria/combativa, con catálogo propio de al menos 100 canciones gratuitas alojadas en servidor y emisión accesible desde la web sin que el oyente tenga que subir archivos. La música debe ser de dominio público cuando corresponda o contar con una licencia explícita compatible con emisión online, comunicación pública y alojamiento/redistribución, con los permisos necesarios.

## Reglas generales
- Priorizar software libre, estándares web y alojamiento gratuito/coste mínimo cuando sea viable.
- No asumir que una canción es libre por estar en YouTube, SoundCloud, Bandcamp o por tener una etiqueta informal de “sin copyright”.
- Registrar para cada pista en `catalogo.json`: título, artista, archivo/URL, URL de origen, licencia exacta + URL, atribución requerida, si permite comunicación pública y alojamiento, y prueba de permiso.
- Respetar las condiciones de Creative Commons: algunas licencias prohíben uso comercial (NC) o versiones modificadas (ND); revisar cada caso. Solo incorporar pistas cuya licencia permita explícitamente el uso como radio online.
- No descargar ni alojar ni retransmitir música de servicios sin permiso.
- Mantener accesibilidad, diseño adaptable a móvil y controles visibles.
- La radio online debe reproducir el catálogo del servidor (`catalogo.json` + `/musica/`), mezclar las pistas y continuar hasta agotar la lista; después vuelve a mezclarla. El modo local (subir archivos propios) queda solo como respaldo, no como fuente principal.
- Un navegador no puede reproducir audio automáticamente antes de una interacción del usuario en muchos dispositivos. Mantener el botón “Encender radio”.
- La web es la interfaz de la radio online: el catálogo vive en el servidor y cualquier oyente escucha lo mismo sin aportar archivos. Si además se quiere emisión 24/7 sincronizada para todos (mismo punto de escucha), se necesita servidor de streaming (Icecast/AzuraCast) + fuente continua; documentarlo como fase 2.

## Flujo de trabajo
1. El planificador divide el trabajo en tareas pequeñas.
2. El coordinador mantiene coherencia entre tareas y documentación.
3. El implementador programa y prueba.
4. El revisor comprueba seguridad, accesibilidad, legalidad y funcionamiento.
5. Actualizar `MEMORY.md` y `Documentacion.md` cuando se cambien decisiones relevantes.

## Criterios de aceptación
- `index.html` + `style.css` + `script.js` funcionan sin instalar dependencias (servidos por cualquier hosting estático o `python3 -m http.server`).
- Al abrir la radio carga automáticamente el catálogo online `catalogo.json` con al menos 100 pistas alojadas en `/musica/`.
- Hay reproducción, pausa, pista anterior/siguiente, mezcla aleatoria, control de volumen y lista visible del catálogo con créditos.
- La estética usa negro y rojo, con elementos gráficos punk/combativos originales creados con CSS/SVG.
- La interfaz solo incorpora pistas con licencia verificada y registrada en `catalogo.json`.
- La documentación explica servidor, cómo añadir las 100 canciones y limitaciones legales.
