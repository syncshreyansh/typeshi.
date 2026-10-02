# Typeshi: Design and Project Context

> Read this file AND DESIGN.md (the newformcap design analysis) before every task. If an instruction conflicts with these files, follow the files and report the conflict.

## Project
Typeshi is an apparel brand selling T-shirts, hoodies and caps as a catalogue. We are building the FRONTEND ONLY, in React + JavaScript (not TypeScript), Tailwind CSS, GSAP + ScrollTrigger, Lenis, framer-motion, react-router-dom and zustand. All products, logos and images are DEMO placeholders that must be swappable from one data file. Users can add items to a cart and "order" through a frontend-only checkout (no backend, no real payment).

## Reference
The design is a faithful adaptation of newformcap.com (a stark editorial finance site) re-skinned for an apparel brand. DESIGN.md holds its design tokens. The essentials are repeated here so nothing is missed.

## Visual identity (non-negotiable)
- Canvas: #fafffa (pale mint-white). Ink/headlines: #121613 (deep green-black). Muted body: #516254. Muted-soft: #3a463c. Surface-dark: #232924. Primary button bg: #2e3830. Hairline: #c8d2c8. On-dark text: #fafffa.
- ONE accent: electric green #2bee4b. Used ONLY as thin lines and tiny graphics (wordmark underline, menu equalizer bars, small arrow icons, hairline underlines, the Venn intersection triangle, focus outlines, progress line). NEVER as a large fill or background.
- Typeface: ONE family. Use Google Sans Flex (@fontsource-variable/google-sans-flex), with the ROND axis at 0. Hierarchy comes from scale and weight only:
  - display-xl: 155px at 1440px+, weight 550, line-height 1.0, letter-spacing about -0.04em (-6.2px at 155px), scaling fluidly with clamp() down to mobile
  - label: 18px / 550 / -0.36px (wordmark, Menu, small UI labels)
  - body: 16px / weight 200 (thin) / line-height 1.4 / letter-spacing 0.16px, color muted
  - Add intermediate heading sizes for interior pages, but never a style that competes with the hero.
- Radius: sm 5, md 8, lg 10 (dominant: image tiles, buttons), xl 14. Nothing pill-shaped.
- Spacing: 8, 10, 15, 20, 30, 40, 50 (page margin on desktop), 80, 120 (between major sections). Mobile margin 20px.
- Shadows are green-tinted, never neutral black: strong 1px 8px 20px rgba(16,94,29,0.45), soft 1px 8px 20px rgba(18,146,39,0.25). Use them only on elevated tiles and cards. Everything else is flat.
- Photography: black-and-white only (CSS grayscale), rounded 10px, on a #232924 fallback.
- Signature move: a huge headline whose lines have rounded B&W image tiles sitting INLINE between the words, alternating landscape and portrait, sized in em so they scale with the type.
- Chrome is minimal: no nav bar background. The wordmark sits top-left, the "Menu" text trigger plus a 3-bar green equalizer sits top-right, both with ~50px margins. Corner chrome stays pinned at every size.
- Focus states: thin #2bee4b outline. Touch targets at least 44px.
- DESIGN.md says "no hover styling beyond default + pressed". For this project we override that ONLY for motion (animations); colors, type and tokens stay exactly as specified.

## Typeshi adaptation
- Brand: "Typeshi". Wordmark in label style with a short 2px #2bee4b underline under "Type" (like the underline under "New" on the reference).
- Pages: Home, Shop (with category filters), Product detail, Cart drawer, Checkout (+ confirmation), About, Contact, 404.
- Hero copy: "Wear / the Culture / Stitched for / the Streets" (4 lines) with inline B&W tiles.
- Menu overlay links: Home, Shop, About, Contact, plus a "Get in touch" block (email, Instagram, each with a small green arrow).

