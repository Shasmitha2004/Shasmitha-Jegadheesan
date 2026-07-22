/* =========================================================
   Velvet Shark Studio — interactions
   Vanilla JS only, no build step, no dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Matrix rain background ---------- */
  (function matrixRain(){
    const canvas = document.getElementById('matrix-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, columns, drops;
    const glyphs = 'アイウエオカキクケコサシスセソ01<>/{}[]#*$SOC01001';

    function resize(){
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / 18);
      drops = new Array(columns).fill(0).map(() => Math.random() * -50);
    }
    resize();
    window.addEventListener('resize', resize);

    let last = 0;
    function draw(ts){
      requestAnimationFrame(draw);
      if(ts - last < 55) return; // throttle for perf
      last = ts;
      ctx.fillStyle = 'rgba(7,5,12,0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '15px monospace';
      for(let i=0;i<columns;i++){
        const text = glyphs[Math.floor(Math.random()*glyphs.length)];
        const x = i * 18;
        const y = drops[i] * 18;
        const grad = ctx.createLinearGradient(0, y-30, 0, y);
        grad.addColorStop(0, 'rgba(139,92,246,0)');
        grad.addColorStop(1, 'rgba(168,85,247,0.85)');
        ctx.fillStyle = grad;
        ctx.fillText(text, x, y);
        if(y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      requestAnimationFrame(draw);
    }
  })();

  /* ---------- Typing animation (hero role line) ---------- */
  (function typeRole(){
    const el = document.getElementById('typed-role');
    if(!el) return;
    const phrases = [
      'Cybersecurity Undergraduate',
      'Aspiring SOC Analyst',
      'Penetration Testing Enthusiast',
      'CTF Player @VelvetShark'
    ];
    let p = 0, c = 0, deleting = false;

    function tick(){
      const current = phrases[p];
      if(!deleting){
        c++;
        el.textContent = current.slice(0, c);
        if(c === current.length){ deleting = true; setTimeout(tick, 1400); return; }
      } else {
        c--;
        el.textContent = current.slice(0, c);
        if(c === 0){ deleting = false; p = (p+1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 35 : 65);
    }
    tick();
  })();

  /* ---------- Scroll reveal ---------- */
  (function scrollReveal(){
    const items = document.querySelectorAll('.reveal');
    const bars = document.querySelectorAll('.bar');
    const counters = document.querySelectorAll('.stat-num');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          if(entry.target.classList.contains('skill-category')){
            entry.target.querySelectorAll('.bar').forEach(b => b.classList.add('animate'));
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach((el, i) => {
      el.style.setProperty('--d', i % 8);
      io.observe(el);
    });

    /* animated counters */
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));

    function animateCounter(el){
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1200;
      const start = performance.now();
      function frame(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(eased * target) + suffix;
        if(progress < 1) requestAnimationFrame(frame);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(frame);
    }
  })();

  /* ---------- Sticky navbar + active link highlight ---------- */
  (function nav(){
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    const sio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.nav-links a[data-section="${id}"]`);
        if(!link) return;
        if(entry.isIntersecting){
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => sio.observe(s));

    /* mobile menu */
    const toggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  })();

  /* ---------- Scroll cue + back to top ---------- */
  document.getElementById('scroll-cue')?.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
