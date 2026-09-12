/* ============================================================
   Rodolfo — Plomero y Gasista Matriculado · CABA
   JavaScript vanilla. Sin librerías, sin build.

   Compartido por plomeria.html y gas.html.
   OJO: el contenido de cada rubro viene servido en el HTML, no lo
   arma este script. Acá solo hay adornos — si el JS no carga, la
   página se ve y funciona igual.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. NAVBAR: sombra al scrollear
     ========================================================== */
  var header = document.querySelector('.site-header');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }

  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================================
     2. SCROLL REVEAL (Intersection Observer)
     ========================================================== */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    for (var i = 0; i < revealables.length; i++) revealables[i].classList.add('is-visible');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    for (var j = 0; j < revealables.length; j++) io.observe(revealables[j]);
  }

  /* ==========================================================
     3. Año del footer
     ========================================================== */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

})();
