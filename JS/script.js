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
// remove duplicates already saved from before, make sure every item has a quantity
cart = cart
  .filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i)
  .map((p) => ({ ...p, qty: p.qty || 1 }));

// ===== Cart settings (change these to match your store) =====
const FREE_DELIVERY_MIN = 50; // free delivery above this amount
const DELIVERY_FEE = 4.99;
const PROMO_CODES = { MEDICO10: 10, HEALTH25: 25 }; // code -> % off
const MAX_QTY = 10;
const money = (n) => "$" + n.toFixed(2);
const priceOf = (p) => parseFloat(String(p.price).replace("$", "")) || 0;
let promo = localStorage.getItem("healthyPromo") || "";
if (!PROMO_CODES[promo]) promo = "";
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
function cartTotals() {
  const subtotal = cart.reduce((sum, p) => sum + priceOf(p) * p.qty, 0);
  const pct = PROMO_CODES[promo] || 0;
  const discount = (subtotal * pct) / 100;
  const after = subtotal - discount;
  const delivery = !cart.length || after >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  return { subtotal, pct, discount, after, delivery, total: after + delivery };
}
function updateCart() {
  const count = cart.reduce((n, p) => n + p.qty, 0);
  document.getElementById("cartCount").textContent = count;
  const mobileBadge = document.getElementById("cartCountMobile");
  if (mobileBadge) mobileBadge.textContent = count;
  document.getElementById("cartHeadCount").textContent = count
    ? `(${count} ${count === 1 ? "item" : "items"})`
    : "";

  const t = cartTotals();

  // free-delivery progress
  const ship = document.getElementById("shipBar");
  if (!cart.length) {
    ship.style.display = "none";
  } else {
    ship.style.display = "block";
    const left = FREE_DELIVERY_MIN - t.after;
    const w = Math.min(100, (t.after / FREE_DELIVERY_MIN) * 100);
    ship.innerHTML =
      left > 0
        ? `<p>Add <b>${money(left)}</b> more for <b>free delivery</b></p><div class="ship-track"><i style="width:${w}%"></i></div>`
        : `<p class="ok"><b>You've unlocked free delivery</b></p><div class="ship-track full"><i style="width:100%"></i></div>`;
  }

  // items
  document.getElementById("cartItems").innerHTML = cart.length
    ? cart
        .map(
          (p, i) => `
    <div class="cart-item"><img src="${p.img}" alt="">
      <div class="ci-body">
        <h4>${p.name}</h4>
        <p class="ci-unit">${money(priceOf(p))} each</p>
        <div class="ci-row">
          <div class="qty">
            <button data-qty="${i}" data-dir="-1" aria-label="Decrease quantity"${p.qty <= 1 ? " disabled" : ""}>−</button>
            <span>${p.qty}</span>
            <button data-qty="${i}" data-dir="1" aria-label="Increase quantity"${p.qty >= MAX_QTY ? " disabled" : ""}>+</button>
          </div>
          <strong class="ci-line">${money(priceOf(p) * p.qty)}</strong>
        </div>
        <div class="ci-actions">
          <button class="remove trash-btn" data-remove="${i}" aria-label="Remove item" title="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
        </div>
      </div>
    </div>
  `,
        )
        .join("")
    : `<div class="cart-empty"><p>Your cart is empty.</p><button class="continue-shop" data-shop>Continue shopping</button></div>`;

  // footer / summary
  document.getElementById("cartFooter").style.display = cart.length ? "block" : "none";
  document.getElementById("cartSubtotal").textContent = money(t.subtotal);
  document.getElementById("discountLine").style.display = t.pct ? "flex" : "none";
  document.getElementById("cartDiscount").textContent = "-" + money(t.discount);
  document.getElementById("cartDelivery").textContent = t.delivery
    ? money(t.delivery)
    : "Free";
  document.getElementById("cartTotal").textContent = money(t.total);

  // promo
  document.getElementById("promoRow").style.display = promo ? "none" : "flex";
  document.getElementById("promoMsg").innerHTML = promo
    ? `<span class="ok">${promo} applied · ${t.pct}% off</span> <button data-promo-remove>Remove</button>`
    : "";
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
  const q = e.target.closest("[data-qty]");
  if (q) {
    const item = cart[+q.dataset.qty];
    if (item) {
      item.qty = Math.min(MAX_QTY, Math.max(1, item.qty + +q.dataset.dir));
      save();
    }
    return;
  }
  if (e.target.closest("[data-promo-remove]")) {
    promo = "";
    localStorage.removeItem("healthyPromo");
    updateCart();
    return;
  }
  if (e.target.closest("[data-shop]")) {
    closeCart();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    return;
  }
  const add = e.target.closest("[data-product]");
  if (add) {
    const p = JSON.parse(add.dataset.product.replace(/&#39;/g, "'"));
    if (!cart.some((c) => c.name === p.name)) {
      cart.push({ ...p, qty: 1 });
      save();
    }
    // open the cart pop-up so the person sees the item right away
    closeWishlist();
    openCart();
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
function applyPromo() {
  const input = document.getElementById("promoInput");
  const code = input.value.trim().toUpperCase();
  const msg = document.getElementById("promoMsg");
  if (!code) {
    msg.innerHTML = `<span class="err">Enter a promo code</span>`;
    return;
  }
  if (PROMO_CODES[code]) {
    promo = code;
    localStorage.setItem("healthyPromo", code);
    input.value = "";
    updateCart();
    toast(`Promo ${code} applied`);
  } else {
    msg.innerHTML = `<span class="err">Invalid promo code</span>`;
  }
}
document.getElementById("promoApply").onclick = applyPromo;
document.getElementById("promoInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyPromo();
});
document.getElementById("clearCart").onclick = () => {
  if (!cart.length) return;
  if (confirm("Remove all items from your cart?")) {
    cart = [];
    save();
  }
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

function showDefaultNew() {
  render("newProducts", products.newProducts);
}
// live = true while the person is still typing (no scroll, no toast)
function search(live = false) {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  if (!q) {
    showDefaultNew();
    if (!live) toast("Search for a medicine or medical product");
    return;
  }
  const all = Object.values(products).flat();
  // remove duplicate names so the same product is not listed twice
  const found = all
    .filter((p) => p.name.toLowerCase().includes(q))
    .filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i);
  if (!found.length) {
    // nothing matched: New Products (and Popular Products) stay on screen
    showDefaultNew();
    if (!live) {
      // bring the product cards into view
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }
    return;
  }
  document.getElementById("newProducts").innerHTML = found
    .map((p, i) => card(p, i))
    .join("");
  if (!live)
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}
document.getElementById("searchButton").onclick = () => search();
document.getElementById("searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") search();
});
// clearing the search box brings the normal New Products back
let searchTimer;
document.getElementById("searchInput").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => search(true), 200); // live results while typing
});

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
  // mobile grids are 2 columns -> stagger per column
  const cols = () => (matchMedia("(max-width: 768px)").matches ? 2 : 4);
  group(".offer-card", "", cols());
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
    $(".product-card", grid).forEach((c, i) => reveal(c, i % cols()));
    new MutationObserver(() =>
      $(".product-card", grid).forEach((c, i) => reveal(c, i % cols()))
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
