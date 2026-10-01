/* =====================================================
   DATA PRODUK — Foto Kosmetik Asli (Online)
   Kategori: "makeup" atau "lipstik"
   ===================================================== */
const products = [
  {
    id: 1,
    name: "Lipstik Matte Red",
    desc: "Tahan lama, warna bold, cocok untuk daily & party.",
    price: 89000,
    kategori: "lipstik",
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Lipstik Matte Red"
  },
  {
    id: 3,
    name: "Lipstik Glossy Pink",
    desc: "Efek shiny, melembapkan, warna soft pink.",
    price: 75000,
    kategori: "lipstik",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Lipstik Glossy Pink"
  },
  {
    id: 4,
    name: "Palet Eyeshadow Nude",
    desc: "12 warna netral, pigmented, mudah diblend.",
    price: 120000,
    kategori: "makeup",
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/2693644/pexels-photo-2693644.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Palet Eyeshadow Nude"
  },
  {
    id: 5,
    name: "Mascara Volume",
    desc: "Bulu mata lentik & tebal, waterproof.",
    price: 95000,
    kategori: "makeup",
    img: "https://images.unsplash.com/photo-1631214540553-ffa53c8b4c3c?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/2633986/pexels-photo-2633986.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Mascara Volume"
  },
  {
    id: 7,
    name: "Blush On Peach",
    desc: "Warna natural, bikin pipi fresh seharian.",
    price: 65000,
    kategori: "makeup",
    img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Blush On Peach"
  },
  {
    id: 8,
    name: "Lip Balm Strawberry",
    desc: "Melembapkan bibir, wangi strawberry segar.",
    price: 45000,
    kategori: "lipstik",
    img: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    fallback: "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Lip Balm Strawberry"
  }
];

/* =====================================================
   STATE KERANJANG
   ===================================================== */
let cart = [];

/* =====================================================
   HELPER
   ===================================================== */
function formatRupiah(num) {
  return "Rp " + num.toLocaleString("id-ID");
}

/* =====================================================
   RENDER PRODUK
   ===================================================== */
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products.map((p, i) => `
    <div class="product-card" data-kategori="${p.kategori}" style="animation-delay:${i * 0.08}s">
      <img src="${p.img}"
           alt="${p.alt}"
           loading="lazy"
           data-fallback="${p.fallback}"
           onerror="handleImgError(this)" />
      <div class="card-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <p class="price price-clamp">${formatRupiah(p.price)}</p>
        <button class="btn-buy" data-id="${p.id}">Beli Sekarang</button>
      </div>
    </div>
  `).join("");

  attachBuyEvents();
}

/* =====================================================
   Fallback gambar: utama → cadangan → placeholder
   ===================================================== */
function handleImgError(el) {
  const fallback = el.dataset.fallback;
  if (fallback && el.src !== fallback) {
    el.src = fallback;
  } else {
    el.onerror = null;
    el.src = "https://placehold.co/600x400/fce7f3/db2777?text=Glow+Beauty";
  }
}

/* =====================================================
   EVENT TOMBOL BELI
   ===================================================== */
function attachBuyEvents() {
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

/* =====================================================
   TAMBAH KE KERANJANG
   ===================================================== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      fallback: product.fallback,
      qty: 1
    });
  }

  updateCartUI();
  bumpCartBadge();
  showToast(` "${product.name}" masuk keranjang!`);
}

/* =====================================================
   HAPUS / UBAH QTY
   ===================================================== */
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

/* =====================================================
   UPDATE UI KERANJANG
   ===================================================== */
function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  cartCount.textContent = totalQty;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Keranjang masih kosong 🛒</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}"
             data-fallback="${item.fallback}"
             onerror="handleImgError(this)" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-price">${formatRupiah(item.price)}</p>
          <div class="qty-control">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
      </div>
    `).join("");
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  cartTotal.textContent = formatRupiah(total);
}

/* =====================================================
   ANIMASI BADGE
   ===================================================== */
function bumpCartBadge() {
  const badge = document.getElementById("cartCount");
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
}

/* =====================================================
   TOAST
   ===================================================== */
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}

/* =====================================================
   PANEL KERANJANG
   ===================================================== */
function initCart() {
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const closeCart = document.getElementById("closeCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const openCart = () => {
    cartPanel.classList.add("show");
    cartOverlay.classList.add("show");
  };
  const closeCartFn = () => {
    cartPanel.classList.remove("show");
    cartOverlay.classList.remove("show");
  };

  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartFn);
  cartOverlay.addEventListener("click", closeCartFn);

  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("⚠️ Keranjang masih kosong");
      return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    alert(`🛍️ Checkout berhasil!\nTotal: ${formatRupiah(total)}\n\nTerima kasih sudah belanja di Glow Beauty 💄`);
    cart = [];
    updateCartUI();
    closeCartFn();
  });
}

/* =====================================================
   HAMBURGER MENU
   ===================================================== */
function initNavbar() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenu.classList.remove("flex");
    });
  });
}

/* =====================================================
   FILTER KATEGORI (Semua / Makeup / Lipstik)
   ===================================================== */
function initFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const navLinks = document.querySelectorAll("[data-filter]");

  const applyFilter = (kategori) => {
    const cards = document.querySelectorAll(".product-card");
    let visibleCount = 0;

    cards.forEach(card => {
      const cardKategori = card.dataset.kategori;
      if (kategori === "all" || cardKategori === kategori) {
        card.classList.remove("hidden-card");
        card.classList.add("fade-in");
        visibleCount++;
      } else {
        card.classList.add("hidden-card");
        card.classList.remove("fade-in");
      }
    });

    // Pesan kosong
    const emptyMsg = document.getElementById("emptyMessage");
    if (visibleCount === 0) emptyMsg.classList.remove("hidden");
    else emptyMsg.classList.add("hidden");

    // Tombol aktif
    filterBtns.forEach(b => {
      b.classList.toggle("active", b.dataset.filter === kategori);
    });

    // Scroll halus ke produk
    document.getElementById("produk").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Tombol filter di main
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
  });

  // Link navbar (Semua / Makeup / Lipstik)
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilter(link.dataset.filter);
      // Tutup menu mobile setelah klik
      const mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      }
    });
  });
}

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initNavbar();
  initCart();
  initFilter();
  updateCartUI();
});