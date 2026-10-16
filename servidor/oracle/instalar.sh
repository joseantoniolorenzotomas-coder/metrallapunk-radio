#!/usr/bin/env bash
# MetrallaPunk-Radio — instalador Oracle/Ubuntu (Icecast2 + Liquidsoap)
# Uso: edita icecast.xml y radio.liq (contraseñas) y ejecuta: sudo bash instalar.sh
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then echo "Ejecuta con sudo."; exit 1; fi
cd "$(dirname "$0")"

grep -q "CAMBIA_" icecast.xml radio.liq && {
  echo "ERROR: cambia las contraseñas CAMBIA_* en icecast.xml y radio.liq antes de instalar."
  exit 1
}

echo "== Instalando paquetes =="
apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y -qq icecast2 liquidsoap ffmpeg

echo "== Usuario y carpetas =="
id radio >/dev/null 2>&1 || useradd -m -s /bin/bash radio
mkdir -p /home/radio/musica
cp radio.liq /home/radio/radio.liq
chown -R radio:radio /home/radio

echo "== Icecast =="
cp /etc/icecast2/icecast.xml /etc/icecast2/icecast.xml.bak 2>/dev/null || true
cp icecast.xml /etc/icecast2/icecast.xml
sed -i 's/^ENABLE=.*/ENABLE=true/' /etc/default/icecast2

echo "== Servicio AutoDJ =="
cp metrallapunk.service /etc/systemd/system/metrallapunk.service
systemctl daemon-reload
systemctl enable --now icecast2
sleep 2
systemctl enable --now metrallapunk

echo "== Cortafuegos local =="
iptables -C INPUT -p tcp --dport 8000 -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport 8000 -j ACCEPT
(netfilter-persistent save 2>/dev/null || true)

echo ""
echo "OK. Comprueba:"
echo "  systemctl status icecast2 metrallapunk"
echo "  Sube MP3 a /home/radio/musica y abre http://TU_IP:8000/radio.mp3"
