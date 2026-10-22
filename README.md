# Nuvé — skincare homepage

A single-page, responsive editorial skincare concept built with vanilla JavaScript, CSS, and Vite. Only the homepage is implemented. There is no backend, skin analysis, camera capture, checkout, or form submission.

## Development

Node.js 22.12+ (validated with Node 24.19.0).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
npm run build
npm test
```

Browser tests use `/usr/bin/chromium`; set `CHROMIUM_PATH` to another installed Chromium executable if needed. The test runner starts the development server automatically when necessary.

## Assets

All replaceable photography paths are centralized in `src/assets.js`:

- `public/assets/hero-portrait.webp` — original AI-generated studio portrait.
- `public/assets/cream-application.webp` — original AI-generated moisturizer application portrait.
- `public/assets/nuve.svg` — original vector brand flower, built directly in SVG.

The original generated PNGs are retained in `/workspace/generated_images` in the creation environment. Optimized WebP copies are included in this project. The photos were generated for this implementation, not sourced from a stock library. They are interpretations of the reference, not exact reproductions of its models or crops.

The hero intentionally uses a still image. Video generation was unavailable. It does not simulate blinking or head movement. Set `heroVideo` in `src/assets.js` to an isolated portrait clip with matching framing to enable muted, looping inline video. Facial overlay coordinates live in the `.scan-box` CSS selectors and assume the current crop; a materially different face composition requires alignment adjustments. Offscreen video pauses automatically. Reduced-motion users receive the still poster.

## Interaction and motion

Three sections match the provided direction: portrait hero, split AI Skincare / Mindful Beauty, and a scroll-emphasized statement with floating badges. Scrolling remains native. CSS handles entrances; IntersectionObserver and one requestAnimationFrame scroll handler coordinate reveals and emphasis. Reduced-motion preferences make content stable and readable.

Analyze Skin, Contact Us, and App Store buttons open native accessible dialogs explaining the preview or availability. Statistics and trust count reproduce the supplied concept copy and are not independently verified product claims. The analysis dialog identifies the demonstration explicitly.

## Verification

Playwright covers image loading, section structure, browser errors, dialog keyboard behavior and focus restoration, mobile navigation, overflow at six widths, scroll reveals, and reduced motion. Desktop and mobile screenshots were also reviewed manually during implementation.
