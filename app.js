/* ===== PROJECT DATA for modal pop-ups ===== */
/* Each object maps to a card via data-id="0", "1", "2", "3" */
const projects = [
  {
    title: "School Bus Management System",
    desc: "A real-time attendance system for school buses. As Project Leader of a four-person team, I chose pure Java Servlet/JSP with JDBC to deeply understand the HTTP request lifecycle and Session/Cookie management. The system handles live check-ins and last-minute student absence requests.",
    tech: "Java, Servlet/JSP, JDBC, MySQL",
    role: "Role: Project Leader"
  },
  {
    title: "Flipped Learning Platform",
    desc: "An e-learning platform where I designed the database (~30 tables) and the system architecture. My technical highlights: a custom auto-save mechanism that stores quiz progress after every question (so users never lose data on network drops), and Server-Sent Events (SSE) for real-time notifications.",
    tech: "Java, Spring Boot, SQL Server, SSE",
    role: "Role: Database Designer & Backend Developer"
  },
  {
    title: "FPTU Forum",
    desc: "A community forum built for FPTU students. Members can post and comment; moderators review flagged content; admins manage topics, users and view site statistics. The project taught me how to design role-based access control cleanly.",
    tech: "HTML, CSS, JavaScript, Java, SQL",
    role: "Role: Full-stack Developer"
  },
  {
    title: "Personal Portfolio Website",
    desc: "This very site! A responsive, accessible single-page portfolio built with vanilla HTML, CSS and JavaScript — no frameworks. Features include category filtering, an animated skills section, a keyboard-friendly modal and client-side form validation.",
    tech: "HTML5, CSS3, Vanilla JavaScript, Git",
    role: "Role: Solo Developer & Designer"
  }
];

/* ===================================================================
   1. HAMBURGER MENU TOGGLE
   Opens and closes the mobile nav when the hamburger button is clicked.
   Also closes the menu when a nav link is clicked (good UX on mobile).
=================================================================== */
const hamburger = document.getElementById("hamburger");
const navMenu   = document.getElementById("navMenu");
const nav       = hamburger.nextElementSibling; // the <nav> element

hamburger.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");         // toggle CSS class
  hamburger.classList.toggle("open", isOpen);          // animate burger → X
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

// Close menu when any nav link is clicked (smooth scroll + close)
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ===================================================================
   2. TYPING EFFECT in the Hero section
   Cycles through an array of role strings, typing and deleting each one.
=================================================================== */
const roles      = ["Java Intern Student", "Backend Developer", "Problem Solver", "SQL Enthusiast"];
const typingEl   = document.getElementById("typingText");
let roleIndex    = 0;   // which role we are currently typing
let charIndex    = 0;   // current character position
let isDeleting   = false;

function typeRole() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove one character at a time
    typingEl.textContent = currentRole.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character at a time
    typingEl.textContent = currentRole.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;   // delete faster than typing

  if (!isDeleting && charIndex === currentRole.length) {
    // Finished typing — pause then start deleting
    delay = 1600;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next role
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}
typeRole(); // start the effect immediately

/* ===================================================================
   3. PROJECT FILTER BUTTONS
   Shows/hides cards based on data-category attribute.
=================================================================== */
const filterButtons = document.querySelectorAll(".filter");
const cards         = document.querySelectorAll(".card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;

    // Update active state on filter buttons
    filterButtons.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    // Show cards that match the selected category; hide others
    cards.forEach(card => {
      card.hidden = !(type === "all" || card.dataset.category === type);
    });
  });
});

/* ===================================================================
   4. PROJECT DETAIL MODAL
   Opens when a card is clicked or activated with Enter/Space.
   Closes with the close button, clicking the backdrop, or pressing Esc.
   Focus management: focus moves into the modal, then returns on close.
=================================================================== */
const modal      = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
let lastFocused  = null; // remember which card opened the modal

function openModal(card) {
  const data = projects[card.dataset.id];

  // Fill in modal content
  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalDesc").textContent  = data.desc;
  document.getElementById("modalTech").textContent  = data.tech;
  document.getElementById("modalRole").textContent  = data.role;

  lastFocused    = card;
  modal.hidden   = false;
  modal.setAttribute("aria-hidden", "false");
  modalClose.focus(); // move keyboard focus into the modal
}

function closeModal() {
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus(); // return focus to the triggering card
}

// Open on click or keyboard (Enter / Space)
cards.forEach(card => {
  card.addEventListener("click", () => openModal(card));
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalClose.addEventListener("click", closeModal);

// Click outside the modal box (on the dark backdrop) to close
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// Press Esc to close
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* ===================================================================
   5. SKILL BARS — animated on scroll
   IntersectionObserver watches each .fill element.
   When it scrolls into view, set its width to the data-level percentage.
   unobserve() ensures the animation only plays once.
=================================================================== */
const fills    = document.querySelectorAll(".fill");
const skillObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.level + "%";
      obs.unobserve(entry.target); // run animation only once
    }
  });
}, { threshold: 0.4 });

fills.forEach(f => skillObs.observe(f));

/* ===================================================================
   6. CONTACT FORM VALIDATION
   All fields are checked on submit.
   setError() shows/hides error messages and marks fields as invalid.
   On success, show a confirmation message and reset the form.
=================================================================== */
const form   = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

// Show an error message below a field, or clear it if msg is empty
function setError(id, msg) {
  const errorEl = document.getElementById(id + "Error");
  const inputEl = document.getElementById(id);
  errorEl.textContent = msg;
  inputEl.classList.toggle("invalid", msg !== "");
}

form.addEventListener("submit", e => {
  e.preventDefault(); // prevent real submission (UI only, no backend)
  status.textContent = "";

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Simple email format check using regex
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate each field and show the appropriate error
  setError("name",    name.length < 2    ? "Please enter your full name (at least 2 characters)."         : "");
  setError("email",   !emailOk           ? "Please enter a valid email address, e.g. name@gmail.com."     : "");
  setError("message", message.length < 10? "Your message must be at least 10 characters long."            : "");

  // If all fields are valid, show success message and reset
  if (name.length >= 2 && emailOk && message.length >= 10) {
    status.textContent = "✅ Message received! Thank you for reaching out.";
    form.reset();
    // Clear all invalid styles after reset
    ["name", "email", "message"].forEach(id => setError(id, ""));
  }
});
