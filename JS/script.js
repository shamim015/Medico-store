const products = {
  newProducts: [
    {
      name: "Foley Catheter",
      price: "$12.90",
      old: "$24.78",
      img: "assets/product-catheter.png",
    },
    {
      name: "Thermometer",
      price: "$8.98",
      old: "$24.78",
      img: "assets/product-thermometer.png",
    },
    {
      name: "Non-rebreather mask",
      price: "$3.32",
      old: "$24.78",
      img: "assets/product-mask.png",
    },
    {
      name: "Wound Dressing",
      price: "$24.78",
      old: "$24.78",
      img: "assets/product-dressing.png",
    },
  ],
  popularProducts: [
    {
      name: "Oxygen Mask",
      price: "$2.00",
      old: "$24.78",
      img: "assets/product-oxygen-mask.png",
    },
    {
      name: "Surgical Gloves",
      price: "$1.99",
      old: "$24.78",
      img: "assets/product-gloves.png",
    },
    {
      name: "Medical Mask",
      price: "$0.89",
      old: "$24.78",
      img: "assets/product-medical-mask.png",
    },
    {
      name: "Hand Sanitizer",
      price: "$4.00",
      old: "$24.78",
      img: "assets/product-sanitizer.png",
    },
  ],
  topProducts: [
    {
      name: "Hospital Bed",
      price: "$109.89",
      old: "$24.78",
      img: "assets/product-bed.png",
    },
    {
      name: "Walker Mobility",
      price: "$12.80",
      old: "$24.78",
      img: "assets/product-walker.png",
    },
    {
      name: "Wheelchair",
      price: "$30.00",
      old: "$24.78",
      img: "assets/product-wheelchair.png",
    },
    {
      name: "Crutches",
      price: "$24.78",
      old: "$24.78",
      img: "assets/product-crutches.png",
    },
  ],
  medicalProducts: [
    {
      name: "Sphygmomanometer",
      price: "$15.09",
      old: "$24.78",
      img: "assets/product-bp.png",
    },
    {
      name: "Digital Stethoscope",
      price: "$29.99",
      old: "$24.78",
      img: "assets/product-stethoscope.png",
    },
    {
      name: "Glucometer",
      price: "$12.08",
      old: "$24.78",
      img: "assets/product-glucometer.png",
    },
    {
      name: "Pulse Oximeter",
      price: "$30.00",
      old: "$24.78",
      img: "assets/product-oximeter.png",
    },
  ],
  upcomingProducts: [
    {
      name: "Wound Dressing",
      price: "$5.78",
      old: "$24.78",
      img: "assets/product-dressing.png",
    },
    {
      name: "IV Catheter",
      price: "$2.00",
      old: "$24.78",
      img: "assets/product-iv-catheter.png",
    },
    {
      name: "Blood Pressure Cuff",
      price: "$24.78",
      old: "$24.78",
      img: "assets/product-bp-cuff.png",
    },
    {
      name: "Chest Tube",
      price: "$58.56",
      old: "$24.78",
      img: "assets/product-chest-tube.png",
    },
  ],
};

let cart = JSON.parse(localStorage.getItem("healthyCart") || "[]");
// remove duplicates already saved from before
cart = cart.filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i);
let wishlist = JSON.parse(localStorage.getItem("healthyWishlist") || "[]");
const inWishlist = (p) => wishlist.some((w) => w.name === p.name);
const heartSvg = `<svg viewBox="0 0 24 24"><path d="M20.8 8.8C20.8 5.8 18.5 4 16 4c-1.5 0-3 .8-4 2-1-1.2-2.5-2-4-2-2.5 0-4.8 1.8-4.8 4.8C3.2 13.5 8.2 16.5 12 20c3.8-3.5 8.8-6.5 8.8-11.2z"/></svg>`;

function card(p, index) {
  return `<article class="product-card">
    <button class="wish-heart${inWishlist(p) ? " active" : ""}" data-wish='${JSON.stringify(p).replace(/'/g, "&#39;")}' aria-label="Add to wishlist">${heartSvg}</button>
    <div class="product-image"><img src="${p.img}" alt="${p.name}"></div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="price-line"><span class="price">${p.price}</span><span class="price old">${p.old}</span></div>
    </div>
    <button class="add" data-product='${JSON.stringify(p).replace(/'/g, "&#39;")}'>Add to Cart <svg class="bag-icon" viewBox="0 0 24 24"><path d="M6 7h12l1 13.5a2 2 0 0 1-2 2.1H7a2 2 0 0 1-2-2.1L6 7Z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/></svg></button>
  </article>`;
}
function render(id, list) {
  document.getElementById(id).innerHTML = list
    .map((p, i) => card(p, i))
    .join("");
}
Object.entries(products).forEach(([id, list]) => render(id, list));

