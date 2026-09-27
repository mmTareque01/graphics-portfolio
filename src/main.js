import './style.css';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';
import { profile, work, more, oss, stack, journey } from './data.js';
import { createParticles } from './particles.js';
import { mountCover } from './covers.js';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const isMobile = () => innerWidth < 768;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

/* ---------------------------------------------------------------------------
   Content
--------------------------------------------------------------------------- */
$$('[data-gh]').forEach((a) => (a.href = profile.github));
$$('[data-li]').forEach((a) => (a.href = profile.linkedin));
$$('[data-up]').forEach((a) => (a.href = profile.upwork));
// "Hire me" opens an email draft instead of Upwork
$$('[data-hire]').forEach((a) => (a.href = `mailto:${profile.email}?subject=${encodeURIComponent('Project inquiry')}`));
$$('[data-mailto]').forEach((a) => (a.href = `mailto:${profile.email}`));
$$('[data-email]').forEach((el) => (el.textContent = profile.email));
$$('[data-loc]').forEach((el) => (el.textContent = profile.location));
$('[data-year]').textContent = new Date().getFullYear();
$('[data-status]').textContent = profile.status;

const clock = $('[data-clock]');
const tick = () => (clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' }).format(new Date()));
tick();
setInterval(tick, 15000);

const tickerWords = ['Node.js', 'TypeScript', 'Next.js', 'NestJS', 'Python', 'Django', 'Ruby on Rails', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'AI agents', 'Three.js', 'GSAP'];
$('.ticker__track').innerHTML = tickerWords.map((w) => `<span>${w}</span><i>✦</i>`).join('');

$('.cases').innerHTML = work.map((p, i) => {
  const n = String(i + 1).padStart(2, '0');
  const links = p.links
    ? [p.links.live && `<a href="${p.links.live}" target="_blank" rel="noopener" data-cursor="Open">Live site ↗</a>`,
       p.links.live2 && `<a href="${p.links.live2}" target="_blank" rel="noopener" data-cursor="Open">Second demo ↗</a>`,
       p.links.code && `<a href="${p.links.code}" target="_blank" rel="noopener" data-cursor="Code">Source ↗</a>`].filter(Boolean).join('')
    : `<span class="mono">${p.client ? 'Client project · private codebase' : 'Private codebase · demo on request'}</span>`;
  const visual = p.shots
    ? `<div class="shots">${p.shots.map((s) => `<img src="${s}" alt="${p.title} screenshot" loading="lazy" />`).join('')}</div>`
    : `<canvas data-art="${p.art}"></canvas>`;
  return `
  <article class="case" style="--c1:${p.c1};--c2:${p.c2}">
    <div class="case__inner">
      <div class="case__info">
        <div class="case__meta mono"><b>${n}</b><span>${p.tag}</span><span>${p.year}</span></div>
        <h3 class="case__title">${p.title}</h3>
        <p class="case__blurb">${p.blurb}</p>
        <ul class="case__points">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
        <div class="case__stack">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
        <div class="case__links mono">${links}</div>
      </div>
      <div class="case__visual" data-cursor="${p.shots ? 'View' : 'Play'}">
        <div class="chrome"><i></i><i></i><i></i><span class="mono">${p.id}.${p.shots ? 'live' : 'sys'}</span></div>
        ${visual}
      </div>
      <span class="case__num">${n}</span>
    </div>
  </article>`;
}).join('');
$$('.case').forEach((el, i) => {
  const c = el.querySelector('canvas[data-art]');
  if (c) mountCover(c, c.dataset.art, work[i].c1, work[i].c2);
});

const groupLabel = { Client: 'Client · Mugen', Own: 'Own product' };
$('.archive__grid').innerHTML = more.map((m) => {
  const tag = m.href ? 'a' : 'div';
  const attrs = m.href ? `href="${m.href}" target="_blank" rel="noopener" data-cursor="Open"` : '';
  return `<${tag} class="tile" data-group="${m.group}" ${attrs}><span class="tile__tag mono">${groupLabel[m.group]}</span><h4>${m.title}${m.href ? '<i>↗</i>' : ''}</h4><p>${m.desc}</p><small>${m.stack}</small></${tag}>`;
}).join('');
const chips = $('.chips');
chips.innerHTML = [['all', `All ${more.length}`], ['Client', 'Client work'], ['Own', 'Own products']]
  .map(([k, l], i) => `<button class="chip mono${i ? '' : ' is-on'}" data-filter="${k}">${l}</button>`).join('');
chips.addEventListener('click', (e) => {
  const b = e.target.closest('.chip');
  if (!b || b.classList.contains('is-on')) return;
  $$('.chip').forEach((c) => c.classList.toggle('is-on', c === b));
  const f = b.dataset.filter;
  const tiles = $$('.tile');
  gsap.to(tiles, {
    opacity: 0, y: 16, duration: 0.25, stagger: 0.01, ease: 'power2.in',
    onComplete: () => {
      tiles.forEach((t) => (t.style.display = f === 'all' || t.dataset.group === f ? '' : 'none'));
      const shown = tiles.filter((t) => t.style.display !== 'none');
      gsap.fromTo(shown, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.03, ease: 'expo.out' });
      ScrollTrigger.refresh();
    },
  });
});
$$('.tile').forEach((t) => t.addEventListener('pointermove', (e) => {
  const r = t.getBoundingClientRect();
  t.style.setProperty('--mx', `${e.clientX - r.left}px`);
  t.style.setProperty('--my', `${e.clientY - r.top}px`);
}));

$('.oss__grid').innerHTML = oss.map((o) => `
  <article class="term">
    <div class="term__bar"><i></i><i></i><i></i><span class="mono">~/${o.name}</span></div>
    <div class="term__body">
      <div class="term__cmd"><code>${o.cmd}</code><button class="term__copy" data-copy="${o.cmd}" data-cursor="Copy">Copy</button></div>
      <h3>${o.name}</h3>
      <p>${o.desc.replace(/</g, '&lt;')}</p>
      <a class="mono link" href="${o.href}" target="_blank" rel="noopener" data-cursor="Code">View on GitHub ↗</a>
    </div>
  </article>`).join('');

$('.stack__groups').innerHTML = stack.map((g) => `<div class="sgroup"><h4>${g.group}</h4><ul>${g.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('');
$('.journey__list').insertAdjacentHTML('beforeend', journey.map((j) => `<div class="jitem"><small class="mono">${j.when}</small><div><h4>${j.where}</h4><p>${j.what}</p></div></div>`).join(''));

/* ---------------------------------------------------------------------------
   Smooth scroll, particles, cursor
--------------------------------------------------------------------------- */
const lenis = reduced ? null : new Lenis({ lerp: 0.085 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  lenis.stop();
}
gsap.ticker.lagSmoothing(0);

const field = createParticles($('#gl'));
gsap.ticker.add((t) => field.update(t));

const toastEl = $('.toast');
gsap.set(toastEl, { xPercent: -50, y: 30 });
let toastTl;
function toast(msg) {
  toastEl.textContent = msg;
  toastTl?.kill();
  toastTl = gsap.timeline().to(toastEl, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }).to(toastEl, { y: 30, opacity: 0, duration: 0.3 }, '+=2');
}
async function copy(text, label) {
  try { await navigator.clipboard.writeText(text); toast(`${label} copied`); } catch { toast(text); }
}
$('.contact__mail').addEventListener('click', () => copy(profile.email, 'Email'));
document.addEventListener('click', (e) => {
  const c = e.target.closest('[data-copy]');
  if (c) copy(c.dataset.copy, 'Command');
});

if (finePointer) {
  document.body.classList.add('has-cursor');
  const cursor = $('.cursor');
  const ring = $('.cursor__ring'), dot = $('.cursor__dot'), label = $('.cursor__label');
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  addEventListener('pointermove', (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); });
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button');
    const text = t?.dataset.cursor || '';
    cursor.classList.toggle('is-hover', !!t);
    cursor.classList.toggle('has-label', !!text);
    if (text) label.textContent = text;
  });
  $$('.magnetic').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

// Nav: smooth anchors, hide on scroll down, active section
const nav = $('.nav');
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  e.preventDefault();
  const target = id === '#top' ? 0 : $(id);
  lenis ? lenis.scrollTo(target, { duration: 1.6 }) : (target === 0 ? scrollTo(0, 0) : target.scrollIntoView({ behavior: 'smooth' }));
}));
lenis?.on('scroll', ({ scroll, direction }) => nav.classList.toggle('is-hidden', direction > 0 && scroll > 400));

// Ticker reacts to scroll velocity
(() => {
  const row = $('.ticker__row'), track = $('.ticker__track');
  row.appendChild(track.cloneNode(true));
  const tracks = $$('.ticker__track');
  let x = 0;
  gsap.ticker.add((t, dt) => {
    const v = lenis ? lenis.velocity : 0;
    x -= (0.03 + Math.min(Math.abs(v) * 0.02, 0.6)) * dt * (v < 0 ? -1 : 1);
    const w = track.offsetWidth;
    if (!w) return;
    const px = -(((x % w) + w) % w);
    tracks.forEach((tr) => (tr.style.transform = `translate3d(${px}px,0,0)`));
  });
})();

/* ---------------------------------------------------------------------------
   Boot sequence → intro
--------------------------------------------------------------------------- */
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
const bootLines = [
  '<b>&gt;</b> mmtareque --boot',
  '  resolving github.com/mmTareque01 .......... <u>ok</u>',
  '  indexing 57 repositories .................. <u>ok</u>',
  '  linking node · python · ruby · sql ........ <u>ok</u>',
  '  warming up 16,000 particles ............... <u>ok</u>',
  '  <b>ready.</b>',
];
function boot() {
  const log = $('.boot__log');
  const pct = $('.boot__pct');
  const c = { v: 0 };
  const tl = gsap.timeline();
  bootLines.forEach((line, i) => tl.add(() => (log.innerHTML += (i ? '\n' : '') + line), i * (reduced ? 0.05 : 0.32)));
  tl.to(c, { v: 100, duration: reduced ? 0.3 : 2, ease: 'power2.inOut', onUpdate: () => (pct.textContent = String(Math.round(c.v)).padStart(3, '0')) }, 0)
    .to('.boot__bar i', { scaleX: 1, duration: reduced ? 0.3 : 2, ease: 'power2.inOut' }, 0);
  return Promise.all([fontsReady, tl.then()]);
}

function intro() {
  document.body.classList.remove('is-loading');
  ScrollTrigger.refresh();
  const words = ['scalable APIs', 'SaaS platforms', 'AI agents', 'automation', 'motion-rich web'];
  gsap.timeline({ onComplete: () => { lenis?.start(); rotate(words); } })
    .to('.shutter i', { scaleY: 1, duration: 0.6, stagger: 0.05, ease: 'expo.in' })
    .set('.boot', { display: 'none' })
    .set('.shutter i', { transformOrigin: 'top' })
    .to('.shutter i', { scaleY: 0, duration: 0.8, stagger: 0.05, ease: 'expo.inOut' })
    .set('.shutter', { display: 'none' })
    .add('go', '-=0.5')
    .to(field.state, { opacity: 1, duration: 2, ease: 'power2.out' }, 'go')
    .from(field.state, { scale: 0.2, duration: 2.4, ease: 'expo.out' }, 'go')
    .from('.hero__line', { yPercent: 110, duration: 1.3, stagger: 0.12, ease: 'expo.out' }, 'go')
    .add(() => $$('.hero__line').forEach((el) => gsap.to(el, { duration: 0.9, scrambleText: { text: el.textContent, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01', speed: 0.6 } })), 'go+=0.5')
    .from('.status, .hero__role, .hero__lead, .hero__ctas > *', { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }, 'go+=0.35')
    .from('.nav > *', { y: -30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', clearProps: 'all' }, 'go+=0.3')
    .from('.hero__foot > *', { y: 20, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, 'go+=0.6');
}

function rotate(words) {
  const box = $('.rotator');
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    const old = box.querySelector('b');
    const nu = document.createElement('b');
    nu.textContent = words[i];
    gsap.timeline()
      .to(old, { yPercent: -110, duration: 0.5, ease: 'power3.in', onComplete: () => old.remove() })
      .add(() => box.appendChild(nu))
      .fromTo(nu, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' });
  }, 2600);
}

/* ---------------------------------------------------------------------------
   Scroll choreography
--------------------------------------------------------------------------- */
function buildScroll() {
  // The particle field changes shape per chapter
  const scenes = [
    ['.hero', () => ({ morph: 0, x: isMobile() ? 0 : 0.52, y: isMobile() ? 0.32 : 0, opacity: 1 })],
    ['.about', () => ({ morph: 1, x: 0, y: isMobile() ? -0.35 : -0.05, opacity: 0.85 })],
    ['.work', () => ({ morph: 2, x: 0, y: -0.2, opacity: 0.5 })],
    ['.stack', () => ({ morph: 3, x: isMobile() ? 0 : 0.35, y: 0, opacity: 1 })],
    ['.journey', () => ({ morph: 3, x: isMobile() ? 0 : -0.35, y: 0, opacity: 0.55 })],
    ['.contact', () => ({ morph: 4, x: isMobile() ? 0 : 0.4, y: isMobile() ? 0.25 : 0, opacity: 1 })],
  ];
  scenes.forEach(([sel, cfg]) => ScrollTrigger.create({
    trigger: sel, start: 'top 55%', end: 'bottom 55%',
    onToggle: (s) => s.isActive && gsap.to(field.state, { ...cfg(), duration: 1.8, ease: 'power3.inOut', overwrite: 'auto' }),
  }));

  // Active nav link
  ['#work', '#about', '#stack', '#contact'].forEach((id) => ScrollTrigger.create({
    trigger: id, start: 'top 50%', end: 'bottom 50%',
    onToggle: (s) => $(`.nav__links a[href="${id}"]`).classList.toggle('is-active', s.isActive),
  }));

  gsap.to('.hero__inner', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Headings
  $$('[data-split]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
    gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onComplete: () => split.revert() });
  });
  $$('.kicker').forEach((k) => {
    const text = k.textContent;
    gsap.to(k, { duration: 1.1, scrambleText: { text, chars: '01<>/{}#', speed: 0.5 }, scrollTrigger: { trigger: k, start: 'top 90%' } });
  });

  // About: words light up as you read
  const words = new SplitText('.about__text', { type: 'words' }).words;
  gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true } });
  $$('[data-count]').forEach((el) => {
    const o = { v: +(el.dataset.from || 0) };
    gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = Math.round(o.v) + (el.dataset.suffix || '')) });
  });
  gsap.from('.stat', { y: 60, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.stats', start: 'top 88%' } });

  // Case studies stack on desktop: each card recedes as the next one arrives
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1025px)', () => {
    const cases = $$('.case');
    cases.forEach((c, i) => {
      if (i === cases.length - 1) return;
      gsap.to(c.querySelector('.case__inner'), {
        scale: 0.92, filter: 'brightness(0.6)', ease: 'none',
        scrollTrigger: { trigger: cases[i + 1], start: 'top 65%', end: 'top 14%', scrub: true },
      });
    });
  });
  $$('.case').forEach((c) => {
    gsap.from(c.querySelectorAll('.case__meta, .case__title, .case__blurb, .case__points li, .case__stack span, .case__links'), {
      y: 30, opacity: 0, stagger: 0.03, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 70%' },
    });
    gsap.from(c.querySelector('.case__visual'), { clipPath: 'inset(0 0 100% 0 round 20px)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: c, start: 'top 70%' } });
  });

  gsap.from('.tile', { y: 50, opacity: 0, stagger: 0.04, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.archive__grid', start: 'top 85%' } });
  gsap.from('.term', { y: 70, opacity: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.oss__grid', start: 'top 85%' } });
  gsap.from('.sgroup', { y: 60, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.stack__groups', start: 'top 85%' } });
  gsap.from('.sgroup li', { scale: 0.6, opacity: 0, stagger: 0.015, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: '.stack__groups', start: 'top 80%' } });

  gsap.to('.journey__line i', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey__list', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  $$('.jitem').forEach((j) => gsap.from(j, { x: -40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: j, start: 'top 85%' } }));

  gsap.from('.contact__title .mask > span', { yPercent: 110, stagger: 0.12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.contact__title', start: 'top 80%' } });
  gsap.from('.contact__mail, .contact__links a', { y: 30, opacity: 0, stagger: 0.06, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__mail', start: 'top 92%' } });

  ScrollTrigger.refresh();
}

fontsReady.then(buildScroll);
boot().then(intro);
