// ==========================================
// 1. Initial State & Data Management
// ==========================================

// Sample initial catalog (We will scale this to 1,000+ items with DB next!)
const sampleFlowers = [
  {
    id: 1,
    name: "Classic Red Roses",
    category: "Roses",
    price: 39.99,
    stock: 45,
    sales: 120,
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80",
    featured: true
  },
  {
    id: 2,
    name: "Royal Pink Lilies",
    category: "Lilies",
    price: 45.00,
    stock: 30,
    sales: 85,
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&q=80",
    featured: true
  },
  {
    id: 3,
    name: "Golden Sunflower Bunch",
    category: "Sunflowers",
    price: 32.50,
    stock: 60,
    sales: 140,
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80",
    featured: true
  },
  {
    id: 4,
    name: "Purple Orchid Bliss",
    category: "Orchids",
    price: 52.00,
    stock: 15,
    sales: 62,
    image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80",
    featured: false
  }
];

// --- Cart Helpers ---
function getCart() {
  return JSON.parse(localStorage.getItem('flower_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('flower_cart', JSON.stringify(cart));
  updateBadges();
}

function addToCart(flowerId) {
  const cart = getCart();
  const flower = sampleFlowers.find(f => f.id === flowerId);
  if (!flower) return;

  const existingItem = cart.find(item => item.id === flowerId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...flower, quantity: 1 });
  }

  saveCart(cart);
  alert(`${flower.name} added to your cart!`);
}

// --- Wishlist Helpers ---
function getWishlist() {
  return JSON.parse(localStorage.getItem('flower_wishlist')) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('flower_wishlist', JSON.stringify(wishlist));
  updateBadges();
}

function toggleWishlist(flowerId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(flowerId);

  if (index > -1) {
    wishlist.splice(index, 1); // Remove if already wishlisted
  } else {
    wishlist.push(flowerId); // Add if not in wishlist
  }

  saveWishlist(wishlist);
  
  // Re-render active page elements to reflect filled/unfilled heart
  initHomePage();
  initShopPage();
}

// --- Navbar Badges Update ---
function updateBadges() {
  // Update Cart Count
  const cart = getCart();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.getElementById('cart-count');
  if (cartBadge) {
    cartBadge.textContent = totalCartCount;
  }

  // Update Wishlist Count
  const wishlist = getWishlist();
  const wishlistBadge = document.getElementById('wishlist-count');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}


// ==========================================
// 2. Page Specific Handlers
// ==========================================

// --- A. Home Page Logic (index.html) ---
function initHomePage() {
  const featuredGrid = document.getElementById('featured-grid');
  if (!featuredGrid) return;

  const wishlist = getWishlist();
  const featuredFlowers = sampleFlowers.filter(f => f.featured);

  featuredGrid.innerHTML = featuredFlowers.map(flower => {
    const isWishlisted = wishlist.includes(flower.id);
    return `
      <div class="flower-card">
        <button class="wishlist-btn" onclick="toggleWishlist(${flower.id})">
          ${isWishlisted ? '❤️' : '🤍'}
        </button>
        <img src="${flower.image}" alt="${flower.name}">
        <div class="card-details">
          <h4>${flower.name}</h4>
          <p class="price">$${flower.price.toFixed(2)}</p>
          <button class="btn-add-cart" onclick="addToCart(${flower.id})">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}

// --- B. Shop Page Logic (shop.html) ---
function initShopPage() {
  const shopGrid = document.getElementById('shop-grid');
  const searchInput = document.getElementById('search-input');
  if (!shopGrid) return;

  function renderCatalog(items) {
    const wishlist = getWishlist();
    shopGrid.innerHTML = items.map(flower => {
      const isWishlisted = wishlist.includes(flower.id);
      return `
        <div class="flower-card">
          <button class="wishlist-btn" onclick="toggleWishlist(${flower.id})">
            ${isWishlisted ? '❤️' : '🤍'}
          </button>
          <img src="${flower.image}" alt="${flower.name}">
          <div class="card-details">
            <h4>${flower.name}</h4>
            <p class="price">$${flower.price.toFixed(2)}</p>
            <button class="btn-add-cart" onclick="addToCart(${flower.id})">Add to Cart</button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCatalog(sampleFlowers);

  // Search Filter Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = sampleFlowers.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.category.toLowerCase().includes(query)
      );
      renderCatalog(filtered);
    });
  }
}

// --- C. Cart Page Logic (cart.html) ---
function initCartPage() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalDisplay = document.getElementById('cart-total');
  if (!cartItemsContainer) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">Your cart is currently empty.</p>`;
    if (cartTotalDisplay) cartTotalDisplay.textContent = '0.00';
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;">
          <div>
            <h4 style="margin:0;">${item.name}</h4>
            <p style="margin:0; color: #666;">$${item.price.toFixed(2)} x ${item.quantity}</p>
          </div>
        </div>
        <div style="font-weight: bold; color: #ba6870;">
          $${itemTotal.toFixed(2)}
        </div>
      </div>
    `;
  }).join('');

  if (cartTotalDisplay) {
    cartTotalDisplay.textContent = total.toFixed(2);
  }
}

// --- D. Dashboard Logic (dashboard.html) ---
function initDashboardPage() {
  const totalRevEl = document.getElementById('total-revenue');
  const unitsSoldEl = document.getElementById('units-sold');
  const avgPriceEl = document.getElementById('avg-price');
  const tableBody = document.getElementById('table-body');

  if (!tableBody) return;

  let totalRevenue = 0;
  let totalUnits = 0;

  tableBody.innerHTML = sampleFlowers.map(flower => {
    const revenue = flower.price * flower.sales;
    totalRevenue += revenue;
    totalUnits += flower.sales;

    return `
      <tr>
        <td>${flower.name}</td>
        <td>${flower.category}</td>
        <td>$${flower.price.toFixed(2)}</td>
        <td>${flower.stock} units</td>
        <td>${flower.sales}</td>
      </tr>
    `;
  }).join('');

  if (totalRevEl) totalRevEl.textContent = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
  if (unitsSoldEl) unitsSoldEl.textContent = totalUnits;
  if (avgPriceEl) avgPriceEl.textContent = `$${(totalRevenue / (totalUnits || 1)).toFixed(2)}`;
}


// ==========================================
// 3. Application Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initHomePage();
  initShopPage();
  initCartPage();
  initDashboardPage();
});