// product.js - Central Data Fetcher
const API_URL = "https://arts-of-flower-backend.onrender.com/api/products?page=0&size=100";
window.flowerCatalog = []; // Global catalog array

async function loadBackendCatalog() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    
    // Handle Spring Boot Page object vs plain Array
    if (Array.isArray(data)) {
      window.flowerCatalog = data;
    } else if (data.content && Array.isArray(data.content)) {
      window.flowerCatalog = data.content;
    } else {
      window.flowerCatalog = [];
    }

    console.log("Loaded flowers from database:", window.flowerCatalog);

  } catch (error) {
    console.error("Error connecting to Spring Boot backend:", error);
  } finally {
    // Refresh UI components
    if (typeof updateBadges === 'function') updateBadges();
    if (typeof updateHomeWishlistHearts === 'function') updateHomeWishlistHearts();
    if (typeof initShopPage === 'function') initShopPage();
    if (typeof initWishlistPage === 'function') initWishlistPage();
    if (typeof initCartPage === 'function') initCartPage();
    if (typeof initCheckoutPage === 'function') initCheckoutPage();
    if (typeof initDashboardPage === 'function') initDashboardPage();
  }
}

document.addEventListener('DOMContentLoaded', loadBackendCatalog);