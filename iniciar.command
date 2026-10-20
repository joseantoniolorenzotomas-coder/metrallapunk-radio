#!/bin/bash
# Doble clic para arrancar la radio en local (macOS).
cd "$(dirname "$0")" || exit 1
python3 servir.py
