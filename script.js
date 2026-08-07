/* ============================================================
   RICK PALMEN — PORTFOLIO — MONOCHROME — INTERACTIONS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderPct = document.getElementById('preloaderPct');
  let pct = 0;
  const pctIv = setInterval(() => {
    pct += Math.random() * 14;
    if (pct >= 100) pct = 100;
    preloaderFill.style.width = pct + '%';
    preloaderPct.textContent = String(Math.floor(pct)).padStart(2, '0');
    if (pct >= 100) clearInterval(pctIv);
  }, 110);

  function finishLoad() {
    pct = 100;
    preloaderFill.style.width = '100%';
    preloaderPct.textContent = '100';
    clearInterval(pctIv);
    setTimeout(() => {
      preloader.classList.add('is-done');
      document.body.classList.add('is-loaded');
    }, 350);
  }
  window.addEventListener('load', finishLoad);
  setTimeout(finishLoad, 2400); // fallback

  /* ---------- HERO NAME: slide right as you scroll past the hero ---------- */
  const heroEl = document.getElementById('top');
  const heroTitleWrap = document.querySelector('.hero-title-wrap');
  // measure the actual visual content (widest text line), not the full-width wrapper box
  const heroSlideEls = [
    { move: heroTitleWrap, measure: () => {
        const lines = Array.from(document.querySelectorAll('.hero-title-line'));
        return lines.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
      } }
  ].filter(o => o.move);
  let heroSlideDistances = [];

  function measureHeroSlide() {
    heroSlideEls.forEach(o => { o.move.style.transform = 'none'; });
    heroSlideDistances = heroSlideEls.map(o => {
      const target = o.measure();
      if (!target) return 0;
      const rect = target.getBoundingClientRect();
      const rightTargetLeft = window.innerWidth - rect.width - rect.left;
      return Math.max(0, rightTargetLeft - rect.left);
    });
  }

  function updateHeroSlide() {
    if (!heroEl) return;
    const progress = Math.min(1, Math.max(0, window.scrollY / heroEl.offsetHeight));
    heroSlideEls.forEach((o, i) => {
      o.move.style.transform = `translateX(${progress * (heroSlideDistances[i] || 0)}px)`;
    });
  }

  measureHeroSlide();
  window.addEventListener('load', measureHeroSlide);
  window.addEventListener('resize', () => { measureHeroSlide(); updateHeroSlide(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measureHeroSlide(); updateHeroSlide(); });
  window.addEventListener('scroll', updateHeroSlide, { passive: true });

  /* ---------- CROSSHAIR CURSOR ---------- */
  const cross = document.getElementById('cursorCross');
  const canHover = window.matchMedia('(hover:hover)').matches;
  if (canHover) {
    document.body.classList.add('cursor-ready');
    window.addEventListener('mousemove', e => {
      cross.style.left = e.clientX + 'px';
      cross.style.top = e.clientY + 'px';
    });

    const growTargets = 'a, button, [data-tilt], .case-card, .album-card, .case-previews-grid img, .album-photos img, .traits span';
    document.body.addEventListener('mouseover', e => {
      if (e.target.closest(growTargets)) cross.classList.add('is-active');
    });
    document.body.addEventListener('mouseout', e => {
      if (e.target.closest(growTargets)) cross.classList.remove('is-active');
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- STAT COUNT-UP ---------- */
  const statIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const pad = el.textContent.length;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 36));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = String(target).padStart(pad, '0'); return; }
        el.textContent = String(cur).padStart(pad, '0');
        requestAnimationFrame(tick);
      };
      tick();
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num[data-count]').forEach(el => statIO.observe(el));

  /* ---------- JOURNEY PHOTO: match timeline height exactly ---------- */
  function matchJourneyPhotoHeight() {
    const photo = document.querySelector('.journey-photo');
    const timeline = document.querySelector('.timeline');
    if (!photo || !timeline) return;
    if (window.matchMedia('(max-width:900px)').matches) { photo.style.height = ''; return; }
    photo.style.height = timeline.getBoundingClientRect().height + 'px';
  }
  matchJourneyPhotoHeight();
  window.addEventListener('load', matchJourneyPhotoHeight);
  window.addEventListener('resize', matchJourneyPhotoHeight);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(matchJourneyPhotoHeight);

  /* ---------- NAV: compact on scroll + scrollspy ---------- */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionIds = ['top', 'about', 'journey', 'work', 'skills', 'gallery', 'contact'];
  const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-compact', window.scrollY > 40);

    let current = sectionEls[0];
    sectionEls.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.4) current = sec;
    });
    navLinks.forEach(a => a.classList.toggle('is-active', a.dataset.target === current.id));
  }, { passive: true });

  /* ---------- EASED SMOOTH SCROLL FOR data-target ---------- */
  function animateScrollTo(targetY, duration = 1100) {
    const startY = window.scrollY;
    const dist = targetY - startY;
    const startTime = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      window.scrollTo(0, startY + dist * ease(t));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('[data-target]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      if (target) {
        const y = a.dataset.target === 'top' ? 0 : target.offsetTop - 70;
        animateScrollTo(y);
      }
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navLinksPanel.classList.remove('is-open');
    });
  });

  /* ---------- MOBILE NAV TOGGLE ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksPanel = document.querySelector('.nav-links');
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open');
    navLinksPanel.classList.toggle('is-open');
  });

  /* ---------- TILT ON BRAND CONCEPT TILES ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- MAGNETIC BUTTON ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- CASE STUDY DATA ---------- */
  const caseData = {
    ads: {
      title: 'Achter de Schermen',
      img: 'assets/Achter De Schermen.png',
      heroFit: 'mark',
      colors: ['#FA682A', '#194078', '#99A1AF', '#B2B2B2', '#EFBF04'],
      typefaces: ['Sometype Mono', 'Sometype Mono Italic', 'Sometype Mono Bold'],
      text: [
        'The assignment from Statistics Netherlands (CBS) was intentionally broad, giving us the freedom to choose our own angle and storytelling approach. We decided to focus on smartphones, because they are highly relatable to teenagers and closely connected to their everyday lives. By using a familiar product, we wanted to raise awareness among 16–18 year olds about the hidden reality behind the production of these devices and the poor working conditions many people face while extracting the materials needed to make them.',
        'To tell this story in an engaging and accessible way, we created an interactive multimedia experience centered around five critical raw materials: copper, gold, nickel, lithium, and cobalt. Each material was represented through its own small visualization, helping users understand its role inside a smartphone and where it comes from.',
        'Our main character, Hans, guided the user throughout the experience. Hans was portrayed as a broken smartphone travelling through different mining environments in search of the "missing" materials needed to repair himself. As he collected these resources, the story gradually revealed the harsh realities behind the extraction process and aimed to make users more conscious of the human impact hidden behind modern technology.'
      ],
      figma: 'https://www.figma.com/proto/aJCReZ1t4ZSyMTDoUNsUWN/Multimedia-Story?node-id=34-52&p=f&viewport=144%2C475%2C0.09&t=ZwpJT3T7hQBRaNrE-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=34%3A52&page-id=0%3A1',
      previews: ['assets/ADS preview1.png']
    },
    animo: {
      title: 'Animo',
      img: 'assets/animo.png',
      heroFit: 'mark',
      colors: ['#FF4D6D', '#C9184A', '#FFD6FF', '#FFFFFF'],
      typefaces: ['Archivo Black', 'Poppins'],
      text: [
        'I developed a concept for Cubiss, an organization dedicated to encouraging reading development among children and teenagers. The challenge was to create something that could make reading feel more relevant and exciting for a younger audience — especially in a digital world full of distractions. My concept was an app designed specifically for teens, where they could explore the favorite books of their personal idols.',
        "Whether it's artists, athletes, influencers, or content creators, the app allows well-known figures to share the books that inspired them, shaped their mindset, or helped them through pivotal moments in their lives. The idea was to bridge the gap between entertainment and education, showing that reading isn't just something you have to do, but something that even your heroes value. I focused on creating an interface that felt modern, visually engaging, and easy to navigate — something that fits naturally into the everyday lives of teens, while gently encouraging them to discover stories that might resonate with their own journey."
      ],
      previews: ['assets/Animo preview1.png', 'assets/Animo preview2.png', 'assets/Animo preview3.png']
    },
    safari: {
      title: 'Coding Safari',
      img: 'assets/codesafari.png',
      heroFit: 'mark',
      colors: ['#181A4A', '#E697A8', '#0E89C8', '#36A66A', '#EFB626', '#E4552C'],
      typefaces: ['Montserrat', 'Cascadia Code'],
      text: [
        'In Code Safari, our mission was to introduce young people to the world of coding and help reshape the way they perceive it — not just as a technical or abstract skill, but as a powerful and creative tool for self-expression. We organized and delivered interactive workshops at a local high school, where we guided students step by step through the process of using code to create digital art.',
        'From generating patterns to building interactive visuals, the sessions were hands-on, playful, and designed to spark curiosity. By blending technology with creativity, we wanted to break down the barriers that often make coding seem intimidating or "not for everyone." Our goal was to make it feel approachable, fun, and inspiring — especially for those who had never considered programming before. Seeing students light up as they watched their code come to life was one of the most rewarding parts of the project.'
      ],
      previews: ['assets/codesafari preview1.png', 'assets/codesafari preview2.png']
    },
    hein: {
      title: "Hein's Multimedia Story",
      img: 'assets/Hein.png',
      colors: ['#124E0C', '#286322', '#44B43A', '#2D1605', '#795432', '#C89D7E'],
      typefaces: ['Lilita One', 'Inter'],
      text: [
        'In this project, we collaborated with data provided by CBS (Centraal Bureau voor de Statistiek), a leading organization responsible for collecting and analyzing statistical information in the Netherlands. The challenge was to transform raw data into a compelling multimedia story that would not only inform but also immerse the reader in the subject matter. Our team chose to focus on beer exports from the Netherlands and Belgium — two countries known for their brewing heritage.',
        'We conducted in-depth research to uncover how their export strategies differ, analyzing trends, target markets, and volume over time. The goal was to make complex data accessible and engaging by combining visual storytelling, interactivity, and thoughtful design.',
        'We created a story that goes deeper into the beer industry in the Netherlands and Belgium, following a fictional character who travels around Belgium to see how the two countries differ in their beer culture and production. Belgium is more focused on local and exclusive beer, while the Netherlands leans toward export and mass production.'
      ],
      previews: ['assets/Heins Avontuur preview1.png', 'assets/Heins Avontuur preview2.png']
    },
    zuyderland: {
      title: 'Zuyderland',
      img: 'assets/Zuyderland kamer.png',
      colors: ['#FF6F6F', '#4FC7B5', '#8FA8F0', '#C99BF0', '#A8D97A', '#F5B15C'],
      typefaces: ['Inter', 'Poppins'],
      figma: 'https://www.figma.com/proto/wWKrufxnztWZkR5kwoPyfD/Blok-2.4-Zuyderland?node-id=84-276&p=f&viewport=2003%2C621%2C0.08&t=jNNMJ92wIjgHUpFT-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=84%3A276&page-id=0%3A1',
      text: [
        "For Zuyderland, a healthcare organization focused on patient wellbeing, I designed the interface for an in-room treatment-light experience that gives patients control over their environment during their stay. Through a simple touch panel, patients can choose the mood and colour of their room's ambient lighting, adjust brightness, and set an evening routine that gradually shifts the light warmer and softer to support a good night's rest.",
        'Paired with the lighting system is a curated digital art canvas built into the wall, letting patients enjoy artwork from real artists directly inside their room, shifting alongside the chosen ambiance. The goal was to turn a clinical, one-size-fits-all space into something warmer and more personal — giving people back a small sense of control and comfort during a difficult time.'
      ],
      previews: ['assets/Zuyderland besturing.png', 'assets/Zuyderland kamer oranje.png']
    }
  };

  const caseGrid = document.getElementById('caseGrid');
  const caseDetail = document.getElementById('caseDetail');
  const caseBack = document.getElementById('caseBack');
  const caseDetailHero = document.getElementById('caseDetailHero');
  const caseDetailImg = document.getElementById('caseDetailImg');
  const caseDetailTitle = document.getElementById('caseDetailTitle');
  const caseDetailColors = document.getElementById('caseDetailColors');
  const caseDetailTypefaces = document.getElementById('caseDetailTypefaces');
  const caseDetailText = document.getElementById('caseDetailText');
  const caseFigmaLink = document.getElementById('caseFigmaLink');
  const caseDetailPreviews = document.getElementById('caseDetailPreviews');
  const caseDetailPreviewsGrid = document.getElementById('caseDetailPreviewsGrid');

  function openCase(key) {
    const data = caseData[key];
    if (!data) return;

    caseDetailImg.src = data.img;
    caseDetailImg.alt = data.title;
    caseDetailHero.classList.toggle('case-detail-hero--mark', data.heroFit === 'mark');
    caseDetailTitle.textContent = data.title;

    caseDetailColors.innerHTML = '';
    (data.colors || []).forEach(hex => {
      const sw = document.createElement('span');
      sw.style.background = hex;
      sw.title = hex;
      caseDetailColors.appendChild(sw);
    });

    caseDetailTypefaces.textContent = (data.typefaces || []).join('  /  ');

    caseDetailText.innerHTML = '';
    data.text.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      caseDetailText.appendChild(p);
    });

    if (data.figma) {
      caseFigmaLink.href = data.figma;
      caseFigmaLink.style.display = 'inline-flex';
    } else {
      caseFigmaLink.style.display = 'none';
    }

    caseDetailPreviewsGrid.innerHTML = '';
    if (data.previews && data.previews.length) {
      data.previews.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = data.title + ' preview';
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(src));
        caseDetailPreviewsGrid.appendChild(img);
      });
      caseDetailPreviews.style.display = '';
    } else {
      caseDetailPreviews.style.display = 'none';
    }

    caseGrid.style.display = 'none';
    caseDetail.classList.add('is-open');
  }

  function closeCase() {
    caseDetail.classList.remove('is-open');
    caseGrid.style.display = '';
  }

  document.querySelectorAll('[data-case]').forEach(card => {
    card.addEventListener('click', () => openCase(card.dataset.case));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(card.dataset.case); }
    });
  });
  caseBack.addEventListener('click', closeCase);

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('is-open');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('is-open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('is-open'); });

  /* ---------- ALBUM SYSTEM ---------- */
  const albumGrid = document.getElementById('albumGrid');
  const albumDetail = document.getElementById('albumDetail');
  const albumBack = document.getElementById('albumBack');

  albumGrid.querySelectorAll('.album-card').forEach(card => {
    const slides = Array.from(card.querySelectorAll('.album-slide'));
    let current = 0, iv = null;
    card.addEventListener('mouseenter', () => {
      if (slides.length < 2) return;
      iv = setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 850);
    });
    card.addEventListener('mouseleave', () => {
      clearInterval(iv);
      slides[current].classList.remove('active');
      current = 0;
      slides[0].classList.add('active');
    });
    card.addEventListener('click', () => openAlbum(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAlbum(card); }
    });
  });

  function openAlbum(card) {
    const name = card.querySelector('.album-name').textContent;
    const images = Array.from(card.querySelectorAll('.album-slide')).map(img => img.src);

    document.getElementById('albumDetailTitle').textContent = name;
    const container = document.getElementById('albumPhotos');
    container.innerHTML = '';
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = name;
      img.addEventListener('click', () => openLightbox(src));
      container.appendChild(img);
    });

    albumGrid.style.display = 'none';
    albumDetail.style.display = 'block';
  }

  albumBack.addEventListener('click', () => {
    albumDetail.style.display = 'none';
    albumGrid.style.display = '';
  });

  /* ---------- ESC CLOSES OVERLAYS ---------- */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    lightbox.classList.remove('is-open');
    if (caseDetail.classList.contains('is-open')) closeCase();
    if (albumDetail.style.display === 'block') { albumDetail.style.display = 'none'; albumGrid.style.display = ''; }
  });

});
