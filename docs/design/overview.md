# Design System

## Design Philosophy

The Enigma design system is based on the following principles:

- **Professional minimalism**: Clean interfaces without unnecessary decorative elements
- **Data and clarity focus**: Information is the protagonist, not decoration
- **Elegance over spectacle**: Subtle effects that improve experience without distraction
- **Dark-first**: Designed for dark mode as the primary experience

**Inspiration**: Linear, Stripe, Vercel - interfaces that prioritize functionality and clarity.

## Color Palette

### Primary Colors (Brand)

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary Blue | `#3B82F6` | `rgb(59, 130, 246)` | Primary buttons, accents, active links |
| Primary Blue Dark | `#2563EB` | `rgb(37, 99, 235)` | Gradients, hover states |
| Primary Blue Deep | `#1E40AF` | `rgb(30, 64, 175)` | Gradients, color shadows |

```css
/* Primary gradient for buttons and accents */
background: linear-gradient(135deg, #3B82F6, #2563EB);

/* Color shadow for buttons */
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
```

### Background Colors

| Name | Hex/RGBA | Usage |
|------|----------|-------|
| Background Base | `#0A0B0F` | Main body background |
| Glass Background | `rgba(15, 17, 23, 0.6)` | Header, cards, filters |
| Table Header | `rgba(17, 24, 39, 0.8)` | Table headers |
| Input Background | `rgba(31, 41, 55, 0.5)` | Form fields |
| Row Hover | `rgba(59, 130, 246, 0.05)` | Table row hover |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text Primary | `#FFFFFF` | Titles, primary text |
| Text Secondary | `#9CA3AF` | Paragraphs, descriptions |
| Text Muted | `#6B7280` | Labels, tertiary text |

### Status Colors

| Status | Color | Hex | Background | Border |
|--------|-------|-----|------------|--------|
| Excellent/Verified | Green | `#10B981` | `rgba(16, 185, 129, 0.15)` | `rgba(16, 185, 129, 0.3)` |
| Good | Blue | `#3B82F6` | `rgba(59, 130, 246, 0.15)` | `rgba(59, 130, 246, 0.3)` |
| Medium/Pending | Yellow | `#F59E0B` | `rgba(245, 158, 11, 0.15)` | `rgba(245, 158, 11, 0.3)` |
| Flagged/Error | Red | `#EF4444` | `rgba(239, 68, 68, 0.15)` | `rgba(239, 68, 68, 0.3)` |

### Border Colors

| Name | RGBA | Usage |
|------|------|-------|
| Border Light | `rgba(255, 255, 255, 0.06)` | Card and container borders |
| Border Input | `rgba(255, 255, 255, 0.08)` | Input borders |
| Border Hover | `rgba(255, 255, 255, 0.1)` | Hover borders |
| Border Active | `rgba(59, 130, 246, 0.3)` | Active/focus borders |

## CSS Variables

```css
:root {
  /* Backgrounds */
  --bg-base: #0A0B0F;
  --bg-glass: rgba(15, 17, 23, 0.6);
  --bg-glass-darker: rgba(17, 24, 39, 0.8);

  /* Primary */
  --color-primary: #3B82F6;
  --color-primary-dark: #2563EB;
  --color-primary-darker: #1E40AF;

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  /* Status */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-light: rgba(255, 255, 255, 0.1);
  --border-primary: rgba(59, 130, 246, 0.3);

  /* Shadows */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.3);
  --shadow-primary: 0 4px 12px rgba(59, 130, 246, 0.3);

  /* Effects */
  --blur-amount: 20px;
  --blur-heavy: 60px;

  /* Transitions */
  --transition-fast: 200ms;
  --transition-normal: 300ms;
  --transition-slow: 400ms;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```
