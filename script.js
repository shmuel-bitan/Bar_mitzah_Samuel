const body = document.body;
const experience = document.getElementById("experience");
const openButton = document.getElementById("openButton");
const replayButton = document.getElementById("replayButton");
const rsvpButton = document.getElementById("rsvpButton");
const invitationView = document.getElementById("invitationView");
const guestName = document.getElementById("guestName");
const particles = document.getElementById("particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let timers = [];
let isAnimating = false;

function schedule(callback, delay) {
  const timer = window.setTimeout(callback, delay);
  timers.push(timer);
}

function clearTimers() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers = [];
}

function personalizeEnvelope() {
  const params = new URLSearchParams(window.location.search);
  const guest = (params.get("guest") || "").trim().slice(0, 52);

  if (guest) {
    guestName.textContent = guest;
    document.title = `Invitation pour ${guest} · Bar-Mitsva de Samuel`;
  }
}

function createParticles() {
  particles.replaceChildren();
  const particleCount = 14;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const angle = (Math.PI * 2 * index) / particleCount + Math.random() * .3;
    const distance = 90 + Math.random() * 220;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 50;

    particle.className = "particle";
    particle.style.setProperty("--x", `${x.toFixed(1)}px`);
    particle.style.setProperty("--y", `${y.toFixed(1)}px`);
    particle.style.setProperty("--size", `${2 + Math.random() * 6}px`);
    particle.style.setProperty("--duration", `${1.15 + Math.random() * .8}s`);
    particle.style.setProperty("--delay", `${.2 + Math.random() * .45}s`);
    particles.appendChild(particle);
  }
}

function revealInvitation() {
  body.classList.add("is-revealed");
  invitationView.setAttribute("aria-hidden", "false");
  schedule(() => {
    rsvpButton.focus({ preventScroll: true });
    isAnimating = false;
  }, reducedMotion.matches ? 20 : 820);
}

function openInvitation() {
  if (isAnimating || body.classList.contains("is-revealed")) return;

  isAnimating = true;
  openButton.disabled = true;
  createParticles();
  body.classList.add("is-opening");

  if (reducedMotion.matches) {
    revealInvitation();
    return;
  }

  schedule(revealInvitation, 2920);
}

function replayInvitation() {
  clearTimers();
  body.classList.remove("is-revealed", "is-opening");
  invitationView.setAttribute("aria-hidden", "true");
  particles.replaceChildren();
  openButton.disabled = false;
  isAnimating = false;
  schedule(() => openButton.focus({ preventScroll: true }), 100);
}

openButton.addEventListener("click", openInvitation);
replayButton.addEventListener("click", replayInvitation);

experience.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && body.classList.contains("is-revealed")) {
    replayInvitation();
  }
});

personalizeEnvelope();
