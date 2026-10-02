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

const fallbackGalleryAlbums = {
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
let galleryAlbums = fallbackGalleryAlbums;
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
  if (!activeAlbum?.length) return;
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

const renderAlbums = albums => {
  galleryAlbums = albums;
  const names = Object.keys(galleryAlbums);
  albumControls.replaceChildren();
  if (!names.length) {
    galleryGrid.replaceChildren();
    return;
  }
  activeAlbumName = names[0];
  names.forEach(albumName => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gallery-album";
    button.dataset.album = albumName;
    button.textContent = `${albumName} (${galleryAlbums[albumName].length})`;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => renderAlbum(albumName));
    albumControls.append(button);
  });
  renderAlbum(activeAlbumName);
};

const NEWS_PAGE_SIZE = 3;
let newsOffset = 0;
let newsHasMore = false;
let newsHasPrevious = false;
let newsLoading = false;
let newsTotalCount = 0;

const renderNews = (items, append = false) => {
  const list = document.querySelector("#cms-news-list");
  const startIndex = append ? list.children.length : 0;
  const cards = items.map((item, offset) => {
    const index = startIndex + offset;
    const article = document.createElement("article");
    article.className = `news-card reveal visible${index ? ` delay-${Math.min(index, 3)}` : ""}`;
    const action = document.createElement("button");
    action.type = "button";
    action.className = "news-card-action";
    action.setAttribute("aria-label", `Buka berita: ${item.title}`);
    const thumb = document.createElement("div");
    const hasImage = typeof item.imageUrl === "string" && item.imageUrl.trim().length > 0;
    thumb.className = `news-thumb${hasImage ? "" : " news-thumb-empty"}`;
    if (hasImage) thumb.style.backgroundImage = `linear-gradient(180deg, transparent, rgba(0,0,0,.45)), url("${item.imageUrl}")`;
    const date = new Date(`${item.publishedAt || ""}T00:00:00`);
    const dateText = Number.isNaN(date.getTime()) ? (item.dateLabel || "") : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
    const dateBadge = document.createElement("span");
    dateBadge.textContent = dateText;
    thumb.append(dateBadge);
    const details = document.createElement("div");
    const dateSmall = document.createElement("small");
    dateSmall.textContent = dateText;
    const title = document.createElement("h3");
    title.textContent = item.title;
    details.append(dateSmall, title);
    if (item.excerpt) {
      const excerpt = document.createElement("p");
      excerpt.className = "news-excerpt";
      excerpt.textContent = item.excerpt;
      details.append(excerpt);
    }
    action.append(thumb, details);
    action.addEventListener("click", () => openNews(item));
    article.append(action);
    if (item.link) {
      const link = document.createElement("a");
      link.href = item.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "→";
      link.setAttribute("aria-label", `Baca ${item.title}`);
      link.className = "news-card-link";
      article.append(link);
    }
    return article;
  });
  if (append) list.append(...cards);
  else list.replaceChildren(...cards);
};

const newsLoadMore = document.querySelector("#news-load-more");
const newsPrevious = document.querySelector("#news-previous");
const newsPageIndicator = document.querySelector("#news-page-indicator");
const updateNewsLoadMore = () => {
  const totalPages = Math.max(1, Math.ceil(newsTotalCount / NEWS_PAGE_SIZE));
  const currentPage = Math.floor(newsOffset / NEWS_PAGE_SIZE) + 1;
  if (newsPageIndicator) {
    newsPageIndicator.hidden = totalPages <= 1;
    newsPageIndicator.textContent = `Halaman ${currentPage} dari ${totalPages}`;
  }
  if (newsLoadMore) {
    newsLoadMore.hidden = !newsHasMore;
    newsLoadMore.disabled = newsLoading;
    newsLoadMore.innerHTML = newsLoading ? 'Memuat berita...' : 'Berita berikutnya <span aria-hidden="true">→</span>';
  }
  if (newsPrevious) {
    newsPrevious.hidden = !newsHasPrevious;
    newsPrevious.disabled = newsLoading;
  }
};

const fetchNewsPage = offset => sanityQuery(
  `*[_type == "schoolNews" && defined(publishedAt)] | order(publishedAt desc)[${offset}...${offset + NEWS_PAGE_SIZE + 1}]{_id,title,publishedAt,excerpt,body,link,"imageUrl":image.asset->url}`
);

const navigateNews = async direction => {
  if (newsLoading || (direction > 0 && !newsHasMore) || (direction < 0 && !newsHasPrevious)) return;
  newsLoading = true;
  updateNewsLoadMore();
  try {
    const targetOffset = Math.max(0, newsOffset + direction * NEWS_PAGE_SIZE);
    const page = (await fetchNewsPage(targetOffset)) || [];
    const visibleItems = page.slice(0, NEWS_PAGE_SIZE);
    renderNews(visibleItems);
    newsOffset = targetOffset;
    newsHasPrevious = newsOffset > 0;
    newsHasMore = page.length > NEWS_PAGE_SIZE;
  } catch (error) {
    console.warn("Could not change school news page.", error);
  } finally {
    newsLoading = false;
    updateNewsLoadMore();
  }
};

newsLoadMore?.addEventListener("click", () => navigateNews(1));
newsPrevious?.addEventListener("click", () => navigateNews(-1));

