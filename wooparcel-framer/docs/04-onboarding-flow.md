# ONBOARDING FLOW (ADAM) — COMPLETE REBUILD SPECIFICATION

---

## THE PHILOSOPHY

Onboarding is not a form. It is a **conversation**.

The current flow has the right instinct — avatar selection, branching logic, friendly copy. But it can be elevated:

1. **Remove friction** — fewer screens, smarter defaults
2. **Add delight** — micro-animations between steps
3. **Build trust** — explain why we're asking each question
4. **Personalize** — the result feels genuinely tailored

---

## FLOW ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  STEP 1: WELCOME                                                │
│  Name + Avatar Selection                                        │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 2: YOUR STAGE                                             │
│  "Just starting" vs "Already selling"                           │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 3: YOUR STORE (if "Already selling")                      │
│  Platform selection OR "Build for me"                           │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 4: YOUR PRODUCTS                                          │
│  Multi-select product categories                                │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 5: YOUR VOLUME (NEW)                                      │
│  Orders per month                                               │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 6: YOUR REACH (NEW)                                       │
│  Shipping destinations                                          │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 7: YOUR VIBE                                              │
│  Communication style                                            │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 8: YOUR DETAILS                                           │
│  Contact information                                            │
│                                                                 │
│           ↓                                                     │
│                                                                 │
│  STEP 9: YOUR PLAN (NEW)                                        │
│  Personalized recommendation                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## VISUAL CONTAINER

### Modal Style (Not Page)

The onboarding should feel like a **focused conversation**, not a new page.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│         ┌───────────────────────────────────────┐              │
│         │                                       │              │
│         │   ┌─────────────────────────────┐    │   ← Modal     │
│         │   │                             │    │     640px     │
│         │   │    Onboarding Content       │    │     width     │
│         │   │                             │    │              │
│         │   │                             │    │              │
│         │   │                             │    │              │
│         │   └─────────────────────────────┘    │              │
│         │                                       │              │
│         │   ───────────────────────────────    │   ← Progress  │
│         │   [ ← Back ]         [ Continue ]    │     bar       │
│         │                                       │              │
│         └───────────────────────────────────────┘              │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Backdrop: var(--bg-obsidian) at 90% opacity + blur(20px)
Modal: var(--bg-elev-1) with subtle border
```

### Mobile Treatment

Full-screen sheet, slides up from bottom. Feels native.

---

## STEP 1: WELCOME

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  [WooParcel Logo]                     │
│                                       │
│  Hey, welcome! 👋                     │
│                                       │
│  I'm going to help you get your       │
│  shipping sorted — easy and           │
│  stress-free.                         │
│                                       │
│  First, what should I call you?       │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Your name or brand              │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Now pick your guide:                 │
│                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐            │
│  │Marco│ │Omar │ │Rashid│            │
│  └─────┘ └─────┘ └─────┘            │
│  ┌─────┐ ┌─────┐ ┌─────┐            │
│  │Layla│ │Sophia│ │Zara │            │
│  └─────┘ └─────┘ └─────┘            │
│                                       │
│  ─────────────────────────────────── │
│                    [ Let's do this ] │
│                                       │
└───────────────────────────────────────┘
```

### Avatar Grid

| Avatar | Name | Visual Style |
|--------|------|--------------|
| 1 | Marcus | Professional male, suit |
| 2 | Omar | Professional male, glasses |
| 3 | Rashid | Friendly male, casual |
| 4 | Layla | Professional female, hijab |
| 5 | Sophia | Friendly female, casual |
| 6 | Zara | Professional female, suit |

### Interaction

- Name field auto-focuses on modal open
- Avatar selection: tap to select, selected has gold ring
- "Let's do this" button disabled until name entered + avatar selected
- Button enables with fade animation

### Avatar Selection Animation

```css
.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid transparent;
  transition: all 280ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.avatar:hover {
  transform: scale(1.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.avatar.selected {
  border-color: var(--accent-woop);
  box-shadow: 0 0 0 4px rgba(215, 122, 0, 0.2);
  transform: scale(1.05);
}
```

---

## STEP 2: YOUR STAGE

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  Nice to meet you, {name}! │
│  └──────┘  First things first:        │
│                                       │
│  Where are you in your journey?       │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🌱  I'm just getting started    │ │
│  │     No website yet, just ideas  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 📦  I already have a shop       │ │
│  │     Selling on Shopify, Woo...  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

### Branching Logic

- **"Just getting started"** → Skip to Step 4 (Products), then ask about "Build for me"
- **"Already have a shop"** → Go to Step 3 (Platform selection)

