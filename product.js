// product.js - Central Data Fetcher
const API_URL = "https://arts-of-flower-backend.onrender.com/api/products?page=0&size=100";
window.flowerCatalog = []; // Global catalog array

// Default fallback image if an image fails or is missing
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300";

async function loadBackendCatalog() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    let rawList = [];
    
    if (Array.isArray(data)) {
      rawList = data;
    } else if (data.content && Array.isArray(data.content)) {
      rawList = data.content;
    }

    // Clean up product names and relative image paths
    window.flowerCatalog = rawList.map(item => {
      const nameVal = String(item.name || "").trim();
      const cleanName = (!nameVal || !isNaN(nameVal)) ? `Flower #${item.id || item.price}` : nameVal;

      let cleanImage = DEFAULT_IMAGE;
      if (item.imageUrl) {
        if (item.imageUrl.startsWith("http")) {
          cleanImage = item.imageUrl;
        } else {
          cleanImage = `./images/${item.imageUrl}`;
        }
      }

      return {
        ...item,
        name: cleanName,
        imageUrl: cleanImage
      };
    });

    console.log("Loaded flowers from database:", window.flowerCatalog);

  } catch (error) {
    console.error("Error connecting to Spring Boot backend:", error);
  } finally {
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