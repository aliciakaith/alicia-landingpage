/**
 * The page's only script. One IntersectionObserver drives every reveal,
 * count-up and entry animation; the rest is the hero fan, the ribbon drift,
 * the see-more arc layout, the numbers tilt and the floating dock.
 *
 * Visual states live in CSS (global.css). This module only toggles classes,
 * except where a value has to be computed: counters, arc positions, tilt.
 */

const html = document.documentElement;
const reduced = html.classList.contains('reduced');
const q = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/* ---------- hero: headline fade-up + cards fan out ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  if (reduced) {
    hero.classList.add('is-ready', 'is-settled');
  } else {
    // Two frames so the collapsed state is painted before the transition starts.
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));
    // 260ms delay + 3 × 110ms stagger + 780ms travel, then hover answers without delay.
    setTimeout(() => hero.classList.add('is-settled'), 260 + 3 * 110 + 780 + 40);
  }
}

/* ---------- hero fan: swipe / click / arrow keys cycle the stack ----------
   Depth is a class (.at-0 back … .at-3 front); swiping sends the front card to
   the back and everything else steps forward. */
const fanHost = document.querySelector<HTMLElement>('[data-fan-host]');
if (fanHost) {
  const order = q('[data-fan]', fanHost); // index 0 = back, last = front
  const apply = () =>
    order.forEach((el, i) => {
      el.classList.remove('at-0', 'at-1', 'at-2', 'at-3');
      el.classList.add(`at-${i}`);
    });
  // Re-enter at the back without animating across the stack.
  const snap = (el: HTMLElement) => {
    el.classList.add('no-anim');
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.remove('no-anim'));
  };
  const advance = (dir: 1 | -1) => {
    if (dir === 1) {
      const front = order.pop()!;
      order.unshift(front);
      apply();
      snap(front);
    } else {
      order.push(order.shift()!);
      apply();
    }
    fanHost.classList.add('has-swiped');
  };

  let active: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let dx = 0;
  let t0 = 0;

  fanHost.addEventListener('pointerdown', (e) => {
    const front = order[order.length - 1];
    if (!front.contains(e.target as Node) || e.button !== 0) return;
    active = front;
    startX = e.clientX;
    startY = e.clientY;
    dx = 0;
    t0 = performance.now();
    front.setPointerCapture(e.pointerId);
    front.classList.add('is-dragging');
    fanHost.classList.add('is-dragging');
  });
  fanHost.addEventListener('pointermove', (e) => {
    if (!active) return;
    dx = e.clientX - startX;
    const dy = (e.clientY - startY) * 0.25;
    active.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.04}deg)`;
  });
  const release = () => {
    if (!active) return;
    const el = active;
    active = null;
    el.classList.remove('is-dragging');
    fanHost.classList.remove('is-dragging');
    const velocity = Math.abs(dx) / Math.max(1, performance.now() - t0);
    if (Math.abs(dx) > 70 || velocity > 0.5) {
      // fling off in the drag direction, then send to the back
      const dir = dx < 0 ? -1 : 1;
      el.style.transform = `translate(${dir * (el.offsetWidth + 120)}px, 0) rotate(${dir * 12}deg)`;
      el.style.opacity = '0';
      setTimeout(() => {
        el.style.transform = '';
        el.style.opacity = '';
        advance(1);
      }, reduced ? 0 : 400);
    } else {
      el.style.transform = '';
      if (Math.abs(dx) < 4) advance(1); // a plain click steps forward too
    }
  };
  fanHost.addEventListener('pointerup', release);
  fanHost.addEventListener('pointercancel', release);
  fanHost.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      advance(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      advance(-1);
    }
  });
}

/* ---------- ribbon text drift (0.22px per frame, only while the hero is on screen) ----------
   The text is a repeated phrase; the offset wraps every one phrase-length, so the loop is seamless. */
const ribbon = document.getElementById('ribbonText') as SVGTextPathElement | null;
const RIBBON_REPEATS = 10;
let ribbonOn = false;
let ribbonT = 0;
let ribbonSeg = 0;
const drift = () => {
  if (!ribbonOn || !ribbon) return;
  if (!ribbonSeg) {
    try {
      ribbonSeg = ribbon.getComputedTextLength() / RIBBON_REPEATS;
    } catch {
      /* not measurable yet */
    }
  }
  ribbonT = (ribbonT + 0.22) % (ribbonSeg || 340);
  ribbon.setAttribute('startOffset', String(-ribbonT));
  requestAnimationFrame(drift);
};
const setRibbon = (on: boolean) => {
  if (reduced || !ribbon || on === ribbonOn) return;
  ribbonOn = on;
  if (on) requestAnimationFrame(drift);
};

/* ---------- number count-up ---------- */
const fmt = (n: number, suffix: string) => n.toLocaleString('en-US') + suffix;
const runCount = (el: HTMLElement) => {
  const target = parseFloat(el.dataset.count || '0');
  const suffix = el.dataset.suffix || '';
  const dur = 1100;
  const t0 = performance.now();
  const tick = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(target * e), suffix);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const counters = q('[data-count]');
if (!reduced) {
  // Reserve each counter's final width so the count never shifts layout.
  counters.forEach((el) => {
    el.style.minWidth = `${el.getBoundingClientRect().width}px`;
    el.style.textAlign = 'center';
  });
  counters.forEach((el) => (el.textContent = fmt(0, el.dataset.suffix || '')));
}

/* ---------- see-more wheel: cards spaced around a full circle, rotating as one ----------
   The circle's centre sits at the bottom of the host, so only the top half shows;
   the host's overflow clips the rest and cards fade as they approach the horizon.
   Each card is tangent to the circle (softened by ARC_TILT). */
const arcHost = document.querySelector<HTMLElement>('[data-arc-host]');
const arcCards = arcHost ? q('[data-arc]', arcHost) : [];
const ARC_REV = 40000; // ms per full revolution
const ARC_TILT = 1; // 1 = fully tangent to the circle (side cards stand upright)
let arcGeom = { cx: 0, cy: 0, rx: 0, ry: 0 };
let arcOn = false;
let arcPaused = false; // hover pauses the wheel so the cards can be clicked
let arcT = 0;
let arcLast = 0;
const measureArc = () => {
  if (!arcHost) return;
  const w = arcHost.clientWidth;
  const h = arcHost.clientHeight;
  arcGeom = { cx: w / 2, cy: h * 0.98, rx: Math.min(w * 0.38, 560), ry: h * 0.82 };
};
const smooth = (v: number) => {
  const t = Math.min(1, Math.max(0, v));
  return t * t * (3 - 2 * t);
};
/* angle in radians, screen coords: -π/2 is the top, 0 the right, ±π the left */
const placeArc = (el: HTMLElement, angle: number) => {
  const { cx, cy, rx, ry } = arcGeom;
  const x = cx + Math.cos(angle) * rx;
  const y = cy + Math.sin(angle) * ry;
  const tangentDeg = (angle + Math.PI / 2) * (180 / Math.PI);
  const rot = ((((tangentDeg + 180) % 360) + 360) % 360) - 180; // normalise to -180..180
  const above = -Math.sin(angle); // 1 at the top, 0 on the horizon
  el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) rotate(${rot * ARC_TILT}deg)`;
  el.style.opacity = String(smooth((above - 0.04) / 0.3));
};
const layoutWheel = (t: number) => {
  const n = arcCards.length;
  const spin = (t / ARC_REV) * Math.PI * 2;
  arcCards.forEach((el, i) => placeArc(el, -Math.PI + (i / n) * Math.PI * 2 + spin));
};
const arcFrame = (now: number) => {
  if (!arcOn) return;
  if (!arcPaused) arcT += now - arcLast;
  arcLast = now;
  layoutWheel(arcT);
  requestAnimationFrame(arcFrame);
};
const setArc = (on: boolean) => {
  if (reduced || on === arcOn) return;
  arcOn = on;
  if (on) {
    arcLast = performance.now();
    requestAnimationFrame(arcFrame);
  }
};
if (arcHost && arcCards.length) {
  measureArc();
  layoutWheel(0);
  const relayout = () => {
    measureArc();
    if (reduced || !arcOn) layoutWheel(arcT);
  };
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(arcHost);
  else window.addEventListener('resize', relayout);
  arcCards.forEach((el) => {
    el.addEventListener('pointerenter', () => (arcPaused = true));
    el.addEventListener('pointerleave', () => (arcPaused = false));
    el.addEventListener('focus', () => (arcPaused = true));
    el.addEventListener('blur', () => (arcPaused = false));
  });
}

/* ---------- one observer for every reveal ----------
   threshold list covers 0.2 (default), 0.25 (arc) and 0.4 (close line);
   each element states its own via data-threshold. Hero is watched at 0 to
   pause the ribbon loop off screen. Everything else unobserves after firing. */
const io = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      const el = en.target as HTMLElement;
      if (el === hero) {
        setRibbon(en.isIntersecting);
        continue;
      }
      if (el === arcHost) {
        setArc(en.isIntersecting);
        continue;
      }
      const need = parseFloat(el.dataset.threshold || '0.2');
      if (!en.isIntersecting || en.intersectionRatio < need) continue;

      if (el.dataset.count !== undefined) runCount(el);
      else el.classList.add('is-in');
      io.unobserve(el);
    }
  },
  { threshold: [0, 0.2, 0.25, 0.4], rootMargin: '0px 0px -8% 0px' },
);

if (hero && !reduced) io.observe(hero);
if (arcHost && !reduced) io.observe(arcHost);
if (!reduced) {
  q('[data-reveal],[data-float],[data-tile],[data-scale]').forEach((el) => io.observe(el));
  counters.forEach((el) => io.observe(el));
}

// After an element's entrance finishes, hand it its resting transition (used by the tiles).
document.addEventListener('transitionend', (e) => {
  const el = e.target as HTMLElement;
  if (el.classList?.contains('is-in')) el.classList.add('is-settled');
});

/* ---------- numbers tiles: tilt toward cursor ---------- */
if (!reduced) {
  q('[data-tile]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- floating dock ---------- */
const dock = document.getElementById('aboutDock');
const panel = document.getElementById('aboutPanel');
const toggle = document.getElementById('aboutToggle');

if (dock) {
  setTimeout(() => dock.classList.add('is-shown'), 700);
}

if (dock && panel && toggle) {
  let open = false;
  const setOpen = (on: boolean) => {
    open = on;
    dock.classList.toggle('is-open', on);
    toggle.setAttribute('aria-expanded', String(on));
    panel.inert = !on;
  };
  setOpen(false);

  toggle.addEventListener('click', () => setOpen(!open));

  q<HTMLAnchorElement>('[data-docklink]', panel).forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href') || '');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      setOpen(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (open && !dock.contains(e.target as Node)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
  });
}
