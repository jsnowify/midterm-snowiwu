gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  scrambleDuration: 600,
  frameRate: 30,
  binaryChars: "01",
  letterChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  soundEnabled: false, // start OFF
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

// ===== SOUND TOGGLE + TIME DISPLAY =====
const soundToggle = document.getElementById("soundToggle");
const soundText = document.querySelector(".sound-text");
const timeDisplay = document.getElementById("timeDisplay");

soundText.textContent = "Sound: OFF";

soundToggle.addEventListener("click", () => {
  CONFIG.soundEnabled = !CONFIG.soundEnabled;
  soundText.textContent = `Sound: ${CONFIG.soundEnabled ? "ON" : "OFF"}`;
  soundToggle.classList.toggle("active", CONFIG.soundEnabled);

  if (CONFIG.soundEnabled) {
    mainMusic
      .play()
      .catch((err) =>
        console.warn("Autoplay blocked until user interacts:", err)
      );
  } else {
    stopMusic(true); // true = fully stop
  }
});

// ===== STOP OR PAUSE MUSIC SAFELY =====
function stopMusic(fullStop = false) {
  mainMusic.pause();
  if (fullStop) mainMusic.currentTime = 0;
}

// ===== AUTO-PAUSE / RESUME LOGIC =====
document.addEventListener("visibilitychange", () => {
  if (!CONFIG.soundEnabled) return;

  if (document.hidden) {
    // Pause when tab is hidden
    mainMusic.pause();
  } else {
    // Resume when tab is visible again
    mainMusic.play().catch(() => {});
  }
});

window.addEventListener("blur", () => {
  if (CONFIG.soundEnabled) mainMusic.pause();
});

window.addEventListener("focus", () => {
  if (CONFIG.soundEnabled) mainMusic.play().catch(() => {});
});

// ===== TIME DISPLAY FUNCTION =====
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateTime, 1000);
updateTime();

// ===== SCRAMBLE EFFECT =====
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

gsap.utils.toArray("section").forEach((section) => {
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

document.addEventListener("DOMContentLoaded", function () {
  const splitTextElement = document.getElementById("splitText");
  const text = splitTextElement.textContent;

  splitTextElement.textContent = "";

  const letters = text.split("");
  letters.forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.classList.add("split-letter");
    splitTextElement.appendChild(span);
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  tl.to(".split-letter", {
    duration: 0.8,
    rotationX: 0,
    opacity: 1,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });
});
