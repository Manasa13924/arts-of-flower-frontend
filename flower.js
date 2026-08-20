// ==========================================
// 1. API & Global State Configuration
// ==========================================
const API_URL = "https://arts-of-flower-backend.onrender.com/api/products?page=0&size=100";
const DEFAULT_FLOWER_IMG = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80";

window.flowerCatalog = [];
let currentPage = 1;
const itemsPerPage = 12;

function getCatalog() {
  return window.flowerCatalog || [];
}

/**
 * Image URL Resolver
 */
function getValidImageUrl(item) {
  if (!item) return DEFAULT_FLOWER_IMG;
  
  let rawImg = item.image || item.imageUrl || item.image_url;

  if (rawImg && typeof rawImg === 'string') {
    let strImg = rawImg.trim();
    if (strImg.startsWith("http://") || strImg.startsWith("https://")) {
      return strImg;
    }
  }

  return DEFAULT_FLOWER_IMG;
}

// Storage Helpers
function getCart() { 
  return JSON.parse(localStorage.getItem('flower_cart')) || []; 
}

function saveCart(cart) { 
  localStorage.setItem('flower_cart', JSON.stringify(cart)); 
  updateBadges(); 
}

function getWishlist() { 
  return JSON.parse(localStorage.getItem('flower_wishlist')) || []; 
}

function saveWishlist(wishlist) { 
  localStorage.setItem('flower_wishlist', JSON.stringify(wishlist)); 
  updateBadges(); 
}

function getOrderHistory() {
  return JSON.parse(localStorage.getItem('flower_order_history')) || [];
}

// Action Handlers
function handleAddToCart(flowerId, event) {
  if (event) event.stopPropagation(); 
  
  const catalog = getCatalog();
  const cart = getCart();
  const flower = catalog.find(f => f.id === flowerId);
  if (!flower) return;

  const item = cart.find(i => i.id === flowerId);
  if (item) item.quantity += 1;
  else cart.push({ ...flower, quantity: 1 });

  saveCart(cart);

  const proceed = confirm(`"${flower.name}" added to cart!\n\nDo you want to proceed to payment now?`);
  if (proceed) {
    window.location.href = 'cart.html';
  }
}

function buyAgainPrompt(flowerId) {
  const catalog = getCatalog();
  const flower = catalog.find(f => f.id === flowerId);
  if (!flower) return;

  const confirmBuy = confirm(`Do you want to buy "${flower.name}" again?`);
  if (confirmBuy) {
    handleAddToCart(flowerId);
  }
}

function toggleWishlist(flowerId, event) {
  if (event) event.stopPropagation();
  let wishlist = getWishlist();
  const idx = wishlist.indexOf(flowerId);
  if (idx > -1) wishlist.splice(idx, 1);
  else wishlist.push(flowerId);
  
  saveWishlist(wishlist);
  updateHomeWishlistHearts();
  initShopPage();
  initWishlistPage();
}

function updateBadges() {
  const cart = getCart();
  const wishlist = getWishlist();
  const cBadge = document.getElementById('cart-count');
  const wBadge = document.getElementById('wishlist-count');
  if (cBadge) cBadge.textContent = cart.reduce((s, i) => s + i.quantity, 0);
  if (wBadge) wBadge.textContent = wishlist.length;
}

function updateHomeWishlistHearts() {
  const wishlist = getWishlist();
  
  [1, 2, 3].forEach(id => {
    const btn = document.getElementById(`wish-btn-${id}`);
    if (btn) btn.textContent = wishlist.includes(id) ? '❤️' : '🤍';
  });

  [1, 2, 3].forEach(id => {
    const imgEl = document.querySelector(`#featured-${id} img, [data-home-id="${id}"] img`);
    if (imgEl) {
      imgEl.style.cursor = 'pointer';
      imgEl.onclick = () => openProductModal(id);
    }

    const cartBtn = document.querySelector(`#home-cart-btn-${id}, [onclick*="addToCart(${id})"]`);
    if (cartBtn) {
      cartBtn.onclick = (e) => handleAddToCart(id, e);
    }
  });
}