const newsDialog = document.querySelector("#news-dialog");
const newsDialogClose = document.querySelector(".news-dialog-close");
const openNews = item => {
  const date = new Date(`${item.publishedAt || ""}T00:00:00`);
  const dateText = Number.isNaN(date.getTime()) ? (item.dateLabel || "") : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const image = newsDialog.querySelector(".news-dialog-image");
  const hasImage = typeof item.imageUrl === "string" && item.imageUrl.trim().length > 0;
  image.hidden = !hasImage;
  if (hasImage) image.src = item.imageUrl;
  else image.removeAttribute("src");
  image.alt = item.title || "";
  newsDialog.querySelector(".news-dialog-date").textContent = dateText;
  newsDialog.querySelector("#news-dialog-title").textContent = item.title || "Berita sekolah";

  const excerpt = newsDialog.querySelector(".news-dialog-excerpt");
  excerpt.hidden = !item.excerpt;
  excerpt.textContent = item.excerpt || "";
  const body = newsDialog.querySelector(".news-dialog-body");
  body.replaceChildren();
  if (item.body) {
    item.body.split(/\n\s*\n/).filter(Boolean).forEach(paragraph => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      body.append(element);
    });
  } else if (!item.excerpt) {
    const empty = document.createElement("p");
    empty.textContent = "Informasi selengkapnya belum ditambahkan.";
    body.append(empty);
  }

  const moreLink = newsDialog.querySelector(".news-dialog-link");
  moreLink.hidden = !item.link;
  moreLink.href = item.link || "#";
  newsDialog.showModal();
};

newsDialogClose.addEventListener("click", () => newsDialog.close());
newsDialog.addEventListener("click", event => {
  if (event.target === newsDialog) newsDialog.close();
});

const fallbackNews = [
  { title: "Hari Pendidikan Nasional di MI PKM Jaya Unpam", publishedAt: "2025-09-12", dateLabel: "12 September 2025" },
  { title: "Tim Basket Raih Juara 1 Tingkat Kota", publishedAt: "2025-09-05", dateLabel: "5 September 2025" },
  { title: "Workshop Pengembangan Diri untuk Siswa Kelas XII", publishedAt: "2025-08-28", dateLabel: "28 Agustus 2025" }
];

const renderAchievements = items => {
  const container = document.querySelector("#cms-achievements");
  container.replaceChildren(...items.map((item, index) => {
    const row = document.createElement("div");
    row.className = "achievement";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const description = document.createElement("small");
    description.textContent = [item.award, item.level, item.year].filter(Boolean).join(" · ");
    details.append(title, description);
    const icon = document.createElement("b");
    icon.textContent = item.icon || "★";
    row.append(number, details, icon);
    return row;
  }));
};

const fallbackAchievements = [
  { title: "Olimpiade Matematika", award: "Juara 1", level: "Tingkat Kota", icon: "🥇" },
  { title: "Lomba Debat Bahasa", award: "Juara 2", level: "Tingkat Provinsi", icon: "🥈" },
  { title: "Kompetisi Sains Nasional", award: "Juara 3", level: "Bidang Biologi", icon: "🥉" }
];

const sanityQuery = async query => {
  const config = window.SCHOOL_CMS || {};
  if (!/^[a-z0-9]{5,}$/i.test(config.projectId || "") || config.projectId.startsWith("YOUR_")) return null;
  const endpoint = `https://${config.projectId}.api.sanity.io/v${config.apiVersion || "2025-01-01"}/data/query/${encodeURIComponent(config.dataset || "production")}?query=${encodeURIComponent(query)}`;
  const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`CMS request failed (${response.status})`);
  const payload = await response.json();
  return payload.result ?? [];
};

const loadCmsContent = async () => {
  newsTotalCount = fallbackNews.length;
  renderNews(fallbackNews);
  renderAchievements(fallbackAchievements);
  renderAlbums(fallbackGalleryAlbums);
  try {
    const [newsPage, newsCount, achievements, albums] = await Promise.all([
      fetchNewsPage(0),
      sanityQuery('count(*[_type == "schoolNews" && defined(publishedAt)])'),
      sanityQuery('*[_type == "schoolAchievement"] | order(order asc)[0...6]{_id,title,award,level,year,icon}'),
      sanityQuery('*[_type == "schoolAlbum"] | order(order asc){_id,title,"photos":photos[]{caption,"imageUrl":image.asset->url}}')
    ]);
    if (typeof newsCount === "number") newsTotalCount = newsCount;
    if (newsPage?.length) {
      const initialNews = newsPage.slice(0, NEWS_PAGE_SIZE);
      renderNews(initialNews);
      newsOffset = 0;
      newsHasPrevious = false;
      newsHasMore = newsPage.length > NEWS_PAGE_SIZE;
      updateNewsLoadMore();
    } else {
      newsTotalCount = 0;
      newsHasMore = false;
      updateNewsLoadMore();
    }
    if (achievements?.length) renderAchievements(achievements);
    if (albums?.length) {
      const mappedAlbums = Object.fromEntries(albums.map(album => [album.title, (album.photos || []).filter(photo => photo.imageUrl).map(photo => ({ image: photo.imageUrl, caption: photo.caption || album.title }))]));
      const nonEmptyAlbums = Object.fromEntries(Object.entries(mappedAlbums).filter(([, photos]) => photos.length));
      if (Object.keys(nonEmptyAlbums).length) renderAlbums(nonEmptyAlbums);
    }
  } catch (error) {
    console.warn("CMS unavailable; showing the built-in sample content.", error);
  }
};

renderAlbums(fallbackGalleryAlbums);
loadCmsContent();

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
