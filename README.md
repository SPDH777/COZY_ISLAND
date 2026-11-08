# Anime Cozy Island

Juego 3D de una isla tranquila hecho con Three.js (r128, por CDN). Sin build obligatorio: abre `index.html` con un servidor local.

## Estructura

```
index.html        HTML + carga de CSS y JS
base.css / patches.css   Estilos
00-...js a 16-...js    Scripts (se cargan en ORDEN, ver index.html)
build.py               Junta todo en un solo HTML
```

## Ejecutar

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Reglas importantes

- El **orden** de los `<script>` en `index.html` importa: no lo cambies.
- Los archivos comparten el ámbito global (igual que el HTML original).
- Para un parche nuevo: crea `js/17-nombre.js` y añade su `<script>` al final de `index.html`.
- `python3 build.py` genera `dist/Anime_Cozy_Island.html` (versión de un solo archivo).
