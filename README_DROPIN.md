# Drop-in: Glitch + Responsive Cards

This bundle is designed to work **without editing your existing HTML structure**.

## Files
- `glitch-cards.css` — styles for the glitch effect and a responsive card grid.
- `glitchify.js` — mirrors your main hero/profile image and applies a broken LED/TV glitch (flicker + RGB splits + scanlines + slices).

## How to use (copy/paste exactly)
1) Upload both files to the **root** of your GitHub Pages repo `aujl/Profile-page` (same level as your `index.html`).  
2) In your `index.html`, add (once) inside `<head>` and before `</body>` respectively:

```html
<link rel="stylesheet" href="glitch-cards.css">
```
```html
<script src="glitchify.js" defer></script>
```

> If you strictly cannot edit HTML, add these two lines through whatever include your site already uses (e.g., your main CSS/JS bundler).

## What it does
- **Mirrors** the primary image (first `<img>` inside `#home`, or otherwise the largest image on the page).
- Adds: **flicker**, **scanlines**, **RGB channel splits**, and **independent horizontal slices** that jitter → broken LED/TV vibe.
- **No external assets** required (noise uses a tiny inline data-URI).
- Respects **`prefers-reduced-motion`** (disables the heavy motion automatically).
- **Responsive card layout**: if your page already has sections like `.cards`, `.projects`, `.services`, `.highlights` with child elements (`.card`, `.project`, `.service`, etc.), this CSS automatically upgrades them to a modern grid with Wintermute-like hover behavior.

## Removing or toning down the effect
- Delete the two lines you added or comment them out.
- Or customize the timings in `glitch-cards.css` (`@keyframes gc-flicker`, `gc-jitter-x`, `gc-jitter-y`).

## Notes
- This solution does **not** assume specific file paths or image names.
- If your main image is elsewhere, the script falls back to the **largest** image on the page.
