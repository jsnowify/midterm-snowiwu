gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  scrambleDuration: 600,
  frameRate: 30,
  binaryChars: "01",
  letterChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  soundEnabled: false,
  scroll: {
    revealDuration: 0.9,
    revealStart: "top 85%",
  },
};

const mainMusic = new Audio("assets/sounds/main.mp3");
mainMusic.volume = 0.3;
mainMusic.loop = true;

const navLinkSound = new Audio("assets/sounds/select-1.wav");
navLinkSound.volume = 0.4;

const logoSound = new Audio("assets/sounds/hover-2.wav");
logoSound.volume = 0.4;

const roleSound = new Audio("assets/sounds/select-1.wav");
roleSound.volume = 0.4;

const imageHoverSound = new Audio("assets/sounds/select-1.wav");
imageHoverSound.volume = 0.4;

const hamburgerMenu = document.getElementById("hamburgerMenu");
const mobileNav = document.getElementById("mobileNav");
const overlay = document.getElementById("overlay");
const mobileSoundToggle = document.getElementById("mobileSoundToggle");
const mobileSoundText = document.querySelector(".mobile-sound-text");
const mobileTimeDisplay = document.getElementById("mobileTimeDisplay");

function toggleMobileMenu() {
  hamburgerMenu.classList.toggle("active");
  mobileNav.classList.toggle("active");
  overlay.classList.toggle("active");

  const nav = document.getElementById("mainNav");
  if (nav.classList.contains("dark-mode")) {
    mobileNav.classList.add("dark-mode");
  } else {
    mobileNav.classList.remove("dark-mode");
  }

  document.body.style.overflow = mobileNav.classList.contains("active")
    ? "hidden"
    : "";
}

hamburgerMenu.addEventListener("click", toggleMobileMenu);
overlay.addEventListener("click", toggleMobileMenu);

document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
  link.addEventListener("click", toggleMobileMenu);
});

const soundToggle = document.getElementById("soundToggle");
const soundText = document.querySelector(".sound-text");
const timeDisplay = document.getElementById("timeDisplay");

soundText.textContent = "Sound: OFF";
mobileSoundText.textContent = "Sound: OFF";

function toggleSound() {
  CONFIG.soundEnabled = !CONFIG.soundEnabled;
  soundText.textContent = `Sound: ${CONFIG.soundEnabled ? "ON" : "OFF"}`;
  mobileSoundText.textContent = `Sound: ${CONFIG.soundEnabled ? "ON" : "OFF"}`;
  soundToggle.classList.toggle("active", CONFIG.soundEnabled);
  mobileSoundToggle.classList.toggle("active", CONFIG.soundEnabled);

  if (CONFIG.soundEnabled) {
    mainMusic
      .play()
      .catch((err) =>
        console.warn("Autoplay blocked until user interacts:", err)
      );
  } else {
    stopMusic(true);
  }
}

soundToggle.addEventListener("click", toggleSound);
mobileSoundToggle.addEventListener("click", toggleSound);

function stopMusic(fullStop = false) {
  mainMusic.pause();
  if (fullStop) mainMusic.currentTime = 0;
}

document.addEventListener("visibilitychange", () => {
  if (!CONFIG.soundEnabled) return;

  if (document.hidden) {
    mainMusic.pause();
  } else {
    mainMusic.play().catch(() => {});
  }
});

window.addEventListener("blur", () => {
  if (CONFIG.soundEnabled) mainMusic.pause();
});

window.addEventListener("focus", () => {
  if (CONFIG.soundEnabled) mainMusic.play().catch(() => {});
});

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  mobileTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateTime, 1000);
updateTime();

class Scrambler {
  constructor(element, chars, sound) {
    this.element = element;
    this.originalText = element.textContent.trim();
    this.chars = chars;
    this.sound = sound;
    this.isAnimating = false;
  }

  getRandomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  scramble() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    if (CONFIG.soundEnabled && this.sound) {
      this.sound.currentTime = 0;
      this.sound.play().catch(() => {});
    }

    const chars = this.originalText.split("");
    const totalFrames = (CONFIG.scrambleDuration / 1000) * CONFIG.frameRate;
    let frame = 0;

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * chars.length);

      const displayText = chars
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;
          return this.getRandomChar();
        })
        .join("");

      this.element.textContent = displayText;

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        this.element.textContent = this.originalText;
        this.isAnimating = false;
      }
    };

    animate();
  }
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  const scrambler = new Scrambler(link, CONFIG.binaryChars, navLinkSound);
  link.addEventListener("mouseenter", () => scrambler.scramble());
  link.addEventListener("focus", () => scrambler.scramble());
});

const logoElement = document.querySelector(".logo");
const logoScrambler = new Scrambler(logoElement, CONFIG.letterChars, logoSound);
logoElement.addEventListener("mouseenter", () => logoScrambler.scramble());
logoElement.addEventListener("focus", () => logoScrambler.scramble());

document.querySelectorAll(".design-role").forEach((role) => {
  const scrambler = new Scrambler(role, CONFIG.binaryChars, roleSound);
  role.addEventListener("mouseenter", () => scrambler.scramble());
});

gsap.from("nav", {
  y: -60,
  opacity: 0,
  duration: 0.9,
  ease: "power4.out",
});

gsap.utils.toArray("section:not(#connect)").forEach((section) => {
  gsap.from(section, {
    scrollTrigger: {
      trigger: section,
      start: CONFIG.scroll.revealStart,
      toggleActions: "play none none none",
    },
    opacity: 0,
    y: 40,
    duration: CONFIG.scroll.revealDuration,
    ease: "power3.out",
  });
});

function initSplitTextAnimation() {
  const splitTextElement = document.getElementById("splitText");
  const text = "ABOUT";

  splitTextElement.textContent = "";
  const letters = text.split("");

  letters.forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("split-letter");
    splitTextElement.appendChild(span);
  });

  const splitLetters = document.querySelectorAll(".split-letter");

  splitLetters.forEach((letter, index) => {
    gsap.set(letter, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      rotationX: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top bottom-=10px",
        end: "top top+=10px",
        scrub: 0.5,
        toggleActions: "play reverse play reverse",
        markers: false,
      },
    });

    tl.to(
      letter,
      {
        duration: 1,
        y: 100,
        opacity: 0,
        rotationX: -90,
        filter: "blur(10px)",
        ease: "back.in(1.7)",
        delay: index * 0.1,
      },
      0
    );
  });

  splitLetters.forEach((letter) => {
    letter.addEventListener("mouseenter", () => {
      gsap.to(letter, {
        duration: 0.3,
        y: -10,
        color: "#666",
        scale: 1.1,
        ease: "power2.out",
      });
    });

    letter.addEventListener("mouseleave", () => {
      gsap.to(letter, {
        duration: 0.3,
        y: 0,
        color: "#000",
        scale: 1,
        ease: "power2.out",
      });
    });
  });
}

function initServiceSplitTextAnimation() {
  const serviceSplitTextElement = document.getElementById("serviceSplitText");
  const text = "SERVICES";

  serviceSplitTextElement.textContent = "";
  const letters = text.split("");

  letters.forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("service-split-letter");
    serviceSplitTextElement.appendChild(span);
  });

  const serviceSplitLetters = document.querySelectorAll(
    ".service-split-letter"
  );

  serviceSplitLetters.forEach((letter, index) => {
    gsap.set(letter, {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      rotationX: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#service",
        start: "top bottom-=10px",
        end: "top top+=10px",
        scrub: 0.5,
        toggleActions: "play reverse play reverse",
        markers: false,
      },
    });

    tl.to(
      letter,
      {
        duration: 1,
        y: 100,
        opacity: 0,
        rotationX: -90,
        filter: "blur(10px)",
        ease: "back.in(1.7)",
        delay: index * 0.1,
      },
      0
    );
  });

  serviceSplitLetters.forEach((letter) => {
    letter.addEventListener("mouseenter", () => {
      gsap.to(letter, {
        duration: 0.3,
        y: -10,
        color: "#ccc",
        scale: 1.1,
        ease: "power2.out",
      });
    });

    letter.addEventListener("mouseleave", () => {
      gsap.to(letter, {
        duration: 0.3,
        y: 0,
        color: "#fff",
        scale: 1,
        ease: "power2.out",
      });
    });
  });
}

