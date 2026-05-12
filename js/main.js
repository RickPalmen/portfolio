document.addEventListener('DOMContentLoaded', () => {
  // ======= INTERSECTION OBSERVER =======
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('show', entry.isIntersecting);
    });
  });

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  // ======= BACKGROUND SLIDESHOW =======
  const backgrounds = [
    { img: 'assets/bg1.jpg', theme: 'dark-theme' },
    { img: 'assets/bg2.jpg', theme: 'dark-theme' },
    { img: 'assets/bg3.jpg', theme: 'dark-theme' },
    { img: 'assets/bg4.jpg', theme: 'dark-theme' },
  ];

  let index = 0;
  const slideshow = document.querySelector('.background-slideshow');

  if (slideshow) {
    const bgElement = document.createElement('div');
    Object.assign(bgElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '-1',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transition: 'opacity 1s ease',
      opacity: '0',
    });

    slideshow.appendChild(bgElement);

    function updateSlideshow() {
      const current = backgrounds[index % backgrounds.length];
      const { img, theme } = current;

      bgElement.style.opacity = '0';

      setTimeout(() => {
        bgElement.style.backgroundImage = `url(${img})`;
        document.body.classList.remove('white-theme');
        document.body.classList.add(theme);
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        bgElement.style.opacity = '1';
      }, 500);

      index++;
    }

    updateSlideshow();
    setInterval(updateSlideshow, 5000);
  }

  // ======= SIDEMENU BURGER FUNCTIONALITY =======
  const burgerMenu = document.getElementById('burgerMenu');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeBtn');

  if (burgerMenu && sideMenu && closeBtn) {
    burgerMenu.addEventListener('click', () => {
      sideMenu.style.right = '0';
    });

    closeBtn.addEventListener('click', () => {
      sideMenu.style.right = '-100%';
    });
  }

  // ======= TOGGLE NAV MENU (OPTIONAL USE) =======
  function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.toggle('show');
    }
  }

  // Optional: expose globally if used in inline HTML
  window.toggleMenu = toggleMenu;

  // ======= ADDITIONAL INTERSECTION OBSERVERS =======
  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('show2', entry.isIntersecting);
    });
  });

  const hiddenElements2 = document.querySelectorAll('.hidden2');
  hiddenElements2.forEach((el) => observer2.observe(el));

  const observer3 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('show3', entry.isIntersecting);
    });
  });

  const hiddenElements3 = document.querySelectorAll('.hidden3');
  hiddenElements3.forEach((el) => observer3.observe(el));

  // ======= FADE-UP OBSERVER =======
  const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeUpObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach((el) => fadeUpObserver.observe(el));

  // ======= FADE-IN OBSERVER =======
  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach((el) => fadeInObserver.observe(el));

  // ======= STAGGERED COLOR BOXES =======
  const colorboxObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const boxes = entry.target.querySelectorAll('div');
        boxes.forEach((box, i) => {
          setTimeout(() => box.classList.add('box-visible'), i * 90);
        });
        colorboxObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.colorboxes').forEach((el) => colorboxObserver.observe(el));

  // ======= STAGGERED TRAIT TAGS =======
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('span');
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('tag-visible'), i * 80);
        });
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.trait-tags').forEach((el) => tagObserver.observe(el));
  document.querySelectorAll('.skills-grid').forEach((el) => tagObserver.observe(el));
  document.querySelectorAll('.persona-traits').forEach((el) => tagObserver.observe(el));

  // ======= BRAND CONCEPTS SLIDER =======
  const conceptsTrack = document.getElementById('conceptsTrack');
  if (conceptsTrack) {
    Array.from(conceptsTrack.children).forEach(card => {
      conceptsTrack.appendChild(card.cloneNode(true));
    });
  }

  // ======= ALBUM SYSTEM =======
  const albumGrid   = document.getElementById('albumGrid');
  const albumDetail = document.getElementById('albumDetail');
  const albumBack   = document.getElementById('albumBack');
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  if (albumGrid) {

    // Hover slideshow per card
    albumGrid.querySelectorAll('.album-card').forEach(card => {
      const slides = Array.from(card.querySelectorAll('.album-slide'));
      let current = 0;
      let iv = null;

      card.addEventListener('mouseenter', () => {
        if (slides.length < 2) return;
        iv = setInterval(() => {
          slides[current].classList.remove('active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('active');
        }, 900);
      });

      card.addEventListener('mouseleave', () => {
        clearInterval(iv);
        slides[current].classList.remove('active');
        current = 0;
        slides[0].classList.add('active');
      });

      card.addEventListener('click', () => openAlbum(card));
    });

    albumBack && albumBack.addEventListener('click', closeAlbum);
  }

  function openAlbum(card) {
    const name   = card.querySelector('.album-name').textContent;
    const images = Array.from(card.querySelectorAll('.album-slide')).map(img => img.src);

    albumGrid.classList.add('exit');

    setTimeout(() => {
      albumGrid.style.display = 'none';
      albumGrid.classList.remove('exit');

      document.getElementById('albumDetailTitle').textContent = name;
      const container = document.getElementById('albumPhotos');
      container.innerHTML = '';

      images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'album-photo';
        img.style.cssText = `opacity:0; transform:translateY(28px); transition: opacity 0.6s ease ${i * 0.12}s, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.12}s`;
        img.addEventListener('click', () => openLightbox(src));
        container.appendChild(img);
      });

      albumDetail.style.display = 'block';
      albumDetail.classList.remove('exit');

      // Double rAF ensures transition plays after display:block
      requestAnimationFrame(() => requestAnimationFrame(() => {
        container.querySelectorAll('.album-photo').forEach(img => {
          img.style.opacity = '1';
          img.style.transform = 'translateY(0)';
        });
      }));

    }, 420);
  }

  function closeAlbum() {
    albumDetail.classList.add('exit');
    setTimeout(() => {
      albumDetail.style.display = 'none';
      albumDetail.classList.remove('exit');
      albumGrid.style.display = '';
      albumGrid.classList.add('enter');
      setTimeout(() => albumGrid.classList.remove('enter'), 600);
    }, 360);
  }

  // Lightbox
  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightbox && lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.id === 'lightboxClose') closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});


