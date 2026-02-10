# WOOPARCEL FRAMER BUILD KIT
## Flagship-Level Implementation Package

---

## WHAT'S INCLUDED

```
/wooparcel-framer/
│
├── /docs/
│   ├── 00-creative-vision.md      ← Brand philosophy & emotional architecture
│   ├── 01-home-page.md            ← Section-by-section build spec
│   ├── 02-hero-cinematic.md       ← 3D animation deep dive
│   ├── 03-services-page.md        ← Interactive grid & modals
│   ├── 04-onboarding-flow.md      ← Adam questionnaire rebuild
│   └── 05-framer-build-guide.md   ← Step-by-step implementation
│
├── /code-components/
│   ├── HeroCinematic.tsx          ← 3D parcel → globe sequence
│   └── ServiceModal.tsx           ← Premium service detail modal
│
├── /code-overrides/
│   └── scrollAnimations.tsx       ← 25+ scroll animation presets
│
├── /tokens/
│   └── design-tokens.json         ← Complete design system tokens
│
└── /assets/
    └── (asset manifest in docs)
```

---

## QUICK START

### 1. Read the Vision First
Start with `docs/00-creative-vision.md`. Understand the emotional intent before building anything.

### 2. Set Up Framer Project
Follow `docs/05-framer-build-guide.md` Phase 1-2 to configure your Framer project with the correct dependencies and design tokens.

### 3. Build Page by Page
Use `docs/01-home-page.md` as your primary reference. Each section has exact specifications for:
- Layer structure
- Content
- Dimensions
- Animation timing
- Responsive behavior

### 4. Add Code Components
Copy the code components into your Framer project:
- `HeroCinematic.tsx` → Creates the 3D hero sequence
- `ServiceModal.tsx` → Creates the service detail modals
- `scrollAnimations.tsx` → Provides all scroll animation overrides

### 5. Polish & Publish
Complete the checklists in Phase 8-9 of the build guide.

---

## CRITICAL COPY-PASTE CONTENT

### Hero Headline
```
Ship Smarter. Scale Faster.
```

### Hero Subheadline
```
The AI-powered logistics brain that finds the cheapest route, handles customs automatically, and keeps your customers updated — so you can focus on selling.
```

### Primary CTA
```
Start Shipping Free
```

### Trust Line
```
✓ No credit card required  ·  ✓ Live in 5 minutes
```

---

## KEY DESIGN TOKENS

```css
/* Backgrounds */
--bg-obsidian: #0B0C0E;
--bg-elevated-1: #0F1113;
--bg-elevated-2: #14161A;

/* Accent */
--accent-woop: #D77A00;
--accent-glow: #FFC57A;
--accent-cyan: #4ECDC4;

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #BFC6CC;
--text-muted: #6B7280;

/* Motion */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
--duration-normal: 280ms;
--duration-slow: 420ms;
```

---

## ANIMATION TIMELINE REFERENCE

### Hero Cinematic (4.5s total)
```
0ms      → Parcel enters (750ms)
750ms    → Parcel hovers (1200ms)
1950ms   → Lid opens (400ms)
2350ms   → Camera zooms in (350ms)
2700ms   → Globe appears (500ms)
3200ms   → Text reveals (800ms stagger)
4500ms   → Complete
```

### Scroll Animation Defaults
```
Fade Up:         420ms, ease-smooth
Stagger Delay:   100ms between items
Card Hover:      420ms, Y -8px
Count Up:        1200ms, ease-out
```

---

## REQUIRED ASSETS

| Asset | Format | Purpose |
|-------|--------|---------|
| `parcel.glb` | GLTF | 3D parcel model |
| `hero-fallback.mp4` | MP4 | WebGL fallback video |
| `hero-fallback.webm` | WebM | VP9 fallback |
| `og-image.png` | PNG 1200×630 | Social sharing |
| `favicon.ico` | ICO | Browser tab |
| `favicon.svg` | SVG | Modern browsers |
| Service icons | SVG | 6 service icons |
| Avatar images | PNG | 6 onboarding avatars |
| Partner logos | SVG | Shopify, Amazon, DHL, etc. |

---

## FIGMA DERIVATION (PHASE 2)

Once the Framer build is complete, create a Figma file containing:

1. **Design Tokens Page**
   - All colors as color styles
   - All typography as text styles
   - Spacing scale visualization
   - Shadow samples
   - Border radius samples

2. **Components Page**
   - Button variants
   - Card variants
   - Form elements
   - Navigation states
   - Modal template

3. **Layout Documentation**
   - Desktop wireframes (annotated)
   - Mobile wireframes (annotated)
   - Grid specifications
   - Breakpoint reference

4. **Motion Principles**
   - Easing curve visualization
   - Duration scale
   - Animation pattern catalog

---

## QUALITY STANDARDS

This build must achieve:

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥90 |
| Lighthouse Accessibility | ≥95 |
| Lighthouse SEO | ≥95 |
| Animation FPS | 60fps |
| LCP | <2.5s |
| CLS | <0.05 |
| Awwwards potential | Honorable Mention |

---

## SUPPORT

This is a static deliverable. For implementation support:

1. Reference the detailed documentation in `/docs/`
2. Check Framer's official documentation for component-specific questions
3. For Three.js issues, reference @react-three/fiber documentation

---

**Built for WooParcel. Designed for impact.**
