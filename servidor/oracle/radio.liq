# MetrallaPunk-Radio — AutoDJ 24/7 en bucle aleatorio (Liquidsoap 2.x)
# Lee /home/radio/musica y emite a Icecast. Lo que añadas a la carpeta entra solo.

set("log.file", false)

musica = playlist(mode="random", reload_mode="watch", "/home/radio/musica")
musica = mksafe(musica)

output.icecast(%mp3(bitrate=128, samplerate=44100, stereo=true),
  host="localhost", port=8000, password="CAMBIA_SOURCE",
  mount="radio.mp3", name="MetrallaPunk-Radio",
  description="Punk, ska, Oi! y musica libertaria en bucle",
  genre="Punk/Ska/Oi",
  musica)
