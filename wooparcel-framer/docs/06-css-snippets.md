# CSS SNIPPETS — COPY-PASTE READY

---

## GLOBAL STYLES

Paste into Framer's Custom CSS (Site Settings → Custom Code → CSS):

```css
/* ═══════════════════════════════════════════════════════════════════════
   WOOPARCEL GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════════════ */

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background: #0B0C0E;
  color: #FFFFFF;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.5;
  overflow-x: hidden;
}

/* Selection */
::selection {
  background: rgba(215, 122, 0, 0.3);
  color: #FFFFFF;
}

/* Focus States */
:focus-visible {
  outline: 2px solid #D77A00;
  outline-offset: 2px;
}

/* Scrollbar (Webkit) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0B0C0E;
}

::-webkit-scrollbar-thumb {
  background: #1A1D22;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2A2D32;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## BUTTON STYLES

### Primary Button

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background: linear-gradient(135deg, #D77A00 0%, #B86A00 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(215, 122, 0, 0.3);
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(215, 122, 0, 0.4);
  background: linear-gradient(135deg, #E8943A 0%, #D77A00 100%);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 12px rgba(215, 122, 0, 0.3);
}
```

### Secondary Button

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}
```

### Ghost Button (Text Link Style)

```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #BFC6CC;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 180ms ease;
}

.btn-ghost:hover {
  color: #D77A00;
}

.btn-ghost svg {
  transition: transform 180ms ease;
}

.btn-ghost:hover svg {
  transform: translateX(4px);
}
```

---

## CARD STYLES

### Base Card

```css
.card {
  background: #0F1113;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Gradient border overlay */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 40%,
    transparent 60%,
    rgba(255, 255, 255, 0.04) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

/* Glow orb (hidden by default) */
.card::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--card-accent, #D77A00) 0%, transparent 70%);
  opacity: 0;
  top: -100px;
  right: -100px;
  filter: blur(60px);
  transition: opacity 600ms ease;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.card:hover::after {
  opacity: 0.15;
}
```

### Service Card

```css
.service-card {
  --card-accent: #4ECDC4;
  background: #0F1113;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 24px;
  padding: 40px 36px;
  cursor: pointer;
  transition: all 420ms cubic-bezier(0.16, 1, 0.3, 1);
}

.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(var(--card-accent-rgb, 78, 205, 196), 0.15);
}

.service-card .icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--card-accent) 0%, rgba(var(--card-accent-rgb), 0.6) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.service-card:hover .icon {
  transform: scale(1.1) rotate(-3deg);
}

.service-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0 0 12px 0;
}

.service-card p {
  font-size: 15px;
  line-height: 1.6;
  color: #BFC6CC;
  margin: 0;
}
```

---

## NAVIGATION STYLES

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  background: transparent;
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.nav.scrolled {
  background: rgba(11, 12, 14, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: #BFC6CC;
  text-decoration: none;
  transition: color 180ms ease;
}

.nav-link:hover,
.nav-link.active {
  color: #FFFFFF;
}

.nav-cta {
  height: 44px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  background: #D77A00;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-cta:hover {
  background: #E8943A;
  transform: translateY(-1px);
}

/* Mobile */
@media (max-width: 768px) {
  .nav {
    height: 64px;
    padding: 0 20px;
  }

  .nav-links {
    display: none;
  }

  .nav-mobile-toggle {
    display: flex;
  }
}
```

---

## SECTION STYLES

### Section Wrapper

```css
.section {
  padding: 120px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .section {
    padding: 80px 32px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 60px 20px;
  }
}
```

### Section Header

```css
.section-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto 64px;
}

.section-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #D77A00;
  margin-bottom: 16px;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.15;
  color: #FFFFFF;
  margin: 0 0 16px 0;
}

.section-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: #BFC6CC;
  margin: 0;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 16px;
  }
}
```

---

## FORM STYLES

### Input

```css
.input {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  font-size: 16px;
  color: #FFFFFF;
  background: #14161A;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 180ms ease;
}

.input::placeholder {
  color: #6B7280;
}

.input:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.input:focus {
  outline: none;
  border-color: #D77A00;
  box-shadow: 0 0 0 3px rgba(215, 122, 0, 0.15);
}

.input.error {
  border-color: #EF4444;
}
```

### Label

```css
.label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #BFC6CC;
  margin-bottom: 8px;
}

.label .required {
  color: #EF4444;
}
```

### Checkbox

```css
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
  flex-shrink: 0;
}

.checkbox.checked {
  background: #D77A00;
  border-color: #D77A00;
}

.checkbox .checkmark {
  color: #0B0C0E;
  font-size: 14px;
  opacity: 0;
  transform: scale(0.5);
  transition: all 200ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.checkbox.checked .checkmark {
  opacity: 1;
  transform: scale(1);
}
```

---

## MODAL STYLES

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(11, 12, 14, 0.9);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  background: #0F1113;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #14161A;
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #6B7280;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}

.modal-close:hover {
  background: #D77A00;
  color: #FFFFFF;
}

.modal-content {
  padding: 32px 40px 40px;
}

@media (max-width: 768px) {
  .modal {
    max-height: 100vh;
    border-radius: 24px 24px 0 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 100%;
  }

  .modal-content {
    padding: 24px 20px 40px;
  }
}
```

---

## UTILITY CLASSES

```css
/* Text Colors */
.text-primary { color: #FFFFFF; }
.text-secondary { color: #BFC6CC; }
.text-muted { color: #6B7280; }
.text-accent { color: #D77A00; }
.text-success { color: #10B981; }
.text-error { color: #EF4444; }

/* Backgrounds */
.bg-obsidian { background: #0B0C0E; }
.bg-elevated { background: #0F1113; }
.bg-elevated-2 { background: #14161A; }

/* Spacing */
.mt-0 { margin-top: 0; }
.mt-4 { margin-top: 16px; }
.mt-8 { margin-top: 32px; }
.mt-12 { margin-top: 48px; }
.mt-16 { margin-top: 64px; }

.mb-0 { margin-bottom: 0; }
.mb-4 { margin-bottom: 16px; }
.mb-8 { margin-bottom: 32px; }
.mb-12 { margin-bottom: 48px; }
.mb-16 { margin-bottom: 64px; }

/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
.gap-8 { gap: 32px; }

/* Grid */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

@media (max-width: 768px) {
  .md\:grid-cols-1 { grid-template-columns: 1fr; }
}

/* Text */
.text-center { text-align: center; }
.text-left { text-align: left; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }
```

---

## ANIMATION KEYFRAMES

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 500ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Pulse Glow */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(215, 122, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(215, 122, 0, 0.5);
  }
}

.animate-pulse-glow {
  animation: pulseGlow 3s ease-in-out infinite;
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slideInRight 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Float */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
```

---

**Copy what you need. Build something beautiful.**
