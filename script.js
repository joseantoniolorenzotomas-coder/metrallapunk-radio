(() => {
  // ===== RADIO ONLINE (catálogo del servidor, bucle aleatorio sin parar) =====
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play');
  const title = document.getElementById('trackTitle');
  const sub = document.getElementById('trackSub');
  const status = document.getElementById('status');
  const count = document.getElementById('count');
  const progress = document.getElementById('progress');
  const volume = document.getElementById('volume');
  const lista = document.getElementById('lista');
  const creditos = document.getElementById('creditos');

  // ===== MODO LOCAL (reproductor propio, independiente) =====
  const localAudio = document.getElementById('localAudio');
  const filesInput = document.getElementById('files');
  const localPlay = document.getElementById('localPlay');
  const localPrev = document.getElementById('localPrev');
  const localNext = document.getElementById('localNext');
  const localTitle = document.getElementById('localTitle');
  const localSub = document.getElementById('localSub');
  const localStatus = document.getElementById('localStatus');

  let tracks = [], order = [], pos = 0; // pos = índice dentro de order
  let streamMode = false;
  let radioPlaying = false, failCount = 0; // la radio solo avanza sola si está sonando
  let localTracks = [], localPos = -1, localUrl = null;

  const TXT_ON = '▶ Encender radio';
  const TXT_OFF = '❚❚ Pausar radio';

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function nombrePista(t) { return t.titulo ? `${t.artista ? t.artista + ' — ' : ''}${t.titulo}` : (t.archivo || 'Pista'); }
  function updateCount() { count.textContent = `${tracks.length} ${tracks.length === 1 ? 'pista' : 'pistas'} en el catálogo`; }

  function renderLista() {
    if (!lista) return;
    if (typeof lista.replaceChildren === 'function') {
      lista.replaceChildren();
    } else {
      lista.innerHTML = '';
    }
    const actual = tracks[order[pos]];
    tracks.forEach((t) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'track-link' + (t === actual ? ' active' : '');
      btn.textContent = `${nombrePista(t)}${t.licencia && !t.licencia.startsWith('PENDIENTE') ? ` · ${t.licencia}` : ''}`;
      btn.addEventListener('click', () => {
        const op = order.indexOf(tracks.indexOf(t));
        if (op >= 0) loadRadio(op, true);
      });
      li.appendChild(btn);
      lista.appendChild(li);
    });
    if (creditos) creditos.textContent = tracks.length ? 'Créditos: ' + tracks.map(t => t.atribucion || nombrePista(t)).join(' · ') : '';
  }

  function loadRadio(orderPos, autoplay = true) {
    if (!tracks.length || streamMode) return;
    if (orderPos >= order.length) { order = shuffle(tracks.map((_, i) => i)); orderPos = 0; }
    if (orderPos < 0) orderPos = order.length - 1;
    pos = orderPos;
    const t = tracks[order[pos]];
    audio.src = encodeURI(t.archivo || t.url);
    title.textContent = nombrePista(t);
    sub.textContent = `Pista ${pos + 1} de ${order.length} · en bucle aleatorio${t.licencia ? ` · ${t.licencia}` : ''}`;
    renderLista();
    if (autoplay) playRadio();
  }

  function playRadio() {
    pauseLocal(true);
    audio.play().then(() => {
      playBtn.textContent = TXT_OFF;
      radioPlaying = true; failCount = 0;
      status.textContent = 'Radio en marcha, en bucle sin parar. ¡Volumen y resistencia!';
    }).catch(() => {
      radioPlaying = false;
      status.textContent = 'El navegador bloqueó el inicio. Pulsa “Encender radio”.';
      playBtn.textContent = TXT_ON;
    });
  }
  function pauseRadio(silent = false) {
    radioPlaying = false;
    audio.pause();
    playBtn.textContent = TXT_ON;
    if (!silent) status.textContent = 'Radio en pausa. Pulsa “Encender radio” para seguir.';
  }

  playBtn.addEventListener('click', async () => {
    if (streamMode) {
      if (audio.paused) { pauseLocal(true); try { await audio.play(); playBtn.textContent = TXT_OFF; status.textContent = 'Directo en marcha.'; } catch { status.textContent = 'No se pudo conectar al directo.'; } }
      else pauseRadio();
      return;
    }
    if (!tracks.length) { status.textContent = 'Catálogo vacío. Revisa catalogo.json + /musica/.'; return; }
    if (audio.paused) {
      if (!audio.src) loadRadio(0, false);
      playRadio();
    } else pauseRadio();
  });

  audio.addEventListener('ended', () => {
    if (streamMode || !radioPlaying) return;
    loadRadio(pos + 1, true); // bucle infinito, re-mezcla al agotar
  });
  audio.addEventListener('playing', () => { failCount = 0; });
  audio.addEventListener('error', () => {
    if (!audio.src || streamMode || !radioPlaying) return; // en reposo no toca nada (ni al modo local)
    failCount++;
    if (failCount > tracks.length + 2) {
      pauseRadio();
      status.textContent = 'Demasiadas pistas fallan. Revisa /musica/ y catalogo.json, o usa “Tus archivos”.';
      return;
    }
    status.textContent = 'Esta pista falla, salto a la siguiente…';
    setTimeout(() => { if (radioPlaying) loadRadio(pos + 1, true); }, 800);
  });
  audio.addEventListener('timeupdate', () => {
    if (audio.duration && isFinite(audio.duration)) progress.value = (audio.currentTime / audio.duration) * 100;
  });
  localAudio.addEventListener('error', () => {
    if (localAudio.src) localStatus.textContent = 'Este archivo no se puede reproducir. Prueba con otro.';
  });

  async function cargarCatalogo() {
    try {
      const res = await fetch('catalogo.json?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (!data || typeof data !== 'object') throw new Error('Catálogo inválido');
      if (data.streamUrl) {
        // Directo Icecast: TODOS oyen lo mismo a la vez (sincronía real)
        streamMode = true;
        audio.src = data.streamUrl;
        title.textContent = data.radio?.nombre || 'Radio en directo';
        sub.textContent = 'Emisión en directo sincronizada para todos';
        status.textContent = 'Conectado al directo. Pulsa “Encender radio”.';
        count.textContent = 'directo sincronizado';
        return;
      }
      const pistas = Array.isArray(data.pistas) ? data.pistas : (Array.isArray(data.tracks) ? data.tracks : []);
      tracks = pistas.filter(t => t.archivo || t.url);
      order = shuffle(tracks.map((_, i) => i));
      pos = 0;
      updateCount(); renderLista();
      if (!tracks.length) {
        title.textContent = 'Catálogo vacío (0/100)';
        sub.textContent = 'Añade MP3 en /musica/ y regístralos en catalogo.json.';
        return;
      }
      // Sensación de directo: cada visita entra en un punto distinto del programa,
      // a mitad de una canción aleatoria, como si la radio no hubiera parado.
      pos = Math.floor(Math.random() * order.length);
      const t = tracks[order[pos]];
      audio.addEventListener('loadedmetadata', () => {
        try {
          const d = audio.duration;
          if (d && isFinite(d) && d > 45) audio.currentTime = Math.random() * d * 0.7;
        } catch { /* sin soporte de salto: empieza desde el inicio */ }
      }, { once: true });
      audio.src = encodeURI(t.archivo || t.url);
      title.textContent = nombrePista(t);
      sub.textContent = `Emisión continua · sintonizas a mitad del programa · ${tracks.length} pistas en bucle`;
      status.textContent = `La radio no para: pillaste ${nombrePista(t)}. Pulsa “Encender radio”.`;
    } catch (e) {
      title.textContent = 'No se pudo cargar el catálogo';
      const esArchivo = location.protocol === 'file:';
      sub.textContent = esArchivo
        ? 'Abriste con doble clic (file://): el navegador bloquea el catálogo así.'
        : `Error técnico: ${e.message || e}`;
      status.textContent = esArchivo
        ? 'Arranca el servidor: python3 -m http.server 8000 y abre http://localhost:8000 — o pulsa “Reintentar”.'
        : `Sin conexión al catálogo (${e.message || e}). Pulsa “Reintentar” o usa “Tus archivos”.`;
    }
  }

  // ===== LOCAL =====
  function loadLocal(i, autoplay = true) {
    if (!localTracks.length) return;
    if (i >= localTracks.length) i = 0;
    if (i < 0) i = localTracks.length - 1;
    localPos = i;
    const f = localTracks[localPos];
    if (localUrl) URL.revokeObjectURL(localUrl);
    localUrl = URL.createObjectURL(f);
    localAudio.src = localUrl;
    localTitle.textContent = f.name.replace(/\.[^.]+$/, '');
    localSub.textContent = `Archivo ${localPos + 1} de ${localTracks.length} · solo en tu equipo`;
    if (autoplay) playLocal();
  }
  function playLocal() {
    pauseRadio(true);
    playBtn.textContent = TXT_ON;
    status.textContent = 'Radio en pausa (estás escuchando tus archivos).';
    localAudio.play().then(() => {
      localPlay.textContent = '❚❚ Pausar';
      localStatus.textContent = 'Reproduciendo tus archivos.';
    }).catch(() => { localStatus.textContent = 'Pulsa “Escuchar” para empezar (lo exige el navegador).'; });
  }
  function pauseLocal(silent = false) {
    localAudio.pause();
    if (localPlay) localPlay.textContent = '▶ Escuchar';
    if (!silent && localStatus) localStatus.textContent = 'En pausa.';
  }

  filesInput.addEventListener('change', () => {
    localTracks = Array.from(filesInput.files || []).filter(f => f.type.startsWith('audio/') || /\.(mp3|ogg|wav|m4a|aac|flac|opus)$/i.test(f.name));
    if (!localTracks.length) { localStatus.textContent = 'Ningún audio válido. Prueba MP3/OGG/WAV.'; return; }
    loadLocal(0, false);
    localStatus.textContent = `Lista local: ${localTracks.length} archivos. Pulsa “Escuchar”.`;
    localPlay.textContent = '▶ Escuchar';
  });
  localPlay.addEventListener('click', () => {
    if (!localTracks.length) { localStatus.textContent = 'Carga primero tus archivos con “＋ Archivos propios”.'; return; }
    if (localAudio.paused) {
      if (!localAudio.src) loadLocal(Math.max(localPos, 0), false);
      playLocal();
    } else pauseLocal();
  });
  localNext.addEventListener('click', () => { if (localTracks.length) loadLocal(localPos + 1, true); });
  localPrev.addEventListener('click', () => { if (localTracks.length) loadLocal(localPos - 1, true); });
  localAudio.addEventListener('ended', () => loadLocal(localPos + 1, true));

  volume.addEventListener('input', e => { audio.volume = Number(e.target.value); localAudio.volume = Number(e.target.value); });
  audio.volume = .8; localAudio.volume = .8;

  document.getElementById('retry').addEventListener('click', () => {
    status.textContent = 'Reintentando conectar al catálogo…';
    cargarCatalogo();
  });

  const creditosBtn = document.getElementById('creditosBtn');
  const catalogoBox = document.getElementById('catalogoBox');
  creditosBtn.addEventListener('click', () => {
    const abierto = catalogoBox.hidden;
    catalogoBox.hidden = !abierto;
    creditosBtn.setAttribute('aria-expanded', String(abierto));
    creditosBtn.textContent = abierto ? 'Créditos ▴' : 'Créditos ▾';
  });

  cargarCatalogo();
})();
