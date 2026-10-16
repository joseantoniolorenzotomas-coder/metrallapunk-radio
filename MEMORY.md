# Memoria del proyecto

## Nombre provisional
**MetrallaPunk-Radio** — radio web punk y libertaria.

## Identidad editorial
- Géneros: punk, ska, Oi!, cantautores y música libertaria/combativa.
- Valores: libertad, autogestión, antifascismo, antirracismo, anticapitalismo y crítica social, sin convertir la web en una plataforma de odio.
- Estética: negro predominante, rojo intenso, blanco roto, textura de cartel fotocopiado, tipografía contundente y gráfica DIY.

## Decisiones técnicas
- Radio online: `index.html` + `style.css` + `script.js` + `catalogo.json` + carpeta `/musica/` en servidor.
- Sin frameworks ni dependencias obligatorias.
- Al abrir, la radio carga el catálogo del servidor y reproduce sin que el oyente aporte archivos. El modo local (seleccionar archivos propios) queda solo como respaldo.
- La lista online se reproduce en orden aleatorio y vuelve a mezclarse al terminar.
- Fase 2 opcional: streaming 24/7 sincronizado con Icecast + Liquidsoap en Oracle Cloud Always Free (0 €). Pack en `servidor/oracle/`.

## Reglas de licencias
- Mantener un inventario de pistas y sus licencias.
- Guardar evidencia de permiso o licencia.
- Revisar atribución, uso comercial, obras derivadas y condiciones de redistribución.
- No usar “royalty-free” como sinónimo automático de “sin derechos”.
- Antes de emitir públicamente por internet, comprobar las obligaciones aplicables en el país y el tipo de servicio.

## Pendiente
- Elegir dominio/nombre definitivo y servidor (ver `Documentacion.md` § servidor).
- Completar biblioteca de 100+ canciones verificadas en `catalogo.json` + `/musica/`. Estado actual: estructura lista, 0 pistas verificadas — no afirmar que ya hay 100.
- Decidir fase 2 de streaming 24/7 sincronizado (Icecast/AzuraCast): alojamiento, ancho de banda y derechos.
- Añadir página de créditos visible generada desde `catalogo.json`.
