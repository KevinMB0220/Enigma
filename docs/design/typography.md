# Typografía: Dualidad Técnica

El sistema Neo-Precisión utiliza una combinación de fuentes sans-serif y monoespaciadas para diferenciar entre la interfaz de usuario y los datos operacionales de la blockchain.

## Font Families

### Inter (Sans-Serif)
Utilizada para la estructura general, navegación, títulos y contenido descriptivo. Proporciona claridad y modernidad.

### JetBrains Mono (Monospace)
Utilizada estrictamente para datos técnicos: direcciones on-chain, métricas, identificadores de transacciones, timestamps y estados de sistema. Refuerza la identidad "Neo-Precisión".

```css
:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
}
```

## Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Emphasized text |
| Semibold | 600 | Buttons, subheadings |
| Bold | 700 | Headings, badges |
| Extrabold | 800 | Hero titles |

## Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Hero Title | 64px | 800 | 1.1 | Landing hero |
| Hero Mobile | 42px | 800 | 1.2 | Mobile hero |
| Section Title | 32px | 700 | 1.3 | Section headings |
| Card Title | 20px | 600 | 1.4 | Card headings |
| Stat Number | 40px | 800 | 1.0 | Big numbers |
| Body | 14px | 400 | 1.6 | Regular text |
| Small | 12px | 500 | 1.5 | Labels, meta |
| XS | 11px | 400 | 1.4 | Legal, footnotes |

## CSS Implementation

```css
/* Hero Title */
.hero-title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 42px;
  }
}

/* Section Title */
.section-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.3;
  color: #FFFFFF;
}

/* Card Title */
.card-title {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
  color: #FFFFFF;
}

/* Stat Number */
.stat-number {
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: #FFFFFF;
}

/* Body Text */
.body-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #9CA3AF;
}

/* Small/Label */
.label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Logo */
.logo-text {
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
  color: #FFFFFF;
}
```

## Jerarquía Tipográfica

| Rol | Familia | Tamaño | Peso | Uso |
|:---|:---|:---|:---|:---|
| **Hero Title** | Inter | 64px/90px | 900 | Título principal landing |
| **Section Header** | Inter | 32px | 800 | Cabeceras de sección |
| **Component Header**| Inter | 14px | 700 | Títulos dentro de cards |
| **Technical Data** | Mono | 12px/14px | 500 | Direcciones, hashes, contadores |
| **Label/Meta** | Inter/Mono | 10px | 800/900 | Subtítulos industriales, telemetry |

## Colores de Texto (Semánticos)

```css
/* Primario: Alta legibilidad */
.text-flare-text-h { color: #F8FAFC; }

/* Secundario: Métrica y descripción */
.text-flare-text-l { color: #94A3B8; }

/* Signal: Emerald para éxito/acción */
.text-flare-accent { color: #4ADE80; }

/* Signal: Cyan para telemetría */
.text-flare-accent-cyan { color: #22D3EE; }
```