## Reference-site structure (newformcap.com) mapped to Typeshi
1. Preloader: "0%" counter with "Loading..." text, then reveal.
2. Hero: 4-line display headline. Each line has TWO image tiles (a "crypto" set and an "NYSE" set), so tiles swap between two images. A "Scroll" label sits at the bottom. Typeshi maps this to a tees set and a streetwear set.
3. Story: a pinned/tall section with three images and a statement split over lines: "Our existing / financial system / is archaic..." (Typeshi: "Our existing / wardrobe / is boring..."), then an "Innovators" heading and a "View Portfolio" button (Typeshi: "The Drop" and "View Collection").
4. Marquee one: huge rows of text ("Wall Street Capitalism" / "Running on Blockchain Rails") with images between the words.
5. Numbered list 01, 02, 03 of featured companies with logos (Typeshi: featured products), under a heading "Next-gen markets need next-gen founders" and a View Portfolio button.
6. Three category panels with textured backgrounds: Finance, Data, Blockchain (Typeshi: Tees, Hoodies, Caps).
7. "Our Unique Approach": a 3-circle Venn diagram with a green triangle at the intersection and a "Get in touch" button (Typeshi: Design, Fabric, Fit).
8. Intro paragraph with a "Meet the team" link, then stats: "90%+", "100%", "30+", "100M+", "2019" with short labels (Typeshi: demo stats).
9. Marquee two: "Bridging the Old" ... "With the New" with two images between.
10. Footer: large email, "Get in touch" button, link columns with small green arrows, copyright, address, and a "Top of Page" green arrow button.
11. Menu overlay: Home / Portfolio / Team links, a "Get in touch" block with Email and LinkedIn each with a green arrow, and a Close button.

## Motion language (final animation step)
Confident and editorial, not bouncy. Smooth Lenis scrolling, a counting preloader, line-masked text reveals, image tiles that wipe in with clip-path and swap between two images (on scroll or hover), pinned scroll-scrubbed storytelling, marquees that react to scroll velocity, a clip-path menu overlay with staggered link reveals, a hairline-drawing and cursor-following-image list, accordion category panels, an SVG Venn that draws and overlaps on scroll, count-up stats, and a letter-by-letter footer wordmark. Use expo-out easing (cubic-bezier(0.16,1,0.3,1) / GSAP expo.out), no overshoot. Animate transform, opacity and clip-path only. Respect prefers-reduced-motion.

## Hard rules
- One typeface only. No second font.
- Green accent stays scarce.
- No black shadows.
- Frontend only, with demo data.
- Always re-verify against this file and DESIGN.md before finishing a task.

## NO "AI-LOOK" RULES (hard rules)
This site must look hand-designed by a human editorial designer, never generated by an AI tool. Every button, text block, card, and section must have its own deliberate character, and no two components should feel like copies of the same template.

BANNED visuals:
- Glows, outer halos, neon borders, glowing dots, "blinking" or pulsing lights, status-dot pulses, shimmer or sheen sweeps, spotlight/radial-gradient hover effects
- Any gradient fills, gradient text, purple/indigo/blue-violet palettes, mesh gradients, aurora or blurred color blobs, floating orbs, particle or grid-dot backgrounds, noise-overlay gimmicks
- Glassmorphism (frosted blur cards), translucent panels with white borders
- Sparkle or star icons, magic-wand icons, robot icons, "AI-powered" badges, emoji used as icons
- Pill-shaped gradient buttons, buttons with an icon inside a colored circle, "Get started ->" style stock CTAs, a pill badge above the hero headline
- The generic layout pattern: centered hero + subtitle + two buttons, then a row of three identical icon-on-top feature cards, then a testimonial carousel, then a pricing table
- Identical repeated cards, uniform grids where every cell looks the same, and every section centered
- Default component-library looks (default shadcn/Material/DaisyUI styling), stock icon rows used as decoration
- Bouncy spring overshoot on everything, typewriter text effects, floating or levitating elements, endlessly looping idle animations, cursor sparkle trails, tilt-on-hover 3D cards on every card, animated gradient borders
- Neutral black drop shadows. The ONLY shadows allowed are the two green-tinted ones in DESIGN.md, used with their exact values (1px 8px 20px) on elevated cards, never as a glow or halo around anything

