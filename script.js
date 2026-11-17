(function () {
  'use strict';

  const track = document.getElementById('sliderTrack');
  const viewport = document.getElementById('sliderViewport');
  const prevBtn = document.getElementById('arrowPrev');
  const nextBtn = document.getElementById('arrowNext');
  const pager = document.getElementById('pager');

  const slides = Array.from(track.children);
  const totalSlides = slides.length;
  const DOTS_COUNT = 3;

  function getVisibleCount() {
    return window.matchMedia('(min-width: 640px)').matches ? 3 : 1;
  }

  function getPageCount() {
    const visible = getVisibleCount();
    return Math.max(1, totalSlides - visible + 1);
  }

  let currentPage = 0;

  function buildPager() {
    pager.innerHTML = '';
    for (let i = 0; i < DOTS_COUNT; i++) {
      const dot = document.createElement('button');
      dot.className = 'pager-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Группа ' + (i + 1));
      dot.addEventListener('click', function () {
        const pageCount = getPageCount();
        const targetPage = Math.min(
          Math.floor(i * pageCount / DOTS_COUNT),
          pageCount - 1
        );
        goToPage(targetPage);
      });
      pager.appendChild(dot);
    }
    updatePager();
  }

  function updatePager() {
    const dots = pager.querySelectorAll('.pager-dot');
    const pageCount = getPageCount();
    const activeGroup = Math.min(
      Math.floor(currentPage * DOTS_COUNT / pageCount),
      DOTS_COUNT - 1
    );
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('active', idx === activeGroup);
    });
  }

  function goToPage(pageIndex) {
    const pageCount = getPageCount();

    if (pageIndex < 0) {
      pageIndex = pageCount - 1;
    } else if (pageIndex >= pageCount) {
      pageIndex = 0;
    }

    currentPage = pageIndex;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap) || 0;
    const offset = currentPage * (slideWidth + gap);

    track.style.transform = 'translateX(-' + offset + 'px)';
    updatePager();
  }

  prevBtn.addEventListener('click', function () {
    goToPage(currentPage - 1);
  });

  nextBtn.addEventListener('click', function () {
    goToPage(currentPage + 1);
  });

  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const pageCount = getPageCount();
      if (currentPage > pageCount - 1) {
        currentPage = pageCount - 1;
      }
      buildPager();
      goToPage(currentPage);
    }, 120);
  });

  buildPager();
  goToPage(0);
})();