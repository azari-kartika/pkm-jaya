const loader = document.querySelector(".page-loader");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

document.addEventListener("DOMContentLoaded", () => {
  loader?.classList.add("hidden");
});

menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const galleryAlbums = {
  "Kegiatan kelas": [
    { image: "assets/mi-al-hidayah-google-maps-photo.jpg", caption: "Kegiatan kelas" },
    { image: "assets/mi-al-hidayah-google-maps-photo-3.jpg", caption: "Kegiatan kelas" },
    { image: "assets/mi-al-hidayah-google-maps-photo-5.jpg", caption: "Kegiatan kelas" }
  ],
  "Sholat berjamaah": [
    { image: "assets/mi-al-hidayah-google-maps-photo-2.jpg", caption: "Sholat berjamaah" }
  ],
  "Olahraga": [
    { image: "assets/mi-al-hidayah-google-maps-photo-4.jpg", caption: "Olahraga" }
  ]
};
const albumControls = document.querySelector(".gallery-albums");
const galleryGrid = document.querySelector(".gallery-grid");
let activeAlbumName = Object.keys(galleryAlbums)[0];
let activeAlbum = galleryAlbums[activeAlbumName];
const lightbox = document.querySelector(".gallery-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
let activeGalleryIndex = 0;
let lastFocusedGalleryItem = null;

const showGalleryImage = index => {
  activeGalleryIndex = (index + activeAlbum.length) % activeAlbum.length;
  const item = activeAlbum[activeGalleryIndex];
  lightboxImage.src = item.image;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = `${activeAlbumName} · ${activeGalleryIndex + 1}/${activeAlbum.length}`;
};

const renderAlbum = albumName => {
  activeAlbumName = albumName;
  activeAlbum = galleryAlbums[albumName];
  albumControls.querySelectorAll("button").forEach(button => {
    const selected = button.dataset.album === albumName;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  galleryGrid.replaceChildren(...activeAlbum.map((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-item reveal visible";
    button.style.backgroundImage = `linear-gradient(180deg, transparent 45%, rgba(0, 50, 40, .45)), url("${item.image}")`;
    button.setAttribute("aria-label", `Perbesar foto ${index + 1}: ${albumName}`);
    const label = document.createElement("span");
    label.textContent = albumName;
    button.append(label);
    button.addEventListener("click", () => {
      lastFocusedGalleryItem = button;
      showGalleryImage(index);
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("gallery-open");
      lightboxClose.focus();
    });
    return button;
  }));
};

Object.keys(galleryAlbums).forEach(albumName => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gallery-album";
  button.dataset.album = albumName;
  button.textContent = `${albumName} (${galleryAlbums[albumName].length})`;
  button.addEventListener("click", () => renderAlbum(albumName));
  albumControls.append(button);
});
renderAlbum(activeAlbumName);

const closeGallery = () => {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-open");
  lastFocusedGalleryItem?.focus();
};

lightboxClose.addEventListener("click", closeGallery);
document.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
document.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeGallery();
});
document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll('.main-nav a:not(.nav-cta)')];

const updateActiveNav = () => {
  const y = window.scrollY + 130;
  let current = "home";
  sections.forEach(section => {
    if (y >= section.offsetTop) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

// Smooth fallback for internal links.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const id = anchor.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
