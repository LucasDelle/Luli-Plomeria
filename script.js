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

  /* ==========================================================
     4. CONVERSIONES DE GOOGLE ADS
     Delegación de clicks: cualquier <a> a wa.me o a tel: cuenta
     como conversión. No hay formularios en el sitio, así que esos
     dos son los únicos contactos reales.

     Los IDs se definen en el <head> (window.ADS_CONVERSIONS).
     Si gtag no cargó (adblock, sin conexión), el click sigue
     funcionando igual: nunca bloqueamos la navegación.
     ========================================================== */
  function conversionDe(href) {
    if (!href) return null;
    if (href.indexOf('wa.me') > -1 || href.indexOf('api.whatsapp.com') > -1) return 'whatsapp';
    if (href.indexOf('tel:') === 0) return 'llamada';
    return null;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href]') : null;
    if (!link) return;

    var tipo = conversionDe(link.getAttribute('href'));
    if (!tipo) return;

    var mapa = window.ADS_CONVERSIONS || {};
    var sendTo = mapa[tipo];

    if (typeof window.gtag !== 'function' || !sendTo || sendTo.indexOf('PEGAR_') > -1) return;

    // El mismo evento va a Ads y a Analytics (G-R6LHD6FH12), así el
    // click también se ve en Analytics como evento "conversion".
    window.gtag('event', 'conversion', {
      send_to: [sendTo, 'G-R6LHD6FH12'],
      event_callback: function () {}
    });
  }, true);

})();
