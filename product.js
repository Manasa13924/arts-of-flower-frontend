// product.js - Central Data Fetcher
const API_URL = "https://arts-of-flower-backend.onrender.com/api/products?page=0&size=100";
window.flowerCatalog = []; // Global catalog array

// Default fallback image when no valid image exists
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

    // Clean up product names and image paths
    window.flowerCatalog = rawList.map(item => {
      // 1. Fix numeric or empty product names
      const nameVal = String(item.name || "").trim();
      const cleanName = (!nameVal || !isNaN(nameVal)) ? `Flower #${item.id || item.price}` : nameVal;

      // 2. Fix image pathing logic
      let cleanImage = DEFAULT_IMAGE;
      if (item.imageUrl && item.imageUrl.trim() !== "") {
        const imgStr = item.imageUrl.trim();
        if (imgStr.startsWith("http://") || imgStr.startsWith("https://")) {
          cleanImage = imgStr;
        } else if (imgStr.includes(".")) {
          // Has file extension (e.g. "rose.jpg")
          cleanImage = `./images/${imgStr}`;
        } else {
          // Plain numeric string or invalid filename -> fallback to online placeholder
          cleanImage = DEFAULT_IMAGE;
        }
      }

      return {
        ...item,
        name: cleanName,
        imageUrl: cleanImage
      };
    });

    console.log("Loaded and sanitized flowers:", window.flowerCatalog);

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