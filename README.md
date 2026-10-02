# Typeshi &mdash; Frontend Storefront

Typeshi is an editorial apparel storefront (T-shirts, hoodies, caps) built with React 18, Vite, Tailwind CSS v3.4, React Router v7, GSAP + @gsap/react + ScrollTrigger + Flip, Lenis, and Zustand.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 22 and Node 24)
- npm 9+

### Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts Vite local development server with hot reload |
| `npm run build` | Produces an optimized production build in `dist/` with zero warnings |
| `npm run preview` | Serves the production build locally (default port 4173) |

To run the preview on a specific host/port:
```bash
npx vite preview --host 127.0.0.1 --port 4173
```

---

## 2. Project Structure

```text
typeshi/
├── dist/                   # Production build outputs (HTML, split JS/CSS chunks, fonts)
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components & layouts
│   │   ├── ui/             # Core UI elements (Button: Solid, TextLink, Outline)
│   │   ├── Arrow.jsx       # Editorial green accent arrow icon
│   │   ├── CartDrawer.jsx  # Slide-out cart drawer with quantity & remove controls
│   │   ├── Footer.jsx      # Global footer with staggered wordmark & email link
│   │   ├── Header.jsx      # Fixed header with 3-bar equalizer, nav & cart counter
│   │   ├── Layout.jsx      # Main layout shell with scroll progress & route tracker
│   │   ├── Logo.jsx        # SVG brand wordmark with thin green accent underline
│   │   ├── MenuOverlay.jsx # Full-screen navigation overlay (Esc / trap / focus return)
│   │   ├── MotionGlobals.jsx # Desktop magnetic button hover controller
│   │   ├── Preloader.jsx   # One-time session preloader with 0-100 count roll
│   │   ├── ProductCard.jsx # Grid card with image swap, swatches, price
│   │   ├── ProductImage.jsx # Adaptive product image with SVG silhouette fallback
│   │   ├── RouteTransition.jsx # Dark curtain route wipe on navigation
│   │   ├── SmoothScroll.jsx # Lenis smooth scroll provider synced to GSAP ticker
│   │   └── Tile.jsx        # Grayscale photography tile with dark fallback
│   ├── data/               # Single source of truth for demo data
│   │   ├── faqs.js         # FAQ items for Contact page
│   │   ├── heroTiles.js    # Unsplash image URLs for Hero, Story, and Marquees
│   │   ├── products.js     # Catalog products, prices, colors, descriptions, slugs
│   │   ├── site.js         # Site metadata, store hours, contact email, social URLs
│   │   └── README.md       # Asset swapping guidelines
│   ├── hooks/              # Custom React motion & layout hooks
│   │   ├── useLineReveal.js # Editorial line/headline reveal on scroll
│   │   ├── useMarqueeMotion.js # Seamless bidirectional marquee ticker with velocity skew
│   │   └── useReducedMotion.js # prefers-reduced-motion listener
│   ├── lib/                # Shared utilities & animation helpers
│   │   ├── format.js       # Currency (INR) and date formatting helpers
│   │   ├── meta.js         # Document title & meta tag management per route
│   │   └── motion.js       # GSAP plugin registry and easing curves
│   ├── pages/              # Routed page components (lazy loaded with Suspense)
│   │   ├── About.jsx       # Brand editorial & values
│   │   ├── Checkout.jsx    # Form validation, summary, simulated order confirmation
│   │   ├── Contact.jsx     # Studio inquiry form & FAQ accordion
│   │   ├── Home.jsx        # Eager landing page composing all editorial sections
│   │   ├── LegalPage.jsx   # Terms of Service & Privacy Policy views
│   │   ├── NotFound.jsx    # Editorial 404 page with return link
│   │   ├── Product.jsx     # Product detail view (color, size, qty, fly-to-cart)
│   │   └── Shop.jsx        # Catalog grid with Flip sort/filter & batch reveal
│   ├── sections/           # Modular Home page sections
│   │   ├── Approach.jsx    # Venn diagram SVG draw & philosophy copy
│   │   ├── Categories.jsx  # Interactive 3-panel expanding vertical accordion
│   │   ├── FeaturedList.jsx # Cursor-following image preview & row reveals
│   │   ├── FinalCta.jsx    # Masked heading reveal & primary CTA
│   │   ├── Hero.jsx        # Asymmetric grid, word reveal, tile swap & parallax
│   │   ├── MarqueeOne.jsx  # Material principles forward marquee
│   │   ├── MarqueeTwo.jsx  # Editorial tagline reverse marquee
│   │   ├── Stats.jsx       # Numeric counters roll-up on scroll
│   │   └── Story.jsx       # Statement word highlight & desktop pinned section
│   ├── store/              # State management
│   │   └── cart.js         # Zustand cart store with localStorage persistence
│   ├── App.jsx             # React Router configuration & Suspense boundary
│   ├── index.css           # Tailwind base, typography utility classes, keyframes
│   └── main.jsx            # React root mount
├── DESIGN.md               # Visual design reference and layout analysis
├── DESIGN_CONTEXT.md       # Design system rules, typography weights, color palette
├── index.html              # HTML shell & Google Sans Flex font preload
├── tailwind.config.js      # Editorial design tokens, radii, colors, spacing
└── vite.config.js          # Vite build config & code splitting
```

