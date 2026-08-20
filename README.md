# 🌸 ARTS OF FLOWERS - Full-Stack E-Commerce Web Application

An elegant, interactive e-commerce platform for ordering fresh flowers and bouquets. Built with a dynamic front-end that connects seamlessly to a Spring Boot backend API with automatic cloud deployment.

---

## ✨ Features

* **Dynamic Product Catalog:** Loads flowers directly from a RESTful API with pagination and fallback configurations.
* **Interactive Modal View:** Detailed pop-up view for every flower including ratings, reviews, descriptions, and quick purchase actions.
* **Shopping Cart & Checkout:** Real-time cart management with quantity adjustments, subtotal calculations, and purchase processing.
* **Wishlist Management:** Persistent heart toggles that save favorite flowers locally and auto-clean outdated entries.
* **Past Purchases History:** Keeps track of previous customer orders and allows quick re-ordering directly from the cart page.
* **Store Analytics Dashboard:** Dynamic sales reporting and stock inventory overview calculated from real-time order data.
* **Automated CI/CD:** Integrated GitHub Actions workflow for automatic deployment to GitHub Pages upon pushing to `main`.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+), FontAwesome / Google Fonts (`Playfair Display`, `Poppins`)
* **Backend:** Spring Boot REST API hosted on Render
* **Database & Persistence:** Web `localStorage` API for state persistence and dynamic API payload processing
* **Deployment:** GitHub Pages (Frontend) via GitHub Actions Workflow

---

## 🚀 Live Demo & API Link

* **Live Frontend:** [ARTS OF FLOWERS on GitHub Pages](https://manasa13924.github.io/arts-of-flower-frontend/shop.html)
* **Backend API:** `https://arts-of-flower-backend.onrender.com/api/products?page=0&size=100`

---

## 📂 Project Structure

```text
arts-of-flower-frontend/
├── index.html        # Home / Landing page
├── shop.html         # Main product catalog page
├── wishlist.html     # Saved favorite flowers page
├── cart.html         # Shopping cart & purchase history page
├── checkout.html     # Order checkout & summary page
├── dashboard.html    # Inventory & sales analytics page
├── flower.js         # Central JavaScript logic & API integration
└── style.css         # Main stylesheet
