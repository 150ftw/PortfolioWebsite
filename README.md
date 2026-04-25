# Shivam Sharma — Portfolio

An Awwwards-level, rule-breaking personal portfolio. Next.js 14 (App Router),
TypeScript, Tailwind, Framer Motion, GSAP.

## Quickstart

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build & type-check

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build
```

## Deploy

```bash
# One-shot Vercel deploy
npx vercel --prod
```

## Stack

- **Framework:** Next.js 14 (App Router) + React 18
- **Styling:** Tailwind CSS + raw CSS (`app/globals.css`)
- **Animation:** Framer Motion (entrance, cursor, shared-layout boot transition, contact bg) + GSAP/ScrollTrigger (Hero scale-blur, About horizontal-scroll pin, Projects sticky peel)
- **Icons:** lucide-react
- **Fonts:** Bebas Neue · Playfair Display · JetBrains Mono · DM Sans — all via `next/font`

## Structure

```
app/
  layout.tsx       ← fonts, metadata
  page.tsx         ← stitches sections & boot gate
  globals.css      ← reset, cursor hiding, marquee keyframes, reduced-motion
components/
  BootScreen.tsx         ← once-per-session boot with shared-layoutId → Hero
  CustomCursor.tsx       ← dual-layer, spring-damped, hover states
  ScrollProgress.tsx     ← left-edge acid-green progress line
  Navbar.tsx             ← desktop right-edge strip + mobile full-screen takeover
  Hero.tsx               ← asymmetric oversized hero with scale-blur on scroll-out
  About.tsx              ← horizontal-scroll pin (GSAP) with 3 panels + live terminal
  Projects.tsx           ← sticky peel stack, CSS wireframe on hover
  Skills.tsx             ← 5 marquee rows with hover tooltips
  Blog.tsx               ← asymmetric editorial grid
  Contact.tsx            ← giant type, clipboard copy, fade bg
  Footer.tsx             ← slim 80px bar
  Marquee.tsx            ← reusable bidirectional marquee
lib/
  data.ts          ← all content (owner, projects, skills, blog, nav)
```

## Notes

- Respects `prefers-reduced-motion` — cursor disables, GSAP scroll
  effects bail, animations become near-instant.
- Horizontal-scroll About falls back to vertical stacked panels on
  mobile / reduced motion.
- Custom cursor is disabled on touch devices.
- All content is in `lib/data.ts`; components are pure layout.
