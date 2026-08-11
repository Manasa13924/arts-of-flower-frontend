/**
 * Arts of Flowers - Optimized JavaScript Engine
 * Optimizations Applied:
 * - DocumentFragment for single batch DOM injection (Eliminates layout thrashing)
 * - Native lazy loading and async decoding attributes
 * - Event Delegation for dynamic click handling
 * - Debouncing input events to lower main thread work
 */

(function () {
    'use strict';

    let catalogData = [];
    let cartItems = [];
    let wishlistIds = new Set(); // Stores favorited product IDs

    // 1. Fetch JSON Data
    async function loadData() {
        try {
            const res = await fetch('data.json');
            if (!res.ok) throw new Error('Failed to fetch data.json');
            catalogData = await res.json();
            renderDashboard(catalogData);
        } catch (err) {
            console.error('Data Load Error:', err);
            const grid = document.getElementById('flower-grid');
            if (grid) grid.innerHTML = '<p style="color:red;">Error loading product catalog. Make sure data.json exists.</p>';
        }
    }

    // 2. Render Cards & Update KPIs
    function renderDashboard(items) {
        const grid = document.getElementById('flower-grid');
        if (!grid) return;

        updateKPIs(items);

        grid.innerHTML = '';
        if (items.length === 0) {
            grid.innerHTML = '<p>No flowers matched your search criteria.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'cards';
            card.style.position = 'relative';

            const loadingStrategy = index < 2 ? 'eager' : 'lazy';
            const isLiked = wishlistIds.has(item.id);

            card.innerHTML = `
                <button type="button" class="wishlist-btn" data-id="${item.id}" 
                        style="position:absolute; top:10px; right:10px; background:white; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.2); font-size:1.1rem; display:flex; align-items:center; justify-content:center;">
                    ${isLiked ? '❤️' : '🤍'}
                </button>
                <img src="${item.image}" 
                     alt="${item.name}" 
                     class="center-image" 
                     width="240" 
                     height="200" 
                     loading="${loadingStrategy}" 
                     decoding="async" 
                     onerror="this.src='https://via.placeholder.com/240x200?text=Flower+Image'">
                <h3 class="flower-title">${item.name}</h3>
                <p class="flower-price">₹${item.price}</p>
                <p style="font-size:0.85rem; color:#64748b; margin-bottom:8px;">Stock: ${item.stock} | Sales: ${item.sales}</p>
                <button type="button" class="add-to-cart" data-id="${item.id}">Add to cart</button>
            `;

            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    }

    // Update Top Dashboard Indicators
    function updateKPIs(items) {
        const totalEl = document.getElementById('kpi-total');
        const salesEl = document.getElementById('kpi-sales');
        const avgEl = document.getElementById('kpi-avg');

        if (totalEl) totalEl.textContent = items.length;
        if (salesEl) {
            const totalSales = items.reduce((sum, item) => sum + item.sales, 0);
            salesEl.textContent = `${totalSales} units`;
        }
        if (avgEl) {
            const avg = items.length ? items.reduce((sum, item) => sum + item.price, 0) / items.length : 0;
            avgEl.textContent = `₹${Math.round(avg)}`;
        }
    }

    // Filter & Sorting Logic
    function applyFilterAndSort() {
        const query = document.getElementById('search-input').value.toLowerCase().trim();
        const sortVal = document.getElementById('sort-select').value;

        let filtered = catalogData.filter(item => item.name.toLowerCase().includes(query));

        if (sortVal === 'price-low') filtered.sort((a, b) => a.price - b.price);
        if (sortVal === 'price-high') filtered.sort((a, b) => b.price - a.price);
        if (sortVal === 'sales-high') filtered.sort((a, b) => b.sales - a.sales);

        renderDashboard(filtered);
    }

    // Toggle Wishlist Heart
    function toggleWishlist(productId, buttonEl) {
        const id = Number(productId);
        if (wishlistIds.has(id)) {
            wishlistIds.delete(id);
            if (buttonEl) buttonEl.textContent = '🤍';
        } else {
            wishlistIds.add(id);
            if (buttonEl) buttonEl.textContent = '❤️';
        }
        const countEl = document.getElementById('wishlist-count');
        if (countEl) countEl.textContent = wishlistIds.size;
    }

    // Add Item to Cart Array
    function addToCart(productId) {
        const product = catalogData.find(item => item.id === Number(productId));
        if (product) {
            cartItems.push(product);
            updateCartUI();
        }
    }

    // Update Cart UI Badge and Modal List
    function updateCartUI() {
        const counterEl = document.getElementById('cart-count');
        if (counterEl) counterEl.textContent = cartItems.length;

        const listEl = document.getElementById('cart-items-list');
        const totalEl = document.getElementById('cart-total-price');

        if (listEl) {
            if (cartItems.length === 0) {
                listEl.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                listEl.innerHTML = cartItems.map((item, idx) => `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:0.95rem;">
                        <span>${item.name}</span>
                        <span>₹${item.price} <button class="remove-item" data-index="${idx}" style="color:red; background:none; border:none; cursor:pointer; font-weight:bold; margin-left:8px;">✕</button></span>
                    </div>
                `).join('');
            }
        }

        if (totalEl) {
            const sum = cartItems.reduce((acc, item) => acc + item.price, 0);
            totalEl.textContent = `₹${sum}`;
        }
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Single Click Listener for all dynamic events
    document.addEventListener('click', function (e) {
        // Wishlist Heart Click
        const wishBtn = e.target.closest('.wishlist-btn');
        if (wishBtn) {
            const id = wishBtn.getAttribute('data-id');
            toggleWishlist(id, wishBtn);
            return;
        }

        // Add to Cart Button
        if (e.target && e.target.classList.contains('add-to-cart')) {
            const id = e.target.getAttribute('data-id');
            addToCart(id);
            alert('Added item to cart!');
            return;
        }

        // Open Cart Modal
        if (e.target && (e.target.id === 'open-cart-btn' || e.target.closest('#open-cart-btn'))) {
            const modal = document.getElementById('cart-modal');
            if (modal) modal.style.display = 'flex';
            return;
        }

        // Close Cart Modal
        if (e.target && (e.target.id === 'close-cart' || e.target.id === 'cart-modal')) {
            const modal = document.getElementById('cart-modal');
            if (modal) modal.style.display = 'none';
            return;
        }

        // Remove Item from Cart Inside Modal
        if (e.target && e.target.classList.contains('remove-item')) {
            const idx = e.target.getAttribute('data-index');
            cartItems.splice(idx, 1);
            updateCartUI();
            return;
        }
    });

    // Page Initialization
    document.addEventListener('DOMContentLoaded', () => {
        loadData();

        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');

        if (searchInput) searchInput.addEventListener('input', debounce(applyFilterAndSort, 150));
        if (sortSelect) sortSelect.addEventListener('change', applyFilterAndSort);

        // Checkout Form Submit
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (cartItems.length === 0) {
                    alert('Your cart is empty!');
                    return;
                }
                alert('🎉 Payment Successful! Your floral order has been placed.');
                cartItems = [];
                updateCartUI();
                document.getElementById('cart-modal').style.display = 'none';
                checkoutForm.reset();
            });
        }
    });

})();