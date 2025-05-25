const backgrounds = [
    { img: 'assets/bg1.jpg', theme: 'dark-theme' },
    { img: 'assets/bg2.jpg', theme: 'dark-theme' },
    { img: 'assets/bg3.jpg', theme: 'dark-theme' },
    { img: 'assets/bg4.jpg', theme: 'dark-theme' },
  ];

  let index = 0;
  const slideshow = document.querySelector('.background-slideshow');

  const bgElement = document.createElement('div');
  bgElement.style.position = 'absolute';
  bgElement.style.top = '0';
  bgElement.style.left = '0';
  bgElement.style.width = '100%';
  bgElement.style.height = '100%';
  bgElement.style.zIndex = '-1';
  bgElement.style.backgroundSize = 'cover';
  bgElement.style.backgroundPosition = 'center';
  bgElement.style.transition = 'opacity 1s ease';
  bgElement.style.opacity = '0';

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

  // ======= SIDEMENU BURGER FUNCTIONALITY =======
  const burgerMenu = document.getElementById('burgerMenu');
  const sideMenu = document.getElementById('sideMenu');
  const closeBtn = document.getElementById('closeBtn');

  burgerMenu.addEventListener('click', () => {
    sideMenu.style.right = '0';
  });

  closeBtn.addEventListener('click', () => {
    sideMenu.style.right = '-100%';
  });

  // ======= LIGHTBOX FUNCTIONALITY =======
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCloseBtn = document.querySelector(".close");

  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
    });
  });

  lightboxCloseBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg && e.target !== lightboxCloseBtn) {
      lightbox.style.display = "none";
    }
  });
