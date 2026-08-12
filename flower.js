// ==========================================
// Helper: Safe Catalog Access
// ==========================================
function getCatalog() {
  if (typeof flowerCatalog !== 'undefined') return flowerCatalog;
  if (window.flowerCatalog) return window.flowerCatalog;
  return [];
}

// ==========================================
// 1. Helpers & State Management
// ==========================================
let currentPage = 1;
const itemsPerPage = 12;

function getCart() { 
  return JSON.parse(localStorage.getItem('flower_cart')) || []; 
}

function saveCart(cart) { 
  localStorage.setItem('flower_cart', JSON.stringify(cart)); 
  updateBadges(); 
}

function addToCart(flowerId) {
  const catalog = getCatalog();
  const cart = getCart();
  const flower = catalog.find(f => f.id === flowerId);
  if (!flower) return;

  const item = cart.find(i => i.id === flowerId);
  if (item) item.quantity += 1;
  else cart.push({ ...flower, quantity: 1 });

  saveCart(cart);
  alert(`${flower.name} added to your cart!`);
}

function getWishlist() { 
  return JSON.parse(localStorage.getItem('flower_wishlist')) || []; 
}

function saveWishlist(wishlist) { 
  localStorage.setItem('flower_wishlist', JSON.stringify(wishlist)); 
  updateBadges(); 
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
}

// ==========================================
// 2. Product Detail Modal
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

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="closeProductModal()">×</button>
      <img class="modal-img" src="${flower.image}" alt="${flower.name}">
      <div class="modal-body">
        <h2 style="font-family:'Playfair Display', serif; margin-bottom:0.5rem;">${flower.name}</h2>
        <p style="color:#f39c12; margin-bottom:0.8rem;">⭐ ${flower.rating} (${flower.reviewsCount} reviews)</p>
        <p style="font-size:1.3rem; font-weight:600; color:#ba6870; margin-bottom:1rem;">$${flower.price.toFixed(2)}</p>
        <p style="color:#666; font-size:0.9rem; margin-bottom:1.5rem; line-height:1.5;">${flower.description}</p>
        <button class="btn-primary" onclick="addToCart(${flower.id}); closeProductModal();">Add to Cart</button>
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

// --- Shop Page ---
function initShopPage() {
  const grid = document.getElementById('shop-grid');
  const searchInput = document.getElementById('search-input');
  if (!grid) return;

  const catalog = getCatalog();
  if (!catalog || catalog.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; text-align:center; padding: 2rem;">No products found in catalog.</p>`;
    return;
  }

  let activeList = [...catalog];

  function renderPage(page) {
    currentPage = page;
    const wishlist = getWishlist();
    const start = (page - 1) * itemsPerPage;
    const paginatedItems = activeList.slice(start, start + itemsPerPage);

    grid.innerHTML = paginatedItems.map(f => `
      <div class="flower-card" onclick="openProductModal(${f.id})">
        <button class="wishlist-btn" onclick="toggleWishlist(${f.id}, event)">${wishlist.includes(f.id) ? '❤️' : '🤍'}</button>
        <img src="${f.image}" alt="${f.name}">
        <div class="card-details">
          <h4>${f.name}</h4>
          <p class="price">$${f.price.toFixed(2)} ${f.originalPrice ? `<span style="text-decoration:line-through; color:#aaa; font-size:0.8rem;">$${f.originalPrice.toFixed(2)}</span>` : ''}</p>
          <p style="font-size:0.85rem; color:#f39c12;">⭐ ${f.rating || 5} (${f.reviewsCount || 10} reviews)</p>
          <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${f.id})">Add to Cart</button>
        </div>
      </div>
    `).join('');

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

  grid.innerHTML = wishlistedFlowers.map(f => `
    <div class="flower-card" onclick="openProductModal(${f.id})">
      <button class="wishlist-btn" onclick="toggleWishlist(${f.id}, event)">❤️</button>
      <img src="${f.image}" alt="${f.name}">
      <div class="card-details">
        <h4>${f.name}</h4>
        <p class="price">$${f.price.toFixed(2)}</p>
        <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${f.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

// --- Cart Page ---
function initCartPage() {
  const container = document.getElementById('cart-items');
  const totalDisplay = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = `<p style="text-align:center; padding: 2rem;">Your cart is empty.</p>`;
    if (totalDisplay) totalDisplay.textContent = '0.00';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const sub = item.price * item.quantity;
    total += sub;
    return `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding:1rem; background:white; border-radius:8px;">
        <div style="display:flex; align-items:center; gap:1rem;">
          <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:6px;">
          <div>
            <h4 style="margin:0;">${item.name}</h4>
            <p style="margin:0; color:#666;">$${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
        </div>
        <div style="font-weight:bold; color:#ba6870;">$${sub.toFixed(2)}</div>
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
        <span style="font-weight:600;">$${sub.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.textContent = total.toFixed(2);
}

function processOrder(e) {
  e.preventDefault();
  alert('Thank you for your order! Your blooms are on their way! 🌸');
  localStorage.removeItem('flower_cart');
  window.location.href = 'index.html';
}

// --- Dashboard Page ---
function initDashboardPage() {
  const tableBody = document.getElementById('table-body');
  if (!tableBody) return;

  const catalog = getCatalog();
  let totalRev = 0, totalUnits = 0;

  tableBody.innerHTML = catalog.slice(0, 50).map(f => {
    const sales = f.sales || 0;
    const rev = f.price * sales;
    totalRev += rev;
    totalUnits += sales;
    return `
      <tr>
        <td>${f.name}</td>
        <td>${f.category || 'N/A'}</td>
        <td>$${f.price.toFixed(2)}</td>
        <td>${f.stock || 0} units</td>
        <td>${sales}</td>
      </tr>
    `;
  }).join('');

  const revEl = document.getElementById('total-revenue');
  const unitsEl = document.getElementById('units-sold');
  const avgEl = document.getElementById('avg-price');

  if (revEl) revEl.textContent = `$${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  if (unitsEl) unitsEl.textContent = totalUnits;
  if (avgEl) avgEl.textContent = `$${(totalRev / (totalUnits || 1)).toFixed(2)}`;
}

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  updateHomeWishlistHearts();
  initShopPage();
  initWishlistPage();
  initCartPage();
  initCheckoutPage();
  initDashboardPage();
});