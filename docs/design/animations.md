# Interacción y Animación Neo-Precisión

La animación en Neo-Precisión no es ornamental; es informativa y reactiva. Los movimientos deben ser suaves, discretos y transmitir una sensación de sistema operativo de alta tecnología.

## Efectos Basales

### Animate Scan (Barrido Técnico)
Un haz de luz sutil que recorre tarjetas y paneles para simular la "lectura" o actualización constante del sistema.

```css
@keyframes scan {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateY(500%); opacity: 0; }
}

.animate-scan {
  animation: scan 4s linear infinite;
}
```

### Background Grid (Malla Estructural)
Patrón de cuadrícula sutil que refuerza la sensación de plano técnico.

```css
.bg-grid {
  background-image: 
    linear-gradient(to right, #80808012 1px, transparent 1px),
    linear-gradient(to bottom, #80808012 1px, transparent 1px);
  background-size: 32px 32px;
}
```

---

## Filosofía de Hover

Los hovers deben sentirse precisos y nítidos. No usamos efectos pesados, sino cambios sutiles de color y elevación.

| Elemento | Efecto Neo-Precisión |
|:---|:---|
| **Cards** | `.hover-lift` Elevación sutil de 2px + Border Glow Emerald (10-20% opacidad). |
| **Buttons** | Transición de color suave + Sombra de resplandor (Glow) controlada. |
| **Rows** | Highlight sutil en `var(--flare-accent)` con 5% de opacidad. |

```css
/* Card Lift Precisn */
.interactive-card:hover {
  transform: translateY(-2px);
  border-color: rgba(74, 222, 128, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
```

---

## Timings y Curvaturas

| Duración | Valor | Propósito |
|:---|:---|:---|
| **Fast** | 200ms | Micro-interacciones, hovers. |
| **Normal**| 300ms | Transiciones de sección, fade-ins. |
| **Slow** | 400ms | Modales complejos (no recomendado en exceso). |

**Cubic Bezier**: Recomendamos `cubic-bezier(0.4, 0, 0.2, 1)` para transiciones que se sientan naturales pero nítidas.
