
## Objetivo
Añadir entre 4 y 8 fotografías estilo Polaroid distribuidas sutilmente por el fondo, sin tapar el contenido del quiz ni reemplazar el color de fondo actual.

## Cambios

### 1. `src/routes/index.tsx` — nuevo componente `PolaroidScatter`
- Array editable `PHOTOS` con 8 objetos: `{ src, top, left, rotate, size, hideOnMobile }`.
- Cada item es un `<div>` polaroid: fondo blanco, padding ~10px, sombra suave (`shadow-card` o sombra propia), `border-radius` pequeño, contiene un `<img>` con `object-cover`.
- Posicionamiento absoluto en esquinas/laterales (top/bottom + left/right) usando porcentajes para que escalen.
- `opacity: 0.22`, `filter: blur(0.5px)`, `transform: rotate(...)`.
- Las que tengan `hideOnMobile: true` se ocultan con `hidden sm:block` (en móvil quedan ~3–4 visibles, en escritorio las 8).
- Renderizado dentro de `<main>`, **antes** del `<div className="relative z-10 ...">` existente, con `z-index: 0` y `pointer-events: none` para no interceptar clics.
- El contenedor del quiz ya tiene `z-10`, así que las polaroids quedan por detrás automáticamente.

### 2. Placeholders de imagen
- Usar `src` con cadenas vacías o un placeholder neutro tipo `https://placehold.co/300x300?text=Foto+1` para empezar.
- Comentario en el código indicando cómo sustituir cada `src` por una imagen real (URL o import desde `src/assets`).

### 3. Coexistencia con `Backdrop`
- Mantener los blobs actuales (`Backdrop`) intactos.
- `PolaroidScatter` se renderiza después del `Backdrop` pero también con z-index inferior al contenido (z-0).

## Distribución sugerida (escritorio)
```
 [P1 ↖]                    [P2 ↗]
        
   [P3 ←]                       
                          [P4 →]
   [P5 ←]                       
        
 [P6 ↙]    [P7 ↓]         [P8 ↘]
```
En móvil solo se muestran P1, P2, P6, P8 (esquinas).

## Lo que NO cambia
- Colores, tipografía, animaciones, lógica del quiz.
- `styles.css` no necesita cambios (se usan utilidades Tailwind existentes + estilos inline para rotación/posición).