// ==========================================
// 2. Product Information Modal
// ==========================================
function openProductModal(flowerId) {
  const catalog = getCatalog();
  const flower = catalog.find(f => f.id === flowerId);
  if (!flower) return;

  let modal = document.getElementById('product-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'product-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const priceVal = typeof flower.price === 'number' ? flower.price.toFixed(2) : flower.price;
  const imgUrl = getValidImageUrl(flower);
  const descriptionText = flower.description || flower.desc || 'Freshly handpicked blooms prepared with care. Perfect for gifts, occasions, or adding a vibrant touch to your space.';

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="closeProductModal()">×</button>
      <img class="modal-img" src="${imgUrl}" alt="${flower.name}" onerror="this.onerror=null; this.src='${DEFAULT_FLOWER_IMG}';">
      <div class="modal-body">
        <h2 style="font-family:'Playfair Display', serif; margin-bottom:0.5rem;">${flower.name}</h2>
        <p style="color:#f39c12; margin-bottom:0.8rem;">⭐ ${flower.rating || 5} (${flower.reviewsCount || 10} reviews)</p>
        <p style="font-size:1.3rem; font-weight:600; color:#ba6870; margin-bottom:1rem;">₹${priceVal}</p>
        <p style="color:#666; font-size:0.95rem; margin-bottom:1.5rem; line-height:1.6;">
          ${descriptionText}
        </p>
        <button class="btn-primary" onclick="handleAddToCart(${flower.id}); closeProductModal();">Add to Cart</button>
      </div>
    </div>
  `;

  setTimeout(() => modal.classList.add('active'), 10);
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('active');
}

// ==========================================
// 3. Page Logic Handlers
// ==========================================
function increaseQuantity(flowerId) {
  const cart = getCart();
  const item = cart.find(i => i.id === flowerId);
  if (item) {
    item.quantity += 1;
    saveCart(cart);
    initCartPage();
    initCheckoutPage();
  }
}

function decreaseQuantity(flowerId) {
  let cart = getCart();
  const item = cart.find(i => i.id === flowerId);
  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart = cart.filter(i => i.id !== flowerId);
    }
    saveCart(cart);
    initCartPage();
    initCheckoutPage();
  }
}

function removeFromCart(flowerId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== flowerId);
  saveCart(cart);
  initCartPage();
  initCheckoutPage();
}

// --- Shop / Products Page ---
function initShopPage() {
  const grid = document.getElementById('shop-grid');
  const searchInput = document.getElementById('search-input');
  if (!grid) return;

  const catalog = getCatalog();
  if (!catalog || catalog.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding: 2rem;">No products found in database.</p>`;
    return;
  }

  let activeList = [...catalog];

  function renderPage(page) {
    currentPage = page;
    const wishlist = getWishlist();
    const start = (page - 1) * itemsPerPage;
    const paginatedItems = activeList.slice(start, start + itemsPerPage);

    grid.innerHTML = paginatedItems.map(f => {
      const priceVal = typeof f.price === 'number' ? f.price.toFixed(2) : f.price;
      const origPriceVal = f.originalPrice ? (typeof f.originalPrice === 'number' ? f.originalPrice.toFixed(2) : f.originalPrice) : null;
      const imgUrl = getValidImageUrl(f);

      return `
        <div class="flower-card" onclick="openProductModal(${f.id})">
          <button class="wishlist-btn" onclick="toggleWishlist(${f.id}, event)">${wishlist.includes(f.id) ? '❤️' : '🤍'}</button>
          <img src="${imgUrl}" alt="${f.name}" title="Click to view detailed info" onerror="this.onerror=null; this.src='${DEFAULT_FLOWER_IMG}';">
          <div class="card-details">
            <h4>${f.name}</h4>
            <p class="price">₹${priceVal} ${origPriceVal ? `<span style="text-decoration:line-through; color:#aaa; font-size:0.8rem;">₹${origPriceVal}</span>` : ''}</p>
            <p style="font-size:0.85rem; color:#f39c12;">⭐ ${f.rating || 5} (${f.reviewsCount || 10} reviews)</p>
            <button class="btn-add-cart" onclick="handleAddToCart(${f.id}, event)">Add to Cart</button>
          </div>
        </div>
      `;
    }).join('');

    renderPaginationControls();
  }

  function renderPaginationControls() {
    let paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) {
      paginationContainer = document.createElement('div');
      paginationContainer.id = 'pagination-container';
      paginationContainer.style.cssText = 'display:flex; justify-content:center; gap:10px; margin-top:30px; grid-column: 1 / -1;';
      grid.parentNode.appendChild(paginationContainer);
    }

    const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
    paginationContainer.innerHTML = `
      <button class="btn-add-cart" ${currentPage === 1 ? 'disabled style="opacity:0.5"' : ''} onclick="changePage(${currentPage - 1})">Previous</button>
      <span style="align-self:center; font-weight:500;">Page ${currentPage} of ${totalPages} (Total ${activeList.length} Flowers)</span>
      <button class="btn-add-cart" ${currentPage === totalPages ? 'disabled style="opacity:0.5"' : ''} onclick="changePage(${currentPage + 1})">Next</button>
    `;
  }

  window.changePage = function(newPage) {
    const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;
    if (newPage >= 1 && newPage <= totalPages) {
      renderPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  renderPage(1);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      activeList = catalog.filter(f => f.name.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q)));
      renderPage(1);
    });
  }
}

