import './style.css';
import { assets } from './assets.js';

for (const img of document.querySelectorAll('[data-asset]')) img.src = assets[img.dataset.asset];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroStage = document.querySelector('.portrait-stage');
let portraitVideo;
if (assets.heroVideo && !reducedMotion.matches) {
  portraitVideo = document.createElement('video');
  Object.assign(portraitVideo, { src: assets.heroVideo, poster: assets.heroPortrait, muted: true, loop: true, autoplay: true, playsInline: true });
  portraitVideo.setAttribute('aria-label', 'Portrait of a woman with natural skin');
  heroStage.querySelector('.hero-portrait').replaceWith(portraitVideo);
}

const menu = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); mobileNav.hidden = !open; });
mobileNav.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const panels = {
  analyze: { title: 'Your skin, understood.', body: '<p>A more thoughtful skincare routine starts with getting to know your skin.</p><p class="panel-note">This is a visual preview. The facial overlays and statistics are illustrative; no photo is captured or analyzed, and no medical advice is provided.</p><p>Explore the homepage to discover the Nuvé approach to mindful care.</p>' },
  contact: { title: 'Let’s stay in touch.', body: '<p>Thanks for your interest in Nuvé. This concept homepage doesn’t have a connected contact service yet.</p><p class="panel-note">Contact details will be shared here when available. No messages or personal information are collected.</p>' },
  app: { title: 'A little patience. A little glow.', body: '<p>The Nuvé app is a concept in development. An App Store release date and download link haven’t been announced.</p><p class="panel-note">For now, explore the skincare experience right here.</p>' },
};
const dialog = document.querySelector('dialog');
let trigger;
for (const button of document.querySelectorAll('[data-panel]')) button.addEventListener('click', () => {
  trigger = button;
  const panel = panels[button.dataset.panel];
  document.querySelector('#panel-title').textContent = panel.title;
  document.querySelector('.panel-body').innerHTML = panel.body;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
});
function closeDialog() { dialog.close(); }
document.querySelector('.close-dialog').addEventListener('click', closeDialog);
document.querySelector('.dialog-done').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; trigger?.focus(); });

const statement = document.querySelector('.statement');
const statementText = statement.textContent;
statement.setAttribute('aria-label', statementText);
statement.replaceChildren(...statementText.split(' ').map((word, index) => {
  const span = document.createElement('span');
  span.className = 'word'; span.setAttribute('aria-hidden', 'true'); span.textContent = (index ? ' ' : '') + word; return span;
}));
const words = [...statement.children];
const statementSection = document.querySelector('.statement-section');
const mindful = document.querySelector('.mindful-section');
const line = document.querySelector('.connecting-line');
const beauty = document.querySelector('.beauty-copy');
const observer = new IntersectionObserver(entries => { for (const entry of entries) {
  entry.target.classList.toggle('in-view', entry.isIntersecting);
  if (entry.target.classList.contains('reveal') && entry.isIntersecting) entry.target.classList.add('visible');
  if (entry.target === heroStage && portraitVideo) { if (entry.isIntersecting && !document.hidden) portraitVideo.play().catch(() => {}); else portraitVideo.pause(); }
}}, { threshold: 0.12 });
for (const element of document.querySelectorAll('.mindful-section,.statement-section,.ai-copy,.portrait-stage')) observer.observe(element);
let frame = 0;
const clamp = value => Math.max(0, Math.min(1, value));
function updateScroll() {
  frame = 0;
  const h = innerHeight;
  const r = mindful.getBoundingClientRect();
  const content = document.querySelector('.mindful-content').getBoundingClientRect();
  const progress = reducedMotion.matches ? 1 : clamp((h * .8 - content.top) / (content.height * .75));
  line.style.setProperty('--line-progress', progress);
  beauty.classList.toggle('visible', progress > .65 || reducedMotion.matches);
  const sr = statementSection.getBoundingClientRect();
  const textProgress = reducedMotion.matches ? 1 : clamp((h * .85 - sr.top) / (Math.min(sr.height,h) * .7));
  words.forEach((word, i) => word.classList.toggle('emphasized', i / words.length < textProgress));
}
function queueScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
addEventListener('scroll', queueScroll, { passive: true });
addEventListener('resize', queueScroll);
reducedMotion.addEventListener('change', queueScroll);
document.addEventListener('visibilitychange', () => { if (portraitVideo && document.hidden) portraitVideo.pause(); else if (portraitVideo && heroStage.classList.contains('in-view')) portraitVideo.play().catch(() => {}); });
updateScroll();
addEventListener('pagehide', () => { observer.disconnect(); cancelAnimationFrame(frame); });
addEventListener('pageshow', event => { if (event.persisted) { for (const el of document.querySelectorAll('.mindful-section,.statement-section,.ai-copy,.portrait-stage')) observer.observe(el); queueScroll(); } });
