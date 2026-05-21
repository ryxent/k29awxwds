document.addEventListener("DOMContentLoaded", () => {
  gsap.to("#pageloadbar", {
    width: "60%",
    duration: 3,
    ease: "power1.out",
  });

  window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to("#pageloadbar", {
      width: "100%",
      duration: 0.4,
    })
      .to("#pageloadcontainer", {
        opacity: 0,
        duration: 0.3,
      })
      .set("#pageloadcontainer", { display: "none" });
  });
});

const cursor = document.getElementById("cursorcontainer");

if (cursor) {
  let mouseX = 0,
    mouseY = 0;
  let ballX = 0,
    ballY = 0;
  const speed = 0.1;
  const padding = 150;

  document.addEventListener("mousemove", (e) => {
    mouseX = Math.max(
      padding,
      Math.min(e.clientX, window.innerWidth - padding),
    );
    mouseY = Math.max(
      padding,
      Math.min(e.clientY, window.innerHeight - padding),
    );
    const hoveredElement = e.target;

    if (hoveredElement) {
      const computedCursor = window.getComputedStyle(hoveredElement).cursor;

      if (computedCursor === "pointer") {
        cursor.classList.add("hovering");
      } else {
        cursor.classList.remove("hovering");
      }
    }
  });

  function animate() {
    let distX = mouseX - ballX;
    let distY = mouseY - ballY;

    ballX += distX * speed;
    ballY += distY * speed;

    cursor.style.transform = `translate3d(calc(${ballX}px - 50%), calc(${ballY}px - 50%), 0)`;

    requestAnimationFrame(animate);
  }

  animate();
}

const app = document.getElementById("app");
let currentY = 0;

window.addEventListener(
  "wheel",
  (e) => {
    const isAtTop = window.scrollY === 0;
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

    if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
      currentY -= e.deltaY * 0.2;
      currentY = Math.max(Math.min(currentY, 70), -70);

      gsap.to(app, {
        y: currentY,
        duration: 0.1,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(app, {
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            onStart: () => {
              currentY = 0;
            },
          });
        },
      });
    }
  },
  { passive: true },
);

const track = document.getElementById("track");
const slides = document.querySelectorAll(".slide");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let index = 0;
let startX = 0;
let autoPlay = setInterval(moveNext, 4000);

function updateSlide() {
  if (track) {
    if (index === 0) {
      track.style.transform = `translateX(0%)`;
    } else {
      track.style.transform = `translateX(calc(-${index * 100}% - ${index * 0}px))`;
    }
  }
}

function moveNext() {
  index = (index + 1) % slides.length;
  updateSlide();
}

function movePrev() {
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
}

nextBtn?.addEventListener("click", () => {
  moveNext();
  resetTimer();
});

prevBtn?.addEventListener("click", () => {
  movePrev();
  resetTimer();
});

track?.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
track?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) moveNext();
  else if (endX - startX > 50) movePrev();
  resetTimer();
});

function resetTimer() {
  clearInterval(autoPlay);
  autoPlay = setInterval(moveNext, 4000);
}
