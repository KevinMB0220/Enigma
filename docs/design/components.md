# UI Components

## Glassmorphism Pattern

```css
.glass-panel {
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.glass-panel-glow {
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
}
```

## Header

```css
.header-glass {
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}
```

## Buttons

```css
.btn-primary {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: #FFFFFF;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 200ms;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}
```

## Cards

```css
.stat-card {
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 28px;
  transition: all 300ms;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}
```

## Trust Badges

```css
.trust-badge {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.trust-excellent {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.trust-good {
  background: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.trust-medium {
  background: rgba(245, 158, 11, 0.15);
  color: #F59E0B;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.trust-low {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
```

## Tables

```css
.table-container {
  background: rgba(15, 17, 23, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

thead {
  background: rgba(17, 24, 39, 0.8);
}

tbody tr:hover {
  background: rgba(59, 130, 246, 0.05);
}

thead th,
tbody td {
  padding: 20px 24px;
}
```

## Inputs

```css
.filter-input,
.filter-select {
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  color: #FFFFFF;
  transition: all 200ms;
}

.filter-input:focus,
.filter-select:focus {
  border-color: rgba(59, 130, 246, 0.5);
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## Progress Bars

```css
.progress-bar {
  background: rgba(31, 41, 55, 0.6);
  border-radius: 9999px;
  height: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 400ms ease;
}

.progress-fill.excellent { background: #10B981; }
.progress-fill.good { background: #3B82F6; }
.progress-fill.medium { background: #F59E0B; }
.progress-fill.low { background: #EF4444; }
```