---

## STEP 3: YOUR STORE

### Layout (If "Already selling")

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  Great! Where do you sell? │
│  └──────┘                            │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🛍️  Shopify                      │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🟣  WooCommerce                  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 📦  Amazon                       │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🛒  Other / Multiple             │ │
│  │     Custom site, Etsy, eBay...  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

### Layout (If "Just getting started")

This step is replaced with:

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  Are you building your     │
│  └──────┘  site yourself, or do you  │
│            want us to handle it?     │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 💻  I'll build it myself        │ │
│  │     Just need shipping sorted   │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ ✨  Build the store for me      │ │
│  │     Done-for-you Shopify setup  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

---

## STEP 4: YOUR PRODUCTS

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  What are you planning     │
│  └──────┘  to sell?                  │
│                                       │
│            (Select all that apply —   │
│            helps us with shipping     │
│            rules)                     │
│                                       │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ 👕 Clothing      │ │ 🏠 Home    │ │
│  └──────────────────┘ └────────────┘ │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ 📚 Books         │ │ 📱 Elec.   │ │
│  └──────────────────┘ └────────────┘ │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ 💄 Beauty        │ │ 🌸 Perfume │ │
│  └──────────────────┘ └────────────┘ │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ 🍫 Food          │ │ 💎 Jewelry │ │
│  └──────────────────┘ └────────────┘ │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ ⚽ Sports        │ │ 🎮 Toys    │ │
│  └──────────────────┘ └────────────┘ │
│  ┌──────────────────┐ ┌────────────┐ │
│  │ 💊 Health        │ │ 🎨 Art     │ │
│  └──────────────────┘ └────────────┘ │
│  ┌────────────────────────────────┐  │
│  │ 📦 Other: [                  ] │  │  ← NEW: Text input
│  └────────────────────────────────┘  │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

### Product Categories (Expanded)

| ID | Label | Icon | Warning (if applicable) |
|----|-------|------|-------------------------|
| `clothing` | Clothing & Apparel | 👕 | — |
| `home` | Home & Garden | 🏠 | — |
| `books` | Books & Stationery | 📚 | — |
| `electronics` | Electronics | 📱 | May contain batteries |
| `beauty` | Beauty & Cosmetics | 💄 | — |
| `perfume` | Perfumes & Fragrances | 🌸 | Restricted item |
| `food` | Food & Beverages | 🍫 | Perishable / regulated |
| `jewelry` | Jewelry & Watches | 💎 | High value |
| `sports` | Sports & Outdoors | ⚽ | — |
| `toys` | Toys & Games | 🎮 | — |
| `health` | Health & Wellness | 💊 | May require docs |
| `art` | Art & Collectibles | 🎨 | Fragile |
| `other` | Other | 📦 | Free text input |

### Multi-select Behavior

```css
.product-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--bg-elev-2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}

.product-tag:hover {
  background: var(--bg-elev-3);
  border-color: rgba(255, 255, 255, 0.1);
}

.product-tag.selected {
  background: rgba(215, 122, 0, 0.1);
  border-color: var(--accent-woop);
}

.product-tag.selected::before {
  content: '✓';
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: var(--accent-woop);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
}
```

### Warning Handling

If user selects a category with a warning:

```
┌─────────────────────────────────────┐
│ ⚠️ Heads up: Electronics may        │
│ contain batteries, which require    │
│ special documentation. We'll        │
│ handle it — just letting you know!  │
└─────────────────────────────────────┘
```

Warning appears inline, below the grid, with subtle yellow tint.

---

## STEP 5: YOUR VOLUME (NEW)

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  How many orders do you    │
│  └──────┘  ship per month?           │
│                                       │
│            (Rough estimate is fine)   │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 📦  1 – 50 orders               │ │
│  │     Just getting started        │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 📦📦  50 – 200 orders            │ │
│  │     Growing steadily            │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 📦📦📦  200 – 1,000 orders       │ │
│  │     Scaling up                  │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🚀  1,000+ orders                │ │
│  │     Enterprise volume           │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

---

## STEP 6: YOUR REACH (NEW)

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  Where do you ship to?     │
│  └──────┘                            │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🇦🇪  UAE only                    │ │
│  │     Domestic deliveries         │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🌍  GCC region                   │ │
│  │     UAE, KSA, Kuwait, etc.      │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🌐  Worldwide                    │ │
│  │     Ship anywhere               │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

---

## STEP 7: YOUR VIBE

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  How should we talk to     │
│  └──────┘  your customers on         │
│            WhatsApp?                 │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 💼  Professional                 │ │
│  │     "Your order #123 has        │ │
│  │      been confirmed."           │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 🎉  Friendly & Fun              │ │
│  │     "Great choice! 🎉 We're     │ │
│  │      packing your order now!"   │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]              [ Continue ] │
│                                       │
└───────────────────────────────────────┘
```

---

## STEP 8: YOUR DETAILS

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  Almost done! 🎉           │
│  └──────┘                            │
│            Just need a way to send   │
│            you the login and stay    │
│            in touch.                 │
│                                       │
│  Surname (Optional)                   │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Email *                              │
│  ┌─────────────────────────────────┐ │
│  │ you@example.com                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Phone / WhatsApp *                   │
│  ┌─────────────────────────────────┐ │
│  │ +971 50 123 4567                │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ─────────────────────────────────── │
│  [ ← Back ]          [ Show me the   │
│                        plan →]       │
│                                       │
└───────────────────────────────────────┘
```

---

## STEP 9: YOUR PLAN (NEW)

### Layout

```
┌───────────────────────────────────────┐
│                                       │
│  ┌──────┐                            │
│  │Avatar│  {Name}, here's your       │
│  └──────┘  personalized plan!        │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │  RECOMMENDED FOR YOU            │ │
│  │  ─────────────────────          │ │
│  │                                 │ │
│  │  🚀 Growth Plan                 │ │
│  │     Perfect for {volume} orders │ │
│  │     shipping {reach}            │ │
│  │                                 │ │
│  │  ✓ Smart Routing (all carriers) │ │
│  │  ✓ {platform} Integration       │ │
│  │  ✓ WhatsApp Notifications       │ │
│  │  ✓ Customs Automation           │ │
│  │                                 │ │
│  │  Special for {products}:        │ │
│  │  ✓ {relevant feature}           │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │     [ Start Free — No Card ]    │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Need to talk first?                  │
│  [ Schedule a call with our team ]   │
│                                       │
└───────────────────────────────────────┘
```

### Personalization Logic

| User Input | Plan Adaptation |
|------------|-----------------|
| Volume 1-50 | "Starter Plan" — emphasize simplicity |
| Volume 50-200 | "Growth Plan" — emphasize scaling |
| Volume 200-1000 | "Scale Plan" — emphasize automation |
| Volume 1000+ | "Enterprise" — emphasize dedicated support |
| Products: Electronics | Add "Dangerous Goods Handling" |
| Products: Perfume | Add "Fragrance Compliance" |
| Products: Food | Add "Perishable Routing" |
| Reach: Worldwide | Add "Global Customs Automation" |
| Platform: Shopify | Show "1-click Shopify install" |
| Build for me | Add "Done-For-You Store" as first feature |

---

## STEP TRANSITIONS

### Animation Between Steps

```javascript
// Exit current step
{
  opacity: 0,
  x: -20,
  transition: { duration: 0.2, ease: "easeIn" }
}

// Enter next step
{
  opacity: 1,
  x: 0,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }
}
```

### Progress Bar

Linear progress indicator at bottom:

```css
.progress-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-woop);
  transition: width 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Progress values:
- Step 1: 12%
- Step 2: 24%
- Step 3: 36%
- Step 4: 48%
- Step 5: 60%
- Step 6: 72%
- Step 7: 84%
- Step 8: 96%
- Step 9: 100%

---

## DATA STRUCTURE

```typescript
interface OnboardingData {
  // Step 1
  name: string;
  avatar: 'marcus' | 'omar' | 'rashid' | 'layla' | 'sophia' | 'zara';

  // Step 2
  stage: 'starting' | 'selling';

  // Step 3
  platform?: 'shopify' | 'woocommerce' | 'amazon' | 'other';
  buildForMe?: boolean;

  // Step 4
  products: string[];  // Array of category IDs
  productsOther?: string;  // Free text if "other" selected

  // Step 5
  volume: '1-50' | '50-200' | '200-1000' | '1000+';

  // Step 6
  reach: 'uae' | 'gcc' | 'worldwide';

  // Step 7
  vibe: 'professional' | 'friendly';

  // Step 8
  surname?: string;
  email: string;
  phone: string;
}
```

---

## MOBILE OPTIMIZATIONS

- Full-screen modal (sheet from bottom)
- Larger tap targets (56px minimum)
- Sticky footer with progress + buttons
- Avatar grid: 3×2 instead of 6×1
- Product tags: 2-column grid
- Keyboard avoidance on input focus

---

**Next Document:** `05-design-tokens.md` — Complete token system
