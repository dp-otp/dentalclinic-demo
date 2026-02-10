# WooParcel Website

A flagship-level website for WooParcel - the AI-powered logistics platform for e-commerce brands.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber + Three.js
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── services/          # Services page
│   ├── pricing/           # Pricing page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── get-started/       # Onboarding flow
│   ├── track/             # Parcel tracking
│   └── how-it-works/      # How it works page
│
├── components/
│   ├── 3d/                # Three.js components
│   │   └── HeroCinematic.tsx
│   ├── sections/          # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSolutionSection.tsx
│   │   ├── ValuePillarsSection.tsx
│   │   └── ...
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── Navigation.tsx
│   └── Footer.tsx
│
├── hooks/                 # Custom React hooks
│   └── useScrollAnimation.ts
│
├── lib/                   # Utilities and animations
│   ├── utils.ts
│   └── animations.ts
│
└── styles/
    └── globals.css        # Global styles and tokens
```

## Design System

### Colors

```css
/* Backgrounds */
--bg-obsidian: #0B0C0E
--bg-elevated-1: #0F1113
--bg-elevated-2: #14161A

/* Accent */
--accent-woop: #D77A00
--accent-glow: #FFC57A
--accent-cyan: #4ECDC4

/* Text */
--text-primary: #FFFFFF
--text-secondary: #BFC6CC
--text-muted: #6B7280
```

### Motion

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (smooth)
- **Duration:** 280ms (normal), 420ms (slow)
- **Scroll animations:** Fade up, stagger, parallax

## Features

- **3D Hero Animation:** Cinematic parcel → globe transition
- **Scroll Animations:** Fade up, stagger, count up, parallax
- **Responsive Design:** Mobile-first, 4 breakpoints
- **Dark Theme:** Premium obsidian/gold aesthetic
- **Performance:** Optimized for 90+ Lighthouse score
- **Accessibility:** WCAG AA compliant

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Other Platforms

Build the static export:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## Environment Variables

Create a `.env.local` file:

```
# Optional analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X
```

## License

Proprietary - WooParcel Ltd