---

## 3. How to Swap Demo Data & Assets

All content and media are configured in one central location: `src/data/`.

### 1. Swapping Products & Pricing (`src/data/products.js`)
Edit `products` array in `src/data/products.js`:
- `id`, `name`, `slug`: Unique identifiers and URL slugs.
- `price`: Number in INR (formatted as `&#8377;` with Indian numeral grouping, e.g. `2,400`).
- `category`: `'tees'`, `'hoodies'`, or `'caps'`.
- `colors`: Array of `{ name, hex }` swatch values.
- `images`: Array of image source URLs `{ src: 'https://...' }`. If empty or failing, `<ProductImage />` automatically renders an SVG garment silhouette on `#232924` surface-dark.
- `details`: Fabric weight, composition, care instructions, and accordion content.

### 2. Swapping Hero & Editorial Photography (`src/data/heroTiles.js`)
Edit URLs in `src/data/heroTiles.js`:
- `heroTiles`: Array of tile objects with category photo URLs.
- The `<Tile />` component applies CSS grayscale and 10px corner radius, falling back cleanly to the `#232924` surface block on error.

### 3. Swapping Brand Identity, Logo & Socials (`src/data/site.js` & `src/components/Logo.jsx`)
- Site configuration: Change name, email, address, and social links in `src/data/site.js`.
- Brand Wordmark: The SVG logo is located in `src/components/Logo.jsx`. It includes the brand text and the single signature 2px green underline (`#2bee4b`).

---

## 4. Design System & Anti-AI-Look Rules Summary

### Typography
- **Single Typeface**: Google Sans Flex Variable (`@fontsource-variable/google-sans-flex`) exclusively. No secondary font or system fallback stack.
- **Font Weights**:
  - Display / Headings: `550` (`font-medium` / `font-display`, letter-spacing `-0.02em` to `-0.04em`)
  - Labels / Subheadings / Numbers: `550` (`font-label`, uppercase, letter-spacing `0.08em` to `0.1em`)
  - Body Text: `200` (`font-light` / `font-body`, leading `1.5` to `1.6`)

### Color Palette
| Token | Hex Value | Usage |
|---|---|---|
| `canvas` | `#fafffa` | Primary background canvas |
| `ink` | `#121613` | Primary text and dark borders |
| `muted` | `#516254` | Secondary text, sub-labels, swatches |
| `surface-dark`| `#232924` | Dark backgrounds (Categories, Cart drawer, Menu, Preloader) |
| `button` | `#2e3830` | Solid button background (with `#fafffa` text) |
| `hairline` | `#c8d2c8` | Subtle 1px dividers and borders |
| `accent` | `#2bee4b` | **ONE accent only**: Thin lines (1-2px), arrows, equalizer bars, focus ring, progress bar. Never large fills or glow. |

### Anti-AI-Look Principles
- **No Gradients, Glows, or Blurs**: Strictly zero gradients, halos, glows, backdrop-filter blur, glassmorphism, or black shadows.
- **Strictly Two Shadows**: Modal/drawer shadow (`1px 8px 20px rgba(16, 94, 29, 0.45)`) and subtle hover shadow (`1px 8px 20px rgba(18, 146, 39, 0.25)`).
- **Geometric Radii**: 10px dominant corner radius on cards, tiles, and buttons (`rounded-lg`). No pill-shaped buttons.
- **Micro-interactions**: Only transforms, opacity, and clip-path animations. Clean `expo.out` or `power4.out` easing. No spring overshoots or bouncy physics.

---

## 5. Animation Architecture & Ownership Table

Every animation in the codebase has a single owner file, cleans up properly on route unmount, and respects `prefers-reduced-motion`:

