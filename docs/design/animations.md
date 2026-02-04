# Animations and Effects

## Background Effects

### Starfield

Animated background with twinkling stars creating spatial depth.

**Specifications:**
- Count: 200 stars
- Size: 2px (80%) and 3px (20%)
- Color: `#FFFFFF`
- Animation: `twinkle` with 2-4 second duration (random)
- Delay: 0-3 seconds (random)

```css
.starfield {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #FFFFFF;
  border-radius: 50%;
  animation: twinkle 3s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

**JavaScript Generation:**
```javascript
const starfield = document.getElementById('starfield');
const starCount = 200;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.animationDuration = (Math.random() * 2 + 2) + 's';
  star.style.animationDelay = Math.random() * 3 + 's';
  const size = Math.random() > 0.8 ? 3 : 2;
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  starfield.appendChild(star);
}
```

### Spotlight

Central blue spotlight effect with pulsing animation.

**Specifications:**
- Diameter: 800px
- Color: `rgba(59, 130, 246, 0.15)`
- Blur: 60px
- Animation: `spotlight-pulse` 6 seconds

```css
.spotlight {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 0%,
    transparent 70%
  );
  filter: blur(60px);
  animation: spotlight-pulse 6s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes spotlight-pulse {
  0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.25; transform: translate(-50%, -50%) scale(1.1); }
}
```

## Keyframes

```css
/* Starfield twinkle */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Spotlight pulse */
@keyframes spotlight-pulse {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50% { opacity: 0.25; transform: scale(1.1); }
}

/* Fade in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide up */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Transition Durations

| Type | Duration | Usage |
|------|----------|-------|
| Fast | 200ms | Hover states, micro-interactions |
| Normal | 300ms | Component transitions |
| Slow | 400ms | Modals, overlays |
| Twinkle | 2-4s | Background stars |
| Spotlight | 6s | Spotlight pulse |

## Hover Effects

```css
/* Card lift */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

/* Button lift */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Border glow */
.card:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

/* Row highlight */
tr:hover {
  background: rgba(59, 130, 246, 0.05);
}
```

## Responsive Breakpoints

| Breakpoint | Value | Usage |
|------------|-------|-------|
| Mobile | < 768px | Single column layout |
| Tablet | 768px | 2-column grid |
| Desktop | 1024px+ | Full grid |

```css
@media (max-width: 768px) {
  .hero-title { font-size: 42px; }
  .stats-grid { grid-template-columns: 1fr; }
  .header-glass { padding: 12px 16px; }
}

@media (min-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
  .agents-grid { grid-template-columns: repeat(3, 1fr); }
}
```
