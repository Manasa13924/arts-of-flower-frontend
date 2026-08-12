# 🌸 ARTs of flower Analytics Dashboard

An interactive, responsive web application built to help local floriculture vendors manage inventory, monitor sales performance
---
## 🚀 Live Demo
[View Live Application](https://Manasa13924.github.io/arts-of-flower-frontend/)

---

## 📊 Overview & Key Features

The **ARTs of flower Analytics Dashboard** combines dynamic data integration with clean modern UI design.

### Key Features:
- **Asynchronous Data Loading:** Reads product information dynamically from a static `data.json` dataset using the JavaScript Fetch API.
- **Dynamic KPI Recalculation:** Automatically computes and displays **Total Products**, **Total Units Sold**, **Average Price**, and **Total Revenue** in real time as user search/filter criteria change.
- **Debounced Live Search:** Filters products by flower name (*e.g., Mysore Mallige, Kanakambara, Dasavala, Kakada*) with a 200ms debounce buffer to ensure smooth DOM updates.
- **Multi-Attribute Sorting:** Reorders the product grid by Name (A–Z), Price (Low to High / High to Low), Sales Volume, or Available Stock.
- **Responsive CSS Grid Layout:** Adapts smoothly across mobile, tablet, and desktop viewports.
- **Performance & Resilience:** Includes `loading="lazy"` tags on image elements and an automated `onerror` fallback listener to handle broken image URLs gracefully.

---

## 🛠️ Tech Stack

- **Frontend Layout:** HTML5 (Semantic Structure)
- **Styling & Layout:** CSS3 (Custom CSS Variables, Flexbox, CSS Grid)
- **Logic & Functionality:** JavaScript (ES6+, Fetch API, Promises, Event Handling)
- **Dataset:** JSON (`data.json`)

---

## 📁 Repository Structure

```text
├── index.html        # Main HTML dashboard structure & semantic markup
├── style.css         # Responsive styling, color themes & CSS Grid layout
├── script.js        # JavaScript runtime logic (Fetch API, search, filter, KPIs)
├── data.json         # Static dataset containing 35 local flower records
└── README.md         # Project documentation and summary