// --- Wishlist Page ---
function initWishlistPage() {
  const grid = document.getElementById('wishlist-grid');
  if (!grid) return;

  const wishlistIds = getWishlist();
  const catalog = getCatalog();
  const wishlistedFlowers = catalog.filter(f => wishlistIds.includes(f.id));

  if (wishlistedFlowers.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding: 3rem;">Your wishlist is currently empty. Click ❤️ on any flower to save it here!</p>`;
    return;
  }

  grid.innerHTML = wishlistedFlowers.map(f => {
    const priceVal = typeof f.price === 'number' ? f.price.toFixed(2) : f.price;
    const imgUrl = getValidImageUrl(f);

    return `
      <div class="flower-card" onclick="openProductModal(${f.id})">
        <button class="wishlist-btn" onclick="toggleWishlist(${f.id}, event)">❤️</button>
        <img src="${imgUrl}" alt="${f.name}" onerror="this.onerror=null; this.src='${DEFAULT_FLOWER_IMG}';">
        <div class="card-details">
          <h4>${f.name}</h4>
          <p class="price">₹${priceVal}</p>
          <button class="btn-add-cart" onclick="handleAddToCart(${f.id}, event)">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}

// --- Cart Page ---
function initCartPage() {
  const container = document.getElementById('cart-items');
  const summaryBox = document.getElementById('purchased-summary');
  const totalDisplay = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (summaryBox) {
    const history = getOrderHistory();
    if (history.length === 0) {
      summaryBox.innerHTML = `<p style="color:#888; font-style:italic;">No past purchases yet.</p>`;
    } else {
      summaryBox.innerHTML = `
        <div style="background: #fff8f8; border: 1px solid #f1c40f; border-radius: 8px; padding: 1rem; margin-bottom: 2rem;">
          <h3 style="margin-top:0; color:#ba6870;">🌸 Your Past Purchases Summary</h3>
          <ul style="list-style:none; padding:0; margin:0;">
            ${history.map(item => `
              <li style="display:flex; justify-content:space-between; align-items:center; padding: 0.5rem 0; border-bottom: 1px dashed #eee;">
                <span 
                  onclick="openProductModal(${item.id})" 
                  style="cursor:pointer; color:#ba6870; font-weight:600; text-decoration:underline;"
                  title="Click to view details and buy again">
                  ${item.name}
                </span>
                <span>Qty: ${item.quantity} | Total: ₹${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }
  }

  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding: 2rem;">Your active cart is empty.</p>`;
    if (totalDisplay) totalDisplay.textContent = '0.00';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const sub = item.price * item.quantity;
    total += sub;
    const imgUrl = getValidImageUrl(item);

    return `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding:1rem; background:white; border-radius:8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="display:flex; align-items:center; gap:1rem;">
          <img src="${imgUrl}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;" onerror="this.onerror=null; this.src='${DEFAULT_FLOWER_IMG}';">
          <div>
            <h4 style="margin:0;">${item.name}</h4>
            <p style="margin:0; color:#666;">₹${Number(item.price).toFixed(2)} each</p>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button onclick="decreaseQuantity(${item.id})" style="padding:4px 10px; cursor:pointer; font-weight:bold; border:1px solid #ccc; border-radius:4px; background:#f9f9f9;">-</button>
          <span style="font-weight:bold; padding:0 5px;">${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})" style="padding:4px 10px; cursor:pointer; font-weight:bold; border:1px solid #ccc; border-radius:4px; background:#f9f9f9;">+</button>
        </div>

        <div style="display:flex; align-items:center; gap:1rem;">
          <div style="font-weight:bold; color:#ba6870;">₹${sub.toFixed(2)}</div>
          <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.1rem;" title="Remove Item">🗑️</button>
        </div>
      </div>
    `;
  }).join('');

  if (totalDisplay) totalDisplay.textContent = total.toFixed(2);
}

// --- Checkout Page ---
function initCheckoutPage() {
  const summaryBox = document.getElementById('checkout-summary-items');
  const totalEl = document.getElementById('checkout-total');
  if (!summaryBox) return;

  const cart = getCart();
  let total = 0;

  summaryBox.innerHTML = cart.map(item => {
    const sub = item.price * item.quantity;
    total += sub;
    return `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem; font-size:0.9rem;">
        <span>${item.name} (x${item.quantity})</span>
        <span style="font-weight:600;">₹${sub.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = total.toFixed(2);
}

function processOrder(e) {
  if (e) e.preventDefault();
  const cart = getCart();
  if (cart.length === 0) return alert('Your cart is empty!');

  const history = getOrderHistory();
  cart.forEach(item => {
    const existing = history.find(h => h.id === item.id);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      history.push({ ...item });
    }
  });

  localStorage.setItem('flower_order_history', JSON.stringify(history));
  localStorage.removeItem('flower_cart');

  alert('Thank you for your order! Your blooms are on their way! 🌸');
  window.location.href = 'index.html';
}

// --- Dashboard Page ---
function initDashboardPage() {
  const tableBody = document.getElementById('table-body');
  if (!tableBody) return;

  const catalog = getCatalog();
  const orderHistory = getOrderHistory();

  const salesMap = {};
  orderHistory.forEach(order => {
    const qty = Number(order.quantity) || 0;
    salesMap[order.id] = (salesMap[order.id] || 0) + qty;
  });

  let totalRev = 0;
  let totalUnits = 0;

  tableBody.innerHTML = catalog.map(f => {
    const stock = f.reviewsCount ?? f.reviews_count ?? f.stock ?? 0;
    const dynamicSales = (salesMap[f.id] || 0) + (f.totalSales || f.sales || 0);
    const price = Number(f.price) || 0;
    const rev = price * dynamicSales;

    totalRev += rev;
    totalUnits += dynamicSales;

    return `
      <tr>
        <td>${f.name}</td>
        <td>${f.category || 'N/A'}</td>
        <td>₹${price.toFixed(2)}</td>
        <td>${stock} units</td>
        <td>${dynamicSales}</td>
      </tr>
    `;
  }).join('');

  const revEl = document.getElementById('total-revenue');
  const unitsEl = document.getElementById('units-sold');
  const avgEl = document.getElementById('avg-price');

  const avgPrice = catalog.length > 0 
    ? (catalog.reduce((sum, item) => sum + (Number(item.price) || 0), 0) / catalog.length)
    : 0;

  if (revEl) revEl.textContent = `₹${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  if (unitsEl) unitsEl.textContent = totalUnits;
  if (avgEl) avgEl.textContent = `₹${avgPrice.toFixed(2)}`;
}

// ==========================================
// 4. Central Data Fetching & Page Initializer
// ==========================================
async function loadFlowersFromDatabase() {
  const grid = document.getElementById('shop-grid');
  if (grid) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding: 2rem;">Loading blooms from database...</p>`;
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    const rawList = Array.isArray(data) ? data : (data.content || []);

    window.flowerCatalog = rawList.map(item => {
      // Extract image directly from backend 'image' key or fallback
      let imgUrl = item.image || item.imageUrl || DEFAULT_FLOWER_IMG;
      
      let parsedPrice = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      let parsedOrigPrice = typeof item.originalPrice === 'number' ? item.originalPrice : parseFloat(item.originalPrice) || null;

      return {
        ...item,
        id: item.id,
        name: item.name || `Flower #${item.id}`,
        description: item.description || "Freshly sourced and prepared with care.",
        price: parsedPrice,
        originalPrice: parsedOrigPrice,
        rating: item.rating || 5,
        reviewsCount: item.reviewsCount || 10,
        imageUrl: imgUrl
      };
    });

    // Render components on page load
    initShopPage();
    initWishlistPage();
    initCartPage();
    initCheckoutPage();
    initDashboardPage();
    updateBadges();
    updateHomeWishlistHearts();

  } catch (error) {
    console.error("Error loading flower database:", error);
    if (grid) {
      grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; color:red; padding: 2rem;">Unable to load blooms. Please refresh.</p>`;
    }
  }
}