# Componentes de Interfaz: Neo-Precisión

Todos los componentes deben compartir la misma lógica visual: superficies base consistentes, criterios de borde definidos y jerarquía tipográfica técnica.

## 1. Contenedores y Cards (Surfaces)

Las tarjetas Neo-Precisión utilizan fondos profundos y bordes finos. El radio es moderado o nulo (`0px`) para mantener la seriedad técnica.

```css
.glass-card {
  background: var(--flare-surface); /* #0F1219 */
  border: 1px solid var(--flare-stroke); /* rgba(74, 222, 128, 0.08) */
  border-radius: var(--radius); /* 0px */
  position: relative;
  overflow: hidden;
}
```

### Industrial Corners
Adornos de esquina que refuerzan la sensación de construcción sólida.
```tsx
function IndustrialCorner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const classes = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return <div className={cn("absolute w-4 h-4 border-flare-accent/20", classes[position])} />;
}
```

---

## 2. Botones y Controles (Actions)

Los botones deben ser claros y directos. El color se usa solo para acciones primarias.

| Tipo | Estilo Neo-Precisión |
|:---|:---|
| **Primary** | Fondo `var(--flare-accent)`, texto oscuro. Tracking espaciado y uppercase. |
| **Secondary** | Borde `var(--flare-stroke)`, fondo translúcido. |

```css
.btn-primary {
  background: var(--flare-accent); /* Emerald */
  color: #05070A;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0;
}
```

---

## 3. Estados de Confianza (Semántica)

La paleta semántica guía la atención según el nivel de riesgo o confianza.

- **TRUSTED (Emerald)**: `#4ADE80`. Instancias verificadas y seguras.
- **PENDING (Amber)**: `#FCD34D`. Operaciones en curso o verificación media.
- **RISK (Rose)**: `#FB7185`. Fallos críticos o falta de reputación.

---

## 4. Tablas (Registry Grid)

Las tablas utilizan `tabular-nums` (Mono) para asegurar que los datos numéricos estén perfectamente alineados, facilitando el escaneo rápido.

```css
.agent-table th {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--text-secondary);
}
```
