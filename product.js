// product.js - Central Data Fetcher
const API_URL = "http://localhost:8080/api/products?page=0&size=100";
window.flowerCatalog = []; // Global catalog array

async function loadBackendCatalog() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    
    // Spring Boot Page stores items inside data.content
    window.flowerCatalog = data.content ? data.content : data;
    console.log("Loaded flowers from database:", window.flowerCatalog);

  } catch (error) {
    console.error("Error connecting to Spring Boot backend:", error);
  } finally {
    // 🚀 Refresh UI components after data is ready
    if (typeof updateBadges === 'function') updateBadges();
    if (typeof updateHomeWishlistHearts === 'function') updateHomeWishlistHearts();
    if (typeof initShopPage === 'function') initShopPage();
    if (typeof initWishlistPage === 'function') initWishlistPage();
    if (typeof initCartPage === 'function') initCartPage();
    if (typeof initCheckoutPage === 'function') initCheckoutPage();
    if (typeof initDashboardPage === 'function') initDashboardPage();
  }
}

// Load data as soon as DOM is ready
document.addEventListener('DOMContentLoaded', loadBackendCatalog);