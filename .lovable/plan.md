## Objetivo
Sustituir los placeholders `src/img/fotoN.jpeg` por las 7 fotos reales subidas, usando Lovable Assets para no meter binarios en el repo.

## Pasos
1. Subir cada `foto1..foto8.jpeg` (excepto la que falta — solo hay 7: 1,2,3,4,5,6,7,8 sin foto se confirmará) desde `/mnt/user-uploads/` a Lovable Assets:
   ```
   lovable-assets create --file /mnt/user-uploads/fotoN.jpeg --filename fotoN.jpeg > src/assets/fotoN.jpeg.asset.json
   ```
   (Nota: el usuario ha subido foto1, foto2, foto3, foto4, foto5, foto6, foto7, foto8 → 8 fotos en total, perfecto para los 8 huecos.)
2. En `src/routes/index.tsx`, importar los 8 JSON de asset y reemplazar los `src: "src/img/fotoN.jpeg"` por `src: fotoN.url` en el array `PHOTOS` de `PolaroidScatter`.
3. Añadir `alt` descriptivo genérico ("Recuerdo N") por accesibilidad.

## Lo que NO cambia
- Posiciones, rotaciones, tamaños, opacidad ni blur de las polaroids.
- Lógica del quiz, estilos, colores.
