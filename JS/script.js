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

function card(p, index) {
  return `<article class="product-card">
    <button class="heart" data-heart="${index}">♡</button>
    <div class="product-image"><img src="${p.img}" alt="${p.name}"></div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="price-line"><span class="price">${p.price}</span><span class="price old">${p.old}</span></div>
    </div>
    <button class="add" data-product='${JSON.stringify(p).replace(/'/g, "&#39;")}'>Add to Cart <span>🛒</span></button>
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
  const add = e.target.closest("[data-product]");
  if (add) {
    const p = JSON.parse(add.dataset.product.replace(/&#39;/g, "'"));
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
  const heart = e.target.closest("[data-heart]");
  if (heart) {
    heart.textContent = heart.textContent === "♡" ? "♥" : "♡";
    return;
  }
});
document.getElementById("cartButton").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("overlay").onclick = closeCart;
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
