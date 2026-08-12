// ===================================================
// ARTS OF FLOWERS - 1,000+ Product Catalog Generator
// ===================================================
window.flowerCatalog = [
  {
    id: 1,
    name: "Classic Red Roses",
    category: "Roses",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviewsCount: 124,
    stock: 50,
    sales: 210,
    featured: true,
    description: "A timeless arrangement of premium long-stemmed red roses.",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80"
  },
  {
    id: 2,
    name: "Royal Pink Lilies",
    category: "Lilies",
    price: 45.00,
    originalPrice: 55.00,
    rating: 4.7,
    reviewsCount: 89,
    stock: 35,
    sales: 140,
    featured: true,
    description: "Elegant pink lilies that bring fresh fragrance and vibrancy.",
    image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&q=80"
  },
  {
    id: 3,
    name: "Golden Sunflower Bunch",
    category: "Sunflowers",
    price: 32.50,
    originalPrice: 40.00,
    rating: 4.9,
    reviewsCount: 156,
    stock: 60,
    sales: 310,
    featured: true,
    description: "Bright yellow sunflowers guaranteed to lift anyone's day.",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80"
  }
];
const flowerNamesPrefixes = [
  "Royal", "Classic", "Exotic", "Blush", "Golden", "Midnight", "Velvet", 
  "Celestial", "Rustic", "Pastel", "Enchanted", "Imperial", "Sweet", 
  "Majestic", "Serene", "Vintage", "Tropical", "Blooming", "Radiant", "Pure"
];

const flowerTypes = [
  { name: "Roses", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500&q=80" },
  { name: "Lilies", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&q=80" },
  { name: "Sunflowers", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&q=80" },
  { name: "Orchids", image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500&q=80" },
  { name: "Tulips", image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500&q=80" },
  { name: "Carnations", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&q=80" },
  { name: "Daisies", image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=500&q=80" },
  { name: "Peonies", image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=500&q=80" }
];

const styles = [
  "Bouquet in Kraft Wrap", "Deluxe Vase Arrangement", "Glass Jar Bunch", 
  "Gift Box Edition", "Woven Basket Meadow", "Satin Tied Bundle", "Velvet Box Special"
];

const badgesList = ["Bestseller", "Sale", "Top Rated", "Trending", "Limited", ""];

// Function to generate 1,000 distinct flower items
function generate1000Flowers() {
  const catalog = [];

  for (let i = 1; i <= 1000; i++) {
    const prefix = flowerNamesPrefixes[i % flowerNamesPrefixes.length];
    const typeObj = flowerTypes[i % flowerTypes.length];
    const style = styles[i % styles.length];
    
    const price = +(19.99 + ((i * 3.7) % 80)).toFixed(2);
    const originalPrice = +(price * 1.25).toFixed(2);
    const rating = +(4.0 + ((i % 10) / 10)).toFixed(1);
    const reviewsCount = 15 + ((i * 13) % 450);
    const stock = 10 + ((i * 7) % 90);
    const sales = 20 + ((i * 19) % 800);
    const badge = badgesList[i % badgesList.length];

    catalog.push({
      id: i,
      name: `${prefix} ${typeObj.name} ${style}`,
      category: typeObj.name,
      price: price,
      originalPrice: originalPrice,
      rating: rating,
      reviewsCount: reviewsCount,
      stock: stock,
      sales: sales,
      badge: badge,
      featured: i <= 8, // First 8 items are featured on home page
      description: `Beautiful arrangement of fresh ${prefix.toLowerCase()} ${typeObj.name.toLowerCase()} presented in a ${style.toLowerCase()}. Perfect for gifting and special celebrations.`,
      image: typeObj.image
    });
  }

  return catalog;
}

// Master Array exported to flower.js
const flowerCatalog = generate1000Flowers();