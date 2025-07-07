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
});


