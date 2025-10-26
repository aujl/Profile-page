/* ===== Drop-in: Glitchify (mirrored + flicker + broken LED distortion) =====
   Works without changing your HTML:
   - Finds a likely "hero/profile" image (inside #home or first large <img>).
   - Wraps it in a glitch container, mirrors it, adds flicker, scanlines, RGB splits,
     and vertical slices that jitter (broken LED/TV feel).
   - Respects prefers-reduced-motion.
   - No external assets: inline noise (data URI).
=========================================================================== */
(function () {
  const d = document;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Try to find an image in #home; else the largest image on the page.
  function pickHeroImage() {
    const home = d.querySelector('#home') || d.querySelector('section[id*="home" i]') || d.body;
    let img = home.querySelector('img');
    if (!img) {
      const imgs = Array.from(d.images);
      imgs.sort((a,b) => (b.naturalWidth*b.naturalHeight) - (a.naturalWidth*a.naturalHeight));
      img = imgs[0];
    }
    return img || null;
  }

  // 2) Tiny noise PNG (8x8) as data URI
  const NOISE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAIElEQVQYV2NkYGD4z0AEYBxVSFQGTYAJRk0QyUAwGkQZAgA8agYwz1cWJwAAAABJRU5ErkJggg==';

  function makeGlitch(img) {
    if (!img || img.dataset.gcGlitched) return;
    img.dataset.gcGlitched = '1';

    // Create wrapper
    const wrap = d.createElement('div');
    wrap.className = 'gc-glitch-wrap';

    // Insert wrapper around the image
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    img.classList.add('gc-glitch-img', 'gc-flicker');

    // Grain overlay
    const grain = d.createElement('div');
    grain.className = 'gc-grain';
    grain.style.backgroundImage = `url("${NOISE}")`;
    grain.style.backgroundRepeat = 'repeat';
    wrap.appendChild(grain);

    // Scanlines overlay
    const scan = d.createElement('div');
    scan.className = 'gc-scanlines';
    wrap.appendChild(scan);

    // Create RGB split layers by cloning the image into absolutely positioned layers
    const channels = ['r','g','b'];
    const isPortrait = img.classList.contains('gc-layer-mirror');
    channels.forEach((c) => {
      const layer = img.cloneNode(true);
      layer.removeAttribute('srcset');
      // ensure cloned layers don't keep the base image class which disables transforms
      layer.classList.remove && layer.classList.remove('gc-glitch-img');
      layer.classList.add('gc-glitch-layer', `gc-layer-${c}`, 'gc-flicker');
      if (isPortrait) {
        layer.classList.add('gc-layer-mirror');
      }
      wrap.appendChild(layer);
    });

    // Create a few horizontal slices that jitter independently
    const sliceCount = 9;
    const wrapRect = wrap.getBoundingClientRect();
    const h = wrapRect.height || img.naturalHeight || 320;
    for (let i=0; i<sliceCount; i++) {
      const slice = img.cloneNode(true);
      slice.removeAttribute('srcset');
      slice.classList.remove && slice.classList.remove('gc-glitch-img');
      slice.classList.add('gc-glitch-layer', 'gc-layer-slice', 'gc-flicker');
      if (isPortrait) {
        slice.classList.add('gc-layer-mirror');
      }
      const top = Math.floor((h / sliceCount) * i + (i ? Math.random()*3 : 0));
      const height = Math.floor(h / sliceCount + (Math.random()*4 - 2));
      slice.style.clipPath = `inset(${top}px 0 ${Math.max(h - (top+height),0)}px 0)`;
      slice.style.animation = `${i%2===0 ? 'gc-jitter-x' : 'gc-jitter-y'} ${0.6 + Math.random()*0.9}s infinite steps(2,end)`;
      slice.style.opacity = String(0.3 + Math.random()*0.4);
      wrap.appendChild(slice);
    }

    if (prefersReduced) {
      // Disable heavy motion if user prefers reduced motion
      Array.from(wrap.querySelectorAll('.gc-flicker,.gc-layer-slice')).forEach(el => { el.style.animation = 'none'; });
    }

    // Look for a user-provided mirrored portrait element (placed alongside the original image)
    // If present, move it into the wrapper and create matching effect layers (grain, scanlines, RGB, slices).
    const portrait = wrap.parentNode ? wrap.parentNode.querySelector('.gc-layer-mirror') : document.querySelector('.gc-layer-mirror');
    if (portrait && !prefersReduced) {
      // Make sure the original portrait is hidden while we use cloned layers
      portrait.style.opacity = '0';
      portrait.classList.add('gc-layer-mirror');

      // Create portrait effects container once
      let pe = wrap.querySelector('.gc-portrait-effects');
      if (!pe) {
        pe = d.createElement('div');
        pe.className = 'gc-portrait-effects';

        // base clone for portrait
        const base = portrait.cloneNode(true);
        base.removeAttribute('srcset');
        base.classList.remove && base.classList.remove('gc-glitch-img');
        base.classList.add('gc-glitch-base', 'gc-glitch-layer', 'gc-layer-mirror', 'gc-flicker');
        base.style.position = 'absolute';
        base.style.inset = '0';
        base.style.width = '100%';
        base.style.height = '100%';
        base.style.objectFit = 'cover';
        base.style.opacity = '1';  // Make sure base portrait is visible
        pe.appendChild(base);

        // grain
        const pGrain = d.createElement('div');
        pGrain.className = 'gc-grain';
        pGrain.style.backgroundImage = `url("${NOISE}")`;
        pGrain.style.backgroundRepeat = 'repeat';
        pe.appendChild(pGrain);

        // scanlines
        const pScan = d.createElement('div');
        pScan.className = 'gc-scanlines';
        pe.appendChild(pScan);

        // RGB channels for portrait
        const channels = ['r','g','b'];
        channels.forEach((c) => {
          const layer = portrait.cloneNode(true);
          layer.removeAttribute('srcset');
          layer.classList.remove && layer.classList.remove('gc-glitch-img');
          layer.classList.add('gc-glitch-layer', 'gc-layer-mirror', `gc-layer-${c}`, 'gc-flicker');
          layer.style.opacity = '0.5';  // Set a suitable opacity for the effect layers
          pe.appendChild(layer);
        });

        // Portrait slices (fewer than main to reduce cost)
        const sliceCountP = 6;
        const wrapRectP = wrap.getBoundingClientRect();
        const hP = wrapRectP.height || portrait.naturalHeight || img.naturalHeight || 320;
        for (let i=0; i<sliceCountP; i++) {
          const slice = portrait.cloneNode(true);
          slice.removeAttribute('srcset');
          slice.classList.remove && slice.classList.remove('gc-glitch-img');
          slice.classList.add('gc-glitch-layer', 'gc-layer-mirror', 'gc-layer-slice', 'gc-flicker');
          const top = Math.floor((hP / sliceCountP) * i + (i ? Math.random()*3 : 0));
          const height = Math.floor(hP / sliceCountP + (Math.random()*4 - 2));
          slice.style.clipPath = `inset(${top}px 0 ${Math.max(hP - (top+height),0)}px 0)`;
          slice.style.animation = `${i%2===0 ? 'gc-jitter-x' : 'gc-jitter-y'} ${0.5 + Math.random()*0.9}s infinite steps(2,end)`;
          slice.style.opacity = String(0.2 + Math.random()*0.3);  // Slightly reduced opacity for slices
          pe.appendChild(slice);
        }

        // hide original portrait element — we'll use cloned layers inside pe to render
        portrait.style.display = 'none';

        wrap.appendChild(pe);
      }

      // Helper to toggle classes on portrait-related flicker layers
      function addIntense() {
        pe.querySelectorAll('.gc-flicker').forEach(el => el.classList.add('gc-intense'));
        img.classList.add('gc-intense');
      }
      function removeIntense() {
        pe.querySelectorAll('.gc-flicker').forEach(el => el.classList.remove('gc-intense'));
        img.classList.remove('gc-intense');
      }

      // Schedule intermittent portrait events (slower and longer by request)
      (function schedulePortraitEvent() {
        // Random delay until next event (4s - 12s)
        const nextDelay = 4000 + Math.random() * 8000;
        setTimeout(() => {
          const mode = Math.random() < 0.5 ? 'overlay' : 'replace';
          // Show duration longer now (900ms - 2500ms)
          const showDuration = 900 + Math.random() * 1600; // ms

          // Sync flicker: briefly intensify flicker on both elements and restart animation
          addIntense();
          // restart animations by forcing reflow
          void pe.offsetWidth;
          void img.offsetWidth;

          // Show portrait effects (we render portrait via the pe base clone)
          pe.classList.add('active');

          if (mode === 'replace') {
            // Hide the NFT entirely while portrait replaces it
            img.classList.add('gc-hidden');
          } else {
            // Overlay: keep NFT visible under portrait
            img.classList.remove('gc-hidden');
          }

          // End the event after showDuration
          setTimeout(() => {
            pe.classList.remove('active');
            removeIntense();
            img.classList.remove('gc-hidden');
          }, showDuration);

          // Schedule next event
          schedulePortraitEvent();
        }, nextDelay);
      })();
    }
  }

  function init() {
    const img = pickHeroImage();
    if (img) makeGlitch(img);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
