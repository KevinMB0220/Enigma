# Typography

## Font Family

**Primary Font**: Inter

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
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

## Text Colors

```css
/* Primary - High emphasis */
.text-primary { color: #FFFFFF; }

/* Secondary - Medium emphasis */
.text-secondary { color: #9CA3AF; }

/* Muted - Low emphasis */
.text-muted { color: #6B7280; }

/* Brand - Accent */
.text-brand { color: #3B82F6; }

/* Status colors */
.text-success { color: #10B981; }
.text-warning { color: #F59E0B; }
.text-error { color: #EF4444; }
```

## Monospace (Addresses)

```css
.address {
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  color: #6B7280;
}
```