REQUIRED instead:
- Editorial, print-like, confident. Scale, whitespace, hairlines, big type, and cropped B&W photography do the work.
- Buttons: 3 distinct variants, each used for a clear purpose. (a) Solid: #2e3830, 10px radius, label type, with a text-roll on press/hover (the label slides up and a duplicate slides in). (b) Text link: no box, label type, with an underline that draws in from the left and a small green arrow that shifts. (c) Outline: 1px hairline border, fills to ink on hover with a clip-path wipe from the bottom. No icons in circles, no gradients, no glow.
- Cards: product cards must not all look alike. Vary aspect ratios (portrait/landscape/square) and stagger the grid vertically; use oversized index numbers, small rotated or inset tags, price in label style, hairline dividers, and unusual image crops. Let the layout feel composed, not templated.
- Text: tight display type, mixed scale within a line, deliberate line breaks. No filler SaaS copy; write short, specific, apparel-focused copy with some attitude.
- Sections: vary composition from section to section (left-aligned, off-grid, full-bleed, asymmetric, overlapping tiles). No two consecutive sections share the same layout.
- Icons: only a few custom-drawn simple SVG arrows and a cart mark. No icon libraries as decoration.
- Motion: every animation must have a purpose (reveal, transition, feedback, or storytelling) and be triggered by load, scroll, or user action. Allowed idle loops: only the marquees and the 3-bar menu equalizer from the reference. Expo-out/power4 easing, no overshoot, short and precise.
- Color: only the palette in DESIGN.md. #2bee4b is a thin line or tiny graphic, never a fill, glow, or text color on large type.

SELF-CHECK before finishing any task: look at each component and ask "does this look like a default AI/template output?" If yes, redesign it with more character. List any element you changed for this reason.

## Resolved decisions

1. Primary/solid button: background `#2e3830`, label color `#fafffa` (NOT `#000000`, which fails contrast).
2. Hover/press: DESIGN.md's "no hover styling" rule is overridden for MOTION only (text-roll, underline draw, clip-path wipe). Colors, type and tokens stay as specified.
3. Intermediate headings (h2/h3) are allowed on interior pages, kept restrained so they never compete with the hero.
4. Links use the custom editorial text-link treatment (ink color, drawn underline, small green arrow), never browser-default blue.

## Font decision

The only typeface is Google Sans Flex (open source, OFL), loaded via `@fontsource-variable/google-sans-flex` with the CSS family `Google Sans Flex Variable`, sans-serif. It replaces TWK Lausanne. Keep the ROND (roundness) axis at `0` for a crisp editorial look. Never add a second font.

## Resolved decisions v2 (reference phase)

THIS SECTION SUPERSEDES every earlier rule it contradicts, including the 'Font decision' (one typeface only), 'Resolved decisions' item 1 (solid button #2e3830), the NO AI-LOOK RULES bans on typewriter text and idle loops, and the rule that #2bee4b is only a thin line. Where v2 is silent, the earlier rules still apply.

- Fonts: Google Sans Flex stays the main face. Add two display faces ONLY for: marquee words, Venn labels, the faint huge "Get in touch" in the menu, and the preloader "Loading..." label. Serif = Instrument Serif, pixel = Pixelify Sans (via `@fontsource`, ONLY the weights used). Expose as Tailwind `fontFamily` tokens: `serif-display`, `pixel-display`. Never use them for body or UI text.
- Solid button: background `#2bee4b`, label `#121613`, 10px radius. Put the colour in ONE CSS variable (`--btn-solid-bg` / `--btn-solid-fg`) so it can be reverted in one line. Text-roll hover stays.
- Allowed new effects: typewriter text with a blinking green `_` cursor, text scramble, curved (wavy) section edges, a static grain texture on the menu image panel, and one full-screen `#2bee4b` flash in the Approach section. Still banned: glows, gradients, glass/blur, bounce/overshoot, confetti, tilt cards, and black shadows.
- Allowed idle loops are now: the marquees, the 3-bar menu equalizer, and the blinking typewriter cursor (the green '_', 0.55s). Nothing else may loop idly.
- Dark sections use `#121613` (not `#232924`) for full-bleed scenes.
