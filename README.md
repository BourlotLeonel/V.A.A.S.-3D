# Maqueta 3D modularizada

Versión organizada de la maqueta actual. Conserva el simulador, sus fases de semáforos, vehículos, cámaras y controles; los archivos JavaScript se cargan en orden para mantener el comportamiento existente.

## Ejecutar desde VS Code

1. Abrí esta carpeta en VS Code.
2. Iniciá `index.html` con la extensión **Live Server**, o desde la terminal integrada ejecutá `python3 -m http.server 8000` y abrí `http://localhost:8000`.
3. La versión actual carga Three.js r128 desde CDN, por lo que necesita conexión a Internet al abrir la página. El resto del código y los estilos están en esta carpeta.

## Estructura

- `index.html`: interfaz y orden de carga.
- `css/styles.css`: estilos de la interfaz.
- `js/00-engine-assets.js`: renderer, utilidades y recursos base.
- `js/01-redes-viales-y-aceras.js`: calles, aceras y esquinas.
- `js/02-edificios.js`: edificios y fachadas.
- `js/03-parque-y-plaza.js`: parque, plaza y bulevar.
- `js/04-rutas-semaforos-camaras.js`: trayectorias, semáforos y zonas de cámara.
- `js/05-modelos-vehiculos.js`: modelos y materiales de vehículos.
- `js/06-simulacion-y-control.js`: tráfico, fases y control adaptativo.
- `js/07-estadisticas-y-camaras.js`: indicadores, miniaturas y visor de cámaras.
- `js/08-controles-y-bucle.js`: cámara orbital, interacción, conducción y bucle de render.
- `assets/modelos/` y `assets/texturas/`: carpetas preparadas para futuros recursos externos.

Los scripts están separados por responsabilidad y se cargan como scripts clásicos en orden, de modo que las variables compartidas del archivo original sigan funcionando sin reescribir la lógica. El siguiente paso opcional sería convertirlos gradualmente a módulos ES y fijar Three.js como dependencia local.
