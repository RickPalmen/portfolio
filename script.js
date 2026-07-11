/* ============================================================
   RICK PALMEN — WARM JOURNEY PORTFOLIO — INTERACTIONS
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 400);
  });
  setTimeout(() => preloader.classList.add('done'), 2000); // fallback

  /* ---------- CLEAN CROSSHAIR CURSOR ---------- */
  const cross = document.getElementById('cursorCross');
  const root = document.documentElement;
  let mx = 0, my = 0, gridRafPending = false;
  window.addEventListener('mousemove', e => {
    cross.style.left = e.clientX + 'px';
    cross.style.top = e.clientY + 'px';
    mx = e.clientX; my = e.clientY;
    if (!gridRafPending) {
      gridRafPending = true;
      requestAnimationFrame(() => {
        root.style.setProperty('--mx', mx + 'px');
        root.style.setProperty('--my', my + 'px');
        gridRafPending = false;
      });
    }
  });
  document.querySelectorAll('a, button, [data-tilt], .album-card, .album-photo, .case-card, .case-previews-grid img').forEach(el => {
    el.addEventListener('mouseenter', () => cross.classList.add('grow'));
    el.addEventListener('mouseleave', () => cross.classList.remove('grow'));
  });

  /* Swap crosshair to the background color over accent-colored surfaces (red-on-red would be invisible) */
  document.querySelectorAll('.contact-card, .trait-pill').forEach(el => {
    el.addEventListener('mouseenter', () => cross.classList.add('on-accent'));
    el.addEventListener('mouseleave', () => cross.classList.remove('on-accent'));
  });

  /* ---------- INSTAGRAM-STYLE PHOTO TAG ---------- */
  const tagToggle = document.getElementById('tagToggle');
  const photoTag = document.getElementById('photoTag');
  if (tagToggle && photoTag) {
    tagToggle.addEventListener('click', () => {
      const showing = photoTag.classList.toggle('visible');
      tagToggle.classList.toggle('active', showing);
      tagToggle.setAttribute('aria-pressed', String(showing));
    });
  }

  /* ---------- WORD-BY-WORD TEXT SPLIT (for [data-split] targets) ---------- */
  function splitIntoWords(el) {
    const nodes = Array.from(el.childNodes);
    el.innerHTML = '';
    let i = 0;
    const wrapToken = (contentNode) => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.style.transitionDelay = (i * 40) + 'ms';
      i++;
      inner.appendChild(contentNode);
      mask.appendChild(inner);
      el.appendChild(mask);
    };
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part === '') return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(part)); return; }
          wrapToken(document.createTextNode(part));
        });
      } else {
        wrapToken(node.cloneNode(true));
      }
    });
  }
  document.querySelectorAll('[data-split]').forEach(splitIntoWords);

  /* ---------- HERO NAME (scramble like akicreate.com's hero) ---------- */
  const heroGrid = document.getElementById('heroGrid');
  if (heroGrid) {
    const WORDS = [
      { text: 'Rick' },
      { text: 'Palmen', accent: true }
    ];
    const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const randChar = isUpper => {
      const pool = isUpper ? UPPER : LOWER;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const cells = [];
    WORDS.forEach(w => {
      const line = document.createElement('div');
      line.className = 'hero-name-line';
      w.text.split('').forEach(ch => {
        const cell = document.createElement('span');
        cell.className = 'grid-cell';
        if (w.accent) cell.classList.add('is-accent');
        cell.textContent = ch;
        cell.dataset.final = ch;
        cell.dataset.upper = ch === ch.toUpperCase() && ch !== ch.toLowerCase() ? '1' : '0';
        line.appendChild(cell);
        cells.push(cell);
      });
      heroGrid.appendChild(line);
    });

    function scrambleCell(cell, delayMs) {
      const finalChar = cell.dataset.final;
      const isUpper = cell.dataset.upper === '1';
      let ticks = 0;
      const maxTicks = 2 + Math.floor(Math.random() * 3);
      setTimeout(() => {
        const iv = setInterval(() => {
          cell.textContent = randChar(isUpper);
          ticks++;
          if (ticks >= maxTicks) {
            clearInterval(iv);
            cell.textContent = finalChar;
          }
        }, 130);
      }, delayMs);
    }

    function runScramble() {
      cells.forEach((cell, i) => scrambleCell(cell, i * 80));
    }

    heroGrid.addEventListener('mouseenter', runScramble);
    window.addEventListener('load', () => setTimeout(runScramble, 900));
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal, .img-reveal, .slide-in, [data-split]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- STAT COUNT-UP ---------- */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.round(target / 40));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  statEls.forEach(el => statIO.observe(el));

  /* ---------- DOCK NAV: scrollspy + hide/show ---------- */
  const dock = document.getElementById('dock');
  const dockLinks = document.querySelectorAll('.dock-links a');
  const sections = ['hero', 'story', 'work', 'skills', 'gallery', 'contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  /* Use each section's own eyebrow label (its visible heading marker) as the scrollspy
     reference instead of the section's raw box top — sections have 100px+ of empty top
     padding, so measuring from the box edge made the nav switch well before any content
     from the new section was actually visible. */
  const sectionMarkers = sections.map(sec => ({ id: sec.id, marker: sec.querySelector('.eyebrow') || sec }));

  /* ---------- BIG TITLES: scroll-linked fill (darkens as it enters view) ---------- */
  /* Text nodes get wrapped in .fill-run spans; <em> is left untouched as a sibling so
     its solid accent color never sits inside the same background-clip:text region
     (nesting it there caused a faint stroke artifact at the glyph edges). */
  function wrapFillRuns(el) {
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const span = document.createElement('span');
        span.className = 'fill-run';
        node.parentNode.insertBefore(span, node);
        span.appendChild(node);
      }
    });
  }
  document.querySelectorAll('[data-fill]').forEach(wrapFillRuns);

  const fillRunEls = document.querySelectorAll('.fill-run');
  function updateFills() {
    const vh = window.innerHeight;
    const startY = vh * 0.85; // fill starts when the title reaches 85% down the viewport
    const endY = vh * 0.45;   // fully filled once it reaches 45%
    fillRunEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      let progress = (startY - top) / (startY - endY);
      progress = Math.max(0, Math.min(1, progress));
      el.style.backgroundPosition = (100 - progress * 100) + '% 0';
    });
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    dock.classList.toggle('scrolled', y > 40);

    // timeline fill
    const timeline = document.querySelector('.timeline');
    const fill = document.getElementById('timelineFill');
    if (timeline && fill) {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const progressed = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
      fill.style.height = (progressed / total * 100) + '%';
    }

    updateFills();

    // scrollspy — switches once each section's own eyebrow label scrolls near the top
    // of the viewport, so it lines up with content actually being visible
    let current = sections[0];
    sectionMarkers.forEach(({ id, marker }) => {
      const markerTop = marker.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= markerTop - 120) current = sections.find(s => s.id === id);
    });
    // once scrolled to (or within a couple px of) the bottom of the page, force the last
    // section active — a short final section may never satisfy the marker threshold above,
    // since scrollY can never reach markerTop - 120 if that would overshoot the page's max scroll
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 2) current = sections[sections.length - 1];
    dockLinks.forEach(a => a.classList.toggle('active', a.dataset.target === current.id));
  }, { passive: true });
  updateFills();

  /* ---------- SMOOTH SCROLL FOR data-target links ---------- */
  document.querySelectorAll('[data-target]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      dock.classList.remove('open');
      dockToggle.classList.remove('open');
    });
  });

  /* ---------- MOBILE DOCK TOGGLE ---------- */
  const dockToggle = document.getElementById('dockToggle');
  dockToggle.addEventListener('click', () => {
    dock.classList.toggle('open');
    dockToggle.classList.toggle('open');
  });

  /* ---------- 3D TILT CARDS ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const inner = card.querySelector('.tilt-card-inner');
      inner.style.transform = `rotateX(${py * -12}deg) rotateY(${px * 12}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.tilt-card-inner').style.transform = 'rotateX(0) rotateY(0)';
    });
  });

  /* ---------- MAGNETIC BUTTON ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- CASE STUDY DETAIL (in-page, no popup) ---------- */
  const caseData = {
    ads: {
      title: 'Achter de Schermen',
      img: 'assets/Achter De Schermen.png',
      heroFit: 'mark',
      colors: ['#FA682A', '#194078', '#99A1AF', '#B2B2B2', '#EFBF04'],
      typefaces: [
        { name: 'Sometype Mono', family: '"Sometype Mono", monospace' },
        { name: 'Sometype Mono Italic', family: '"Sometype Mono", monospace', style: 'italic' },
        { name: 'Sometype Mono Bold', family: '"Sometype Mono", monospace', weight: 700 }
      ],
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
      typefaces: [
        { name: 'Archivo Black', family: '"Archivo Black", sans-serif' },
        { name: 'Poppins', family: '"Poppins", sans-serif' }
      ],
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
      typefaces: [
        { name: 'Montserrat', family: '"Montserrat", sans-serif' },
        { name: 'Cascadia Code', family: '"Cascadia Code", monospace' }
      ],
      text: [
        'In Code Safari, our mission was to introduce young people to the world of coding and help reshape the way they perceive it — not just as a technical or abstract skill, but as a powerful and creative tool for self-expression. We organized and delivered interactive workshops at a local high school, where we guided students step by step through the process of using code to create digital art.',
        'From generating patterns to building interactive visuals, the sessions were hands-on, playful, and designed to spark curiosity. By blending technology with creativity, we wanted to break down the barriers that often make coding seem intimidating or "not for everyone." Our goal was to make it feel approachable, fun, and inspiring — especially for those who had never considered programming before. Seeing students light up as they watched their code come to life was one of the most rewarding parts of the project.'
      ],
      previews: ['assets/codesafari preview1.png', 'assets/codesafari preview2.png']
    },
    hein: {
      title: "Hein's Multimedia Story",
      img: 'assets/Hein.png',
      heroFit: 'mark',
      colors: ['#124E0C', '#286322', '#44B43A', '#2D1605', '#795432', '#C89D7E'],
      typefaces: [
        { name: 'Lilita One', family: '"Lilita One", sans-serif' },
        { name: 'Inter', family: '"Inter", sans-serif' }
      ],
      text: [
        'In this project, we collaborated with data provided by CBS (Centraal Bureau voor de Statistiek), a leading organization responsible for collecting and analyzing statistical information in the Netherlands. The challenge was to transform raw data into a compelling multimedia story that would not only inform but also immerse the reader in the subject matter. Our team chose to focus on beer exports from the Netherlands and Belgium — two countries known for their brewing heritage.',
        'We conducted in-depth research to uncover how their export strategies differ, analyzing trends, target markets, and volume over time. The goal was to make complex data accessible and engaging by combining visual storytelling, interactivity, and thoughtful design. It was a valuable experience in turning abstract numbers into a narrative that could be understood and appreciated by a broader audience.',
        'We created a story that goes deeper into the beer industry in the Netherlands and Belgium, following a fictional character who travels around Belgium to see how the two countries differ in their beer culture and production. Belgium is more focused on local and exclusive beer, while the Netherlands leans toward export and mass production. Along the way you get vibrant visuals and clear data that make the differences easy to read and understand.'
      ],
      previews: ['assets/Heins Avontuur preview1.png', 'assets/Heins Avontuur preview2.png']
    },
    zuyderland: {
      title: 'Zuyderland',
      img: 'assets/Zuyderland kamer.png',
      heroFit: 'photo',
      colors: ['#FF6F6F', '#4FC7B5', '#8FA8F0', '#C99BF0', '#A8D97A', '#F5B15C'],
      typefaces: [
        { name: 'Inter', family: '"Inter", sans-serif' },
        { name: 'Poppins', family: '"Poppins", sans-serif' }
      ],
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
  const caseDetailImg = document.getElementById('caseDetailImg');
  const caseDetailHero = document.getElementById('caseDetailHero');
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
      sw.className = 'color-swatch';
      sw.style.background = hex;
      sw.title = hex;
      caseDetailColors.appendChild(sw);
    });

    caseDetailTypefaces.innerHTML = '';
    (data.typefaces || []).forEach(tf => {
      const tag = document.createElement('span');
      tag.className = 'typeface-tag';
      tag.textContent = tf.name;
      tag.style.fontFamily = tf.family;
      if (tf.style) tag.style.fontStyle = tf.style;
      if (tf.weight) tag.style.fontWeight = tf.weight;
      caseDetailTypefaces.appendChild(tag);
    });

    caseDetailText.innerHTML = '';
    (Array.isArray(data.text) ? data.text : [data.text]).forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      caseDetailText.appendChild(p);
    });

    if (data.figma) {
      caseFigmaLink.href = data.figma;
      caseFigmaLink.style.display = '';
    } else {
      caseFigmaLink.style.display = 'none';
    }

    caseDetailPreviewsGrid.innerHTML = '';
    if (data.previews && data.previews.length) {
      caseDetailPreviewsGrid.className = 'case-previews-grid cols-' + Math.min(data.previews.length, 3);
      data.previews.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = data.title + ' preview';
        img.loading = 'lazy';
        img.addEventListener('click', () => openLightbox(src));
        img.addEventListener('mouseenter', () => cross.classList.add('grow'));
        img.addEventListener('mouseleave', () => cross.classList.remove('grow'));
        caseDetailPreviewsGrid.appendChild(img);
      });
      caseDetailPreviews.style.display = '';
    } else {
      caseDetailPreviews.style.display = 'none';
    }

    caseGrid.classList.add('exit');
    setTimeout(() => {
      caseGrid.style.display = 'none';
      caseGrid.classList.remove('exit');
      caseDetail.style.display = 'block';
      caseDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  function closeCase() {
    caseDetail.classList.add('exit');
    setTimeout(() => {
      caseDetail.style.display = 'none';
      caseDetail.classList.remove('exit');
      caseGrid.style.display = '';
      caseGrid.classList.add('enter');
      setTimeout(() => caseGrid.classList.remove('enter'), 500);
      caseGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  document.querySelectorAll('[data-case]').forEach(card => {
    card.addEventListener('click', () => openCase(card.dataset.case));
  });
  caseBack.addEventListener('click', closeCase);

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---------- ALBUM SYSTEM ---------- */
  const albumGrid = document.getElementById('albumGrid');
  const albumDetail = document.getElementById('albumDetail');
  const albumBack = document.getElementById('albumBack');

  if (albumGrid) {
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

    albumBack.addEventListener('click', closeAlbum);
  }

  function openAlbum(card) {
    const name = card.querySelector('.album-name').textContent;
    const images = Array.from(card.querySelectorAll('.album-slide')).map(img => img.src);

    albumGrid.classList.add('exit');
    setTimeout(() => {
      albumGrid.style.display = 'none';
      albumGrid.classList.remove('exit');

      document.getElementById('albumDetailTitle').textContent = name;
      const container = document.getElementById('albumPhotos');
      container.innerHTML = '';
      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'album-photo';
        img.alt = name;
        img.addEventListener('click', () => openLightbox(src));
        img.addEventListener('mouseenter', () => cross.classList.add('grow'));
        img.addEventListener('mouseleave', () => cross.classList.remove('grow'));
        container.appendChild(img);
      });

      albumDetail.style.display = 'block';
      albumDetail.classList.remove('exit');
    }, 300);
  }

  function closeAlbum() {
    albumDetail.classList.add('exit');
    setTimeout(() => {
      albumDetail.style.display = 'none';
      albumDetail.classList.remove('exit');
      albumGrid.style.display = '';
      albumGrid.classList.add('enter');
      setTimeout(() => albumGrid.classList.remove('enter'), 500);
    }, 300);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      lightbox.classList.remove('open');
      if (caseDetail.style.display === 'block') closeCase();
    }
  });

});
