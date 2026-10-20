#!/usr/bin/env python3
"""Arranca la radio en local sin pelearse con el puerto.

- Reserva el primer puerto libre de verdad (8000, 8001, 8002...). Sin carreras.
- Reutiliza el puerto al reiniciar (no falla por TIME_WAIT).
- Abre el navegador solo.
- Ctrl+C en la ventana para parar.

Uso:  python3 servir.py        (o doble clic en iniciar.command)
"""
import socket
import socketserver
import sys
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler
from pathlib import Path

RAIZ = Path(__file__).resolve().parent


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


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)

    def log_message(self, fmt, *args):
        pass  # consola limpia


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
