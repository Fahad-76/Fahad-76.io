// Sticky nav active link highlight (IntersectionObserver)
const navLinks = document.querySelectorAll(".nav-link");

// Make sure these IDs exist on your sections
const sections = ["intro", "education", "projects", "skills", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => {
    const isMatch = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", isMatch);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    // Pick the most visible section
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) setActive(visible.target.id);
  },
  {
    root: null,
    threshold: [0.2, 0.35, 0.5, 0.65],
  }
);

sections.forEach((sec) => observer.observe(sec));

// Fallback: set initial active state
if (sections.length) setActive(sections[0].id);
