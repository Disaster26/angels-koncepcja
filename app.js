(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* menu mobilne */
  var ham = $('.ham'), panel = $('#panel');
  function zamknij() { panel.hidden = true; ham.setAttribute('aria-expanded', 'false'); ham.setAttribute('aria-label', 'Otwórz menu'); }
  ham.addEventListener('click', function () {
    var otw = panel.hidden;
    panel.hidden = !otw;
    ham.setAttribute('aria-expanded', String(otw));
    ham.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
  });
  $$('#panel a').forEach(function (a) { a.addEventListener('click', zamknij); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) zamknij(); });
  window.addEventListener('resize', function () { if (innerWidth > 1024) zamknij(); });

  /* dolny pasek: dopiero po przewinieciu za przyciski hero */
  var mob = $('#mob'), heroCta = $('.hero-cta');
  function pasek(w) {
    mob.classList.toggle('widac', w);
    mob.setAttribute('aria-hidden', String(!w));
    $$('a', mob).forEach(function (a) { a.tabIndex = w ? 0 : -1; });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      en.forEach(function (x) { pasek(!x.isIntersecting && x.boundingClientRect.top < 0); });
    }).observe(heroCta);
  }

  /* kafle i linki ustawiaja temat zapisu */
  var form = $('#zapis'), wynik = $('#formWynik');
  $$('[data-temat]').forEach(function (a) {
    a.addEventListener('click', function () { form.temat.value = a.getAttribute('data-temat'); });
  });

  /* formularz: bez wysylki - przygotowuje wiadomosc e-mail */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var zle = !el.value.trim();
      el.closest('.pole').classList.toggle('blad', zle);
      if (zle) ok = false;
    });
    if (!ok) { wynik.textContent = 'Uzupełnij zaznaczone pola.'; return; }
    var linie = ['Dzień dobry,', '', 'chciałabym / chciałbym się zapisać: ' + form.temat.value + '.'];
    if (form.termin.value.trim()) linie.push('Preferowany termin: ' + form.termin.value.trim());
    if (form.tresc.value.trim()) linie.push('', form.tresc.value.trim());
    linie.push('', form.kto.value.trim(), 'tel. ' + form.tel.value.trim());
    wynik.textContent = 'Otwieramy program pocztowy z gotową wiadomością do gabinetu. Wystarczy kliknąć "Wyślij".';
    location.href = 'mailto:gabinetparamedycyny@interia.pl?subject=' + encodeURIComponent('Zapis: ' + form.temat.value) + '&body=' + encodeURIComponent(linie.join('\n'));
  });
  $$('[required]', form).forEach(function (el) {
    el.addEventListener('input', function () { el.closest('.pole').classList.remove('blad'); });
  });
})();