function save() {
  localStorage.setItem("healthyCart", JSON.stringify(cart));
  updateCart();
}
function updateCart() {
  document.getElementById("cartCount").textContent = cart.length;
  const mobileBadge = document.getElementById("cartCountMobile");
  if (mobileBadge) mobileBadge.textContent = cart.length;
  document.getElementById("cartItems").innerHTML = cart.length
    ? cart
        .map(
          (p, i) => `
    <div class="cart-item"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><p>${p.price}</p><button class="remove" data-remove="${i}">Remove</button></div></div>
  `,
        )
        .join("")
    : `<p style="color:#777;text-align:center;padding:30px 0">Your cart is empty.</p>`;
  const total = cart.reduce(
    (sum, p) => sum + parseFloat(p.price.replace("$", "")),
    0,
  );
  document.getElementById("cartTotal").textContent = "$" + total.toFixed(2);
}
function saveWishlist() {
  localStorage.setItem("healthyWishlist", JSON.stringify(wishlist));
  updateWishlist();
}
function updateWishlist() {
  const badge = document.getElementById("wishCount");
  badge.textContent = wishlist.length;
  badge.style.display = wishlist.length ? "flex" : "none";
  document.querySelectorAll(".wish-heart").forEach((btn) => {
    const p = JSON.parse(btn.dataset.wish.replace(/&#39;/g, "'"));
    btn.classList.toggle("active", inWishlist(p));
  });
  document.getElementById("wishItems").innerHTML = wishlist.length
    ? wishlist
        .map(
          (p, i) => `
    <div class="cart-item"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><p>${p.price}</p>
    <button class="wish-add" data-product='${JSON.stringify(p).replace(/'/g, "&#39;")}'>Add to Cart</button>
    <button class="remove" data-wish-remove="${i}">Remove</button></div></div>
  `,
        )
        .join("")
    : `<p style="color:#777;text-align:center;padding:30px 0">Your wishlist is empty.</p>`;
}
function openWishlist() {
  document.getElementById("wishPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeWishlist() {
  document.getElementById("wishPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1700);
}
function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

document.addEventListener("click", (e) => {
  const heart = e.target.closest("[data-wish]");
  if (heart) {
    const p = JSON.parse(heart.dataset.wish.replace(/&#39;/g, "'"));
    if (inWishlist(p)) {
      wishlist = wishlist.filter((w) => w.name !== p.name);
      toast(`${p.name} removed from wishlist`);
    } else {
      wishlist.push(p);
      toast(`${p.name} added to wishlist`);
    }
    saveWishlist();
    return;
  }
  const wrem = e.target.closest("[data-wish-remove]");
  if (wrem) {
    wishlist.splice(+wrem.dataset.wishRemove, 1);
    saveWishlist();
    return;
  }
  const add = e.target.closest("[data-product]");
  if (add) {
    const p = JSON.parse(add.dataset.product.replace(/&#39;/g, "'"));
    if (cart.some((c) => c.name === p.name)) {
      toast(`${p.name} is already in your cart`);
      return;
    }
    cart.push(p);
    save();
    toast(`${p.name} added to cart`);
    return;
  }
  const rem = e.target.closest("[data-remove]");
  if (rem) {
    cart.splice(+rem.dataset.remove, 1);
    save();
    return;
  }
});
// ===== Mobile drawer (hamburger menu) =====
const mobileDrawer = document.getElementById("mobileDrawer");
function openMenu() {
  mobileDrawer.classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeMenu() {
  mobileDrawer.classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}
document.getElementById("menuToggle").onclick = openMenu;
document.getElementById("closeMenu").onclick = closeMenu;
mobileDrawer.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", closeMenu);
});

// ===== Cart & overlay =====
document.getElementById("cartButton").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("wishlistButton").onclick = openWishlist;
document.getElementById("closeWish").onclick = closeWishlist;
document.getElementById("overlay").onclick = () => {
  closeCart();
  closeWishlist();
  closeMenu();
};

// ===== Mobile bottom navigation =====
document.getElementById("mobileHome").onclick = (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
document.getElementById("mobileSearch").onclick = (e) => {
  e.preventDefault();
  document.getElementById("searchInput").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
document.getElementById("mobileCart").onclick = (e) => {
  e.preventDefault();
  openCart();
};
document.getElementById("mobileAccount").onclick = (e) => {
  e.preventDefault();
  toast("Account page coming soon");
};
document.getElementById("checkout").onclick = () =>
  toast(
    cart.length
      ? "Order button is ready to connect to checkout."
      : "Your cart is empty.",
  );
document.getElementById("startShopping").onclick = () =>
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
document.getElementById("orderNow").onclick = () =>
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });

function search() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) {
    toast("Search for a medicine or medical product");
    return;
  }
  const all = Object.values(products).flat();
  const found = all.filter((p) => p.name.toLowerCase().includes(q));
  document.getElementById("newProducts").innerHTML = found.length
    ? found.map((p, i) => card(p, i)).join("")
    : `<p style="grid-column:1/-1;text-align:center;color:#777;padding:50px">No matching product found.</p>`;
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}
document.getElementById("searchButton").onclick = search;
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});
document.getElementById("allCategories").onclick = () =>
  toast("Choose a category from the navigation bar");

updateCart();
updateWishlist();


/* ===== Medico Store — Animations (load AFTER script.js) ===== */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Loader ----
  const loader = document.getElementById("pageLoader");
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    root.classList.add("ready");
    if (loader) {
      loader.classList.add("done");
      setTimeout(() => loader.remove(), 700);
    }
  };
  const minWait = new Promise((r) => setTimeout(r, 700));
  const loaded = new Promise((r) =>
    document.readyState === "complete" ? r() : addEventListener("load", r)
  );
  Promise.all([minWait, loaded]).then(start);
  setTimeout(start, 3500); // safety

  // ---- Scroll reveal ----
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        el.classList.add("in");
        if (el.dataset.count) countUp(el);
        // clean up so original hover transitions come back
        setTimeout(() => {
          el.classList.remove("reveal", "in");
          el.style.removeProperty("--d");
        }, 1100 + parseInt(el.style.getPropertyValue("--d") || 0));
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  function reveal(el, i = 0, type = "") {
    if (!el || el.classList.contains("reveal")) return;
    el.classList.add("reveal");
    if (type) el.dataset.r = type;
    el.style.setProperty("--d", i * 100 + "ms");
    io.observe(el);
  }
  const group = (sel, type = "", perRow = 4) =>
    $(sel).forEach((el, i) => reveal(el, i % perRow, type));

  group(".section-title");
  group(".offer-card");
  group(".big-offer", "left");
  group(".mini-offer", "right", 2);
  group(".stat");
  reveal($(".hot-copy")[0], 0, "left");
  reveal($(".hot-art")[0], 1, "right");
  reveal($(".news > h2")[0]);
  reveal($(".news-main")[0], 0, "left");
  group(".news-row", "right", 3);
  group(".footer-col", "", 5);

  // product cards (also re-rendered by search)
  $(".product-grid").forEach((grid) => {
    $(".product-card", grid).forEach((c, i) => reveal(c, i % 4));
    new MutationObserver(() =>
      $(".product-card", grid).forEach((c, i) => reveal(c, i % 4))
    ).observe(grid, { childList: true });
  });

  // ---- Counter (14K+, 250+ ...) ----
  $(".stat strong").forEach((s) => {
    const m = s.textContent.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    s.dataset.target = m[1];
    s.dataset.suffix = m[2];
    s.textContent = "0" + m[2];
    s.closest(".stat").dataset.count = "1";
  });
  function countUp(stat) {
    const s = $("strong", stat)[0];
    if (!s || !s.dataset.target) return;
    const end = parseFloat(s.dataset.target), dur = 1800, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      s.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + s.dataset.suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---- Navbar shadow, progress bar, back-to-top ----
  const nav = $(".navbar")[0], bar = document.getElementById("scrollProgress"),
    top = document.getElementById("toTop");
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, h = root.scrollHeight - innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    nav && nav.classList.toggle("scrolled", y > 10);
    top && top.classList.toggle("show", y > 500);
    ticking = false;
  };
  addEventListener("scroll", () => !ticking && (ticking = true, requestAnimationFrame(onScroll)), { passive: true });
  top && (top.onclick = () => scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();

  // ---- Cart badge bump ----
  ["cartCount", "cartCountMobile"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    }).observe(el, { childList: true, characterData: true, subtree: true });
  });

  // ---- Button ripple ----
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".add,.hero-button,.checkout,.hot-copy button");
    if (!b || reduce) return;
    b.classList.add("ripple-host");
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });
})();

// ===== Mobile: search icon toggle =====
(() => {
  const nav = document.querySelector(".navbar");
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchToggle");
  if (!nav || !input || !btn) return;
  const open = () => { nav.classList.add("search-open"); setTimeout(() => input.focus(), 60); };
  const close = () => nav.classList.remove("search-open");
  btn.onclick = () => (nav.classList.contains("search-open") ? close() : open());
  document.getElementById("mobileSearch").onclick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    open();
  };
  document.getElementById("searchButton").addEventListener("click", () => { if (input.value.trim()) close(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || (e.key === "Enter" && input.value.trim())) close();
  });
})();
