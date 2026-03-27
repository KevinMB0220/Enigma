# Neo-Precisión Design System

## Filosofía de Diseño: Neo-Precisión

Neo-Precisión es un lenguaje visual que combina minimalismo técnico, claridad estructural y una estética oscura premium. No busca ser decorativo ni experimental, sino sólido, confiable y perfectamente construido.

### Principios Clave:
- **Fondo Oscuro Estructurado**: Base profunda para resaltar información sin fatigar la vista.
- **Superficies Secundarias**: Profundidad lograda mediante capas controladas y cambios sutiles de tono, no sombras pesadas.
- **Bordes Definidos**: Líneas finas de 1px que construyen ritmo visual y delimitan espacios con elegancia.
- **Radios Moderados**: Evitamos bordes demasiado redondeados para mantener una sensación de sistema técnico y profesional (preferencia por `radius-0` o radios mínimos).
- **Tipografía Híbrida**: Sans-serif para la interfaz general + Monosepaciada para datos técnicos y métricas.
- **Paleta Semántica Disciplinada**: El color guía la atención con intención, no se usa por decoración.

---

## Paleta de Colores

### Colores de Fundación (Core)

| Nombre | Hex | Propósito |
|:---|:---|:---|
| **Background Base** | `#05070A` | Fondo principal de la aplicación. |
| **Surface Base** | `#0F1219` | Superficie de tarjetas y paneles. |
| **Foundation Stroke**| `#1E293B` | Bordes y divisores estructurales. |

### Colores Semánticos (Signal)

| Nombre | Hex | Uso |
|:---|:---|:---|
| **Emerald (Primary)** | `#4ADE80` | Acciones principales, estados activos, éxito. |
| **Cyan (Secondary)** | `#22D3EE` | Información técnica, tendencias, métricas. |
| **Amber (Warning)** | `#FCD34D` | Estados pendientes, advertencias. |
| **Rose (Error)** | `#FB7185` | Alertas de seguridad, errores críticos. |

---

## Tipografía

El sistema utiliza una combinación de dos fuentes para transmitir precisión:
- **Inter**: Para interfaz de usuario, títulos y lectura general.
- **JetBrains Mono**: Para direcciones on-chain, métricas, timestamps e identificadores únicos.

---

## Variables de CSS (Neo-Precisión Core)

```css
:root {
  /* Backgrounds */
  --background: #05070A;
  --flare-surface: #0F1219;
  
  /* Signals */
  --flare-accent: #4ADE80;
  --flare-accent-cyan: #22D3EE;
  
  /* Strokes */
  --flare-stroke: rgba(74, 222, 128, 0.08);
  --border-subtle: #1E293B;

  /* Typography */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;

  /* Radius */
  --radius: 0px; /* Estética industrial pura */
}
```
