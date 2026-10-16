# MetrallaPunk-Radio en Oracle Cloud (gratis, 24/7 sincronizado)

## Qué monta esto
VPS Oracle Always Free + **Icecast2** (servidor de streaming) + **Liquidsoap** (AutoDJ:
reproduce `/home/radio/musica` en aleatorio, sin parar). Todos los oyentes oyen lo mismo.

## 1. Cuenta e instancia (consola Oracle)
1. Crea cuenta en Oracle Cloud (pide tarjeta, el tier gratuito no cobra).
2. Create instance con:
   - Shape: `VM.Standard.A1.Flex` (ARM Ampere, gratis) — 1 OCPU + 6 GB sobra para radio.
   - Imagen: Ubuntu 24.04. Disco: 100 GB (dentro de los 200 GB gratuitos).
   - Guarda la clave SSH privada (`.key`).
3. Si dice "out of capacity": prueba otro dominio de disponibilidad u otra región.
4. Abre el puerto: Networking → Security List → Add Ingress Rule: `TCP 8000` desde `0.0.0.0/0`.

## 2. Instala
```bash
ssh -i tu-clave.key ubuntu@TU_IP_PUBLICA
git clone <tu-repo> metrallapunk-radio   # o sube la carpeta con scp
cd metrallapunk-radio/servidor/oracle
# 1) pon contraseñas en icecast.xml (3× CAMBIA_*) y radio.liq (CAMBIA_SOURCE, igual que source-password)
# 2) instala:
sudo bash instalar.sh
```

## 3. Sube la música (solo pistas con licencia verificada)
```bash
# desde tu Mac:
scp -i tu-clave.key -r musica/*.mp3 radio@TU_IP:/home/radio/musica/
```
Liquidsoap vigila la carpeta (`reload_mode="watch"`): lo nuevo entra solo en rotación.

## 4. Comprueba y conecta la web
- Abre `http://TU_IP:8000/radio.mp3` → debe sonar.
- En `catalogo.json` pon `"streamUrl": "http://TU_IP:8000/radio.mp3"` y republica la web.
- La web entra en modo directo: un solo punto de escucha para todos.

## 5. HTTPS (solo si tu web está en https)
Un navegador con página `https://` no reproduce un stream `http://`. Opciones:
- Sirve la web también por `http://`, o
- Pon un dominio + Caddy como proxy inverso (2 comandos, ver abajo).

```bash
sudo apt install -y caddy
# Caddyfile: radio.tudominio.org → reverse_proxy localhost:8000
sudo systemctl reload caddy
# y streamUrl pasa a https://radio.tudominio.org/radio.mp3
```

## Coste y límites
0 € dentro del Always Free (2 OCPU + 12 GB + 200 GB + 10 TB salida/mes aprox).
A 128 kbps caben cientos de oyentes simultáneos. No mines cripto ni abuses: te lo quitan.
