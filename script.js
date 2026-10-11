(function () {
  'use strict';

  var scrollButton = document.querySelector('[data-scroll-to]');
  var musicButton = document.querySelector('.music-control');
  var audio = document.getElementById('background-music');
  var guestNameElement = document.querySelector('[data-guest-name]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (guestNameElement) {
    var guestKey = new URLSearchParams(window.location.search).get('guest');
    var guestList = window.INVITATION_GUESTS || {};
    if (guestKey && guestList[guestKey]) {
      guestNameElement.textContent = guestList[guestKey];
      document.title = 'Thiệp mời dành cho ' + guestList[guestKey] + ' — Nguyễn Minh Anh';
    }
  }

  if (scrollButton) {
    scrollButton.addEventListener('click', function () {
      var target = document.getElementById(scrollButton.dataset.scrollTo);
      if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  if (musicButton && audio) {
    musicButton.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          musicButton.setAttribute('aria-pressed', 'true');
          musicButton.setAttribute('aria-label', 'Tắt nhạc nền');
        }).catch(function () {
          musicButton.setAttribute('aria-label', 'Không thể phát nhạc. Nhấn để thử lại');
        });
      } else {
        audio.pause();
        musicButton.setAttribute('aria-pressed', 'false');
        musicButton.setAttribute('aria-label', 'Bật nhạc nền');
      }
    });
  }

  var sections = document.querySelectorAll('.observe');
  if (!('IntersectionObserver' in window) || reducedMotion) {
    sections.forEach(function (section) { section.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  sections.forEach(function (section) { observer.observe(section); });
}());
