#!/usr/bin/env python3
"""Arranca la radio en local sin pelearse con el puerto.

- Reserva el primer puerto libre de verdad (8000, 8001, 8002...). Sin carreras.
- Reutiliza el puerto al reiniciar (no falla por TIME_WAIT).
- Soporta peticiones Range: se puede avanzar/retroceder dentro de una canción,
  igual que en un hosting real (GitHub Pages, R2...).
- Abre el navegador solo.
- Ctrl+C en la ventana para parar.

Uso:  python3 servir.py        (o doble clic en iniciar.command)
"""
import os
import re
import socket
import socketserver
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
RANGO = re.compile(r"^bytes=(\d*)-(\d*)$")


class Servidor(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def reservar_puerto(inicio=8000, intentos=25):
    """Devuelve (socket_ya_escuchando, puerto) o (None, 0)."""
    for puerto in range(inicio, inicio + intentos):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind(("127.0.0.1", puerto))
            s.listen(socketserver.TCPServer.request_queue_size)
            return s, puerto
        except OSError:
            s.close()
    # último recurso: que el sistema elija
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(("127.0.0.1", 0))
    s.listen()
    return s, s.getsockname()[1]


class LectorLimitado:
    """Lee solo `restantes` bytes de un fichero (para respuestas 206)."""

    def __init__(self, fichero, restantes):
        self.f = fichero
        self.restantes = restantes

    def read(self, n=-1):
        if self.restantes <= 0:
            return b""
        if n is None or n < 0 or n > self.restantes:
            n = self.restantes
        datos = self.f.read(n)
        self.restantes -= len(datos)
        return datos

    def close(self):
        self.f.close()


class Handler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"  # necesario para Range y para audio fluido

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)

    def log_message(self, fmt, *args):
        pass  # consola limpia

    def handle_one_request(self):
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            self.close_connection = True

    def end_headers(self):
        if not getattr(self, "_ranges_enviados", False):
            self.send_header("Accept-Ranges", "bytes")
            self._ranges_enviados = True
        super().end_headers()

    def send_head(self):
        cabecera = self.headers.get("Range")
        if not cabecera:
            return super().send_head()

        ruta = self.translate_path(self.path)
        if os.path.isdir(ruta) or not os.path.isfile(ruta):
            return super().send_head()

        m = RANGO.match(cabecera.strip())
        if not m:
            return super().send_head()

        try:
            f = open(ruta, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        tam = os.fstat(f.fileno()).st_size
        inicio_s, fin_s = m.groups()

        if inicio_s == "":
            # sufijo: los últimos N bytes
            if fin_s == "":
                f.close()
                return super().send_head()
            inicio = max(tam - int(fin_s), 0)
            fin = tam - 1
        else:
            inicio = int(inicio_s)
            fin = int(fin_s) if fin_s else tam - 1

        if inicio >= tam or inicio > fin:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{tam}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        fin = min(fin, tam - 1)
        f.seek(inicio)
        largo = fin - inicio + 1

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(ruta))
        self.send_header("Content-Range", f"bytes {inicio}-{fin}/{tam}")
        self.send_header("Content-Length", str(largo))
        self.end_headers()
        return LectorLimitado(f, largo)


def main():
    sock, puerto = reservar_puerto()
    url = f"http://localhost:{puerto}/index.html"
    servidor = Servidor(("127.0.0.1", puerto), Handler, bind_and_activate=False)
    servidor.socket.close()
    servidor.socket = sock
    servidor.server_address = ("127.0.0.1", puerto)

    print("=" * 52)
    print("  METRALLAPUNK-RADIO — servidor local")
    print("=" * 52)
    print(f"  Abriendo: {url}")
    print("  Deja esta ventana abierta. Ctrl+C para parar.")
    print("=" * 52)

    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nRadio local parada. ¡Hasta la próxima!")
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()