| Animation Description | Trigger / Lifecycle | Owner File | Reduced Motion Fallback |
|---|---|---|---|
| **Numeric Preloader** | First session load; rolls 0&rarr;100 | `src/components/Preloader.jsx` | Immediately dismissed; static UI rendered |
| **Smooth Scroll** | Continuous wheel scroll synced to GSAP ticker | `src/components/SmoothScroll.jsx` | Disabled; native browser scrolling used |
| **Menu Equalizer** | Idle loop (3-bar staggered vertical scale) | `src/components/Header.jsx` | 3 static equalizer bars |
| **Header Theme Inversion** | ScrollTrigger scroll observer over dark sections | `src/components/Header.jsx` | Theme inverts statically via ScrollTrigger |
| **Scroll Progress Line** | ScrollTrigger window scroll progress (scaleX 0&rarr;1) | `src/components/Header.jsx` | Static 1px line |
| **Route Wipe Transition** | Pathname navigation change (curtain wipe) | `src/components/RouteTransition.jsx` | Instant route switch |
| **Hero Stagger Reveal** | Preloader done / route mount; expo.out text & tile clip-path | `src/sections/Hero.jsx` | Instant final state (clip-path: 0, opacity: 1) |
| **Hero Tile Swap & Parallax**| Desktop scroll scrub & pointer hover | `src/sections/Hero.jsx` | Disabled on touch & reduced motion |
| **Story Pin & Word Highlight**| Desktop ScrollTrigger pin with scrub word opacity | `src/sections/Story.jsx` | No pin; words fully visible at opacity 1 |
| **Story Image Parallax** | Desktop ScrollTrigger scrub scale & rotation | `src/sections/Story.jsx` | Static layout; no parallax |
| **Marquee One (Forward)** | Continuous loop when in view (paused out of view) | `src/sections/MarqueeOne.jsx` & `src/hooks/useMarqueeMotion.js` | Static track at x: 0 |
| **Featured List Row Reveal** | ScrollTrigger entry reveal on scroll into view | `src/sections/FeaturedList.jsx` | Immediate display |
| **Featured Cursor Preview** | Desktop pointermove following mouse coordinates | `src/sections/FeaturedList.jsx` | Hidden on touch and mobile devices |
| **Categories Accordion** | Desktop pointer / focus expansion; mobile clip-path | `src/sections/Categories.jsx` | Static 3-panel layout |
| **Approach Venn Draw** | ScrollTrigger SVG circle strokeDashoffset animation | `src/sections/Approach.jsx` | Fully drawn circles & labels visible |
| **Stats Counter Roll** | ScrollTrigger numeric count-up on scroll | `src/sections/Stats.jsx` | Final formatted values shown immediately |
| **Marquee Two (Reverse)** | Continuous reverse ticker when in view | `src/sections/MarqueeTwo.jsx` & `src/hooks/useMarqueeMotion.js` | Static track at x: 0 |
| **Final CTA Masked Reveal** | ScrollTrigger yPercent mask slide-up | `src/sections/FinalCta.jsx` | Title at final position |
| **Footer Letters Stagger** | ScrollTrigger letter-by-letter slide-up | `src/components/Footer.jsx` | Wordmark fully visible |
| **Shop Flip & Batch Reveal** | Filter tab click / sort selection & initial scroll | `src/pages/Shop.jsx` | Instant DOM reordering; no Flip tween |
| **Fly-to-Cart Curve** | "Add to bag" button click | `src/pages/Product.jsx` | Instant count update; drawer opens |
| **Cart Drawer Slide** | Cart button click / Esc / backdrop click | `src/components/CartDrawer.jsx` | Standard slide transition with scroll lock |
| **Magnetic Buttons** | Desktop pointermove within button bounds | `src/components/MotionGlobals.jsx` | Disabled on touch & reduced motion |
| **Editorial Line Reveal** | ScrollTrigger line-by-line slide-up | `src/hooks/useLineReveal.js` | Immediate opacity 1 |

---

## 6. Accessibility & Keyboard Navigation

- **Focus Ring**: Custom 1px solid `#2bee4b` outline with 2px offset visible on keyboard tab navigation.
- **Escape Key Handling**: Closes both Menu overlay and Cart drawer, automatically returning focus to the trigger button.
- **Screen Readers**:
  - All decorative tiles and icons have `aria-hidden="true"`.
  - Marquee duplicate tracks have `aria-hidden="true"`.
  - Icon-only buttons (Close, Cart, Bag) have explicit `aria-label` attributes.
  - Form fields include tied `<label for="...">` associations and `aria-live="polite"` error notifications.
- **Touch Targets**: All interactive elements maintain a minimum touch target size of 44px.