function initHorizontalGallery() {
  const track = document.getElementById("galleryTrack");
  const items = track.querySelectorAll(".gallery-item");
  const itemWidth = items[0].offsetWidth;

  track.style.width = `${itemWidth * items.length}px`;

  const totalItems = items.length;
  const visibleItems = 4;
  const cycleDistance = itemWidth * (totalItems - visibleItems);

  const animation = gsap.to(track, {
    x: -cycleDistance,
    duration: 20,
    ease: "none",
    repeat: -1,
    onRepeat: function () {
      gsap.set(track, { x: 0 });
    },
  });

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (CONFIG.soundEnabled) {
        imageHoverSound.currentTime = 0;
        imageHoverSound.play().catch(() => {});
      }
    });
  });

  track.addEventListener("mouseenter", () => {
    animation.pause();
  });

  track.addEventListener("mouseleave", () => {
    animation.play();
  });

  let isReversed = false;
  const checkPosition = () => {
    const trackX = parseFloat(gsap.getProperty(track, "x"));
    const threshold = -cycleDistance * 0.8;

    if (trackX <= threshold && !isReversed) {
      animation.reverse();
      isReversed = true;
    } else if (trackX >= -100 && isReversed) {
      animation.play();
      isReversed = false;
    }
  };

  setInterval(checkPosition, 100);
}

function initFloatingPreview() {
  const floatingPreview = document.getElementById("floatingPreview");
  const workItems = document.querySelectorAll(".work-item");

  workItems.forEach((item) => {
    const imagePath = item.getAttribute("data-image");

    item.addEventListener("mouseenter", (e) => {
      floatingPreview.innerHTML = `<img src="${imagePath}" alt="${
        item.querySelector(".work-title").textContent
      }" />`;
      floatingPreview.classList.add("active");

      if (CONFIG.soundEnabled) {
        imageHoverSound.currentTime = 0;
        imageHoverSound.play().catch(() => {});
      }
    });

    item.addEventListener("mouseleave", () => {
      floatingPreview.classList.remove("active");
    });
  });

  document.addEventListener("mousemove", (e) => {
    gsap.to(floatingPreview, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out",
    });
  });
}

function initMagneticHover() {
  const serviceItems = document.querySelectorAll(".service-item");

  serviceItems.forEach((item) => {
    item.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) * 0.1;
      const deltaY = (y - centerY) * 0.1;

      gsap.to(this, {
        duration: 0.3,
        x: deltaX,
        y: deltaY,
        ease: "power2.out",
      });

      const rotateY = (x - centerX) / 20;
      const rotateX = -(y - centerY) / 20;

      gsap.to(this, {
        duration: 0.3,
        rotationY: rotateY,
        rotationX: rotateX,
        transformPerspective: 500,
        ease: "power2.out",
      });
    });

    item.addEventListener("mouseleave", function () {
      gsap.to(this, {
        duration: 0.5,
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
}

function initCursor() {
  const cursor = document.getElementById("cursorFollower");

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX - 20,
      y: e.clientY - 20,
      duration: 0.1,
      ease: "power2.out",
    });
  });
}

function updateNavbarColors() {
  const nav = document.getElementById("mainNav");
  const sections = document.querySelectorAll("section");
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  let currentSection = null;
  let minDistance = Infinity;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionBottom = sectionTop + rect.height;
    const sectionCenter = sectionTop + rect.height / 2;

    const distance = Math.abs(scrollPosition - sectionCenter);

    if (distance < minDistance) {
      minDistance = distance;
      currentSection = section;
    }
  });

  if (currentSection) {
    const isDarkSection =
      currentSection.classList.contains("about-black-section") ||
      currentSection.classList.contains("connect") ||
      currentSection.id === "interactiveSection" ||
      currentSection.id === "service";

    if (isDarkSection) {
      nav.classList.add("dark-mode");
    } else {
      nav.classList.remove("dark-mode");
    }
  }
}

window.addEventListener("scroll", updateNavbarColors);
window.addEventListener("resize", updateNavbarColors);
window.addEventListener("load", () => {
  updateNavbarColors();
  initSplitTextAnimation();
  initServiceSplitTextAnimation();
  initHorizontalGallery();
  initFloatingPreview();
  initMagneticHover();
  initCursor();
});
