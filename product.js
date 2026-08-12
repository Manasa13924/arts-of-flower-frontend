// Local and international flower base data
const baseFlowerTypes = [
  { name: "Marigold (Genda)", category: "Local", price: 12.99, image: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=500", desc: "Vibrant yellow and orange marigolds essential for festive celebrations and garlands." },
  { name: "Jasmine (Mogra)", category: "Local", price: 18.50, image: "https://images.unsplash.com/photo-1592729645009-b96d1e63d14b?w=500", desc: "Sweet-scented fresh white Jasmine blooms for traditional adornment." },
  { name: "Hibiscus (Gudhal)", category: "Local", price: 14.00, image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=500", desc: "Bold tropical hibiscus petals perfect for offerings and home decor." },
  { name: "Lotus (Kamal)", category: "Local", price: 24.99, image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=500", desc: "Pure and serene lotus flowers sourced from fresh water ponds." },
  { name: "Tuberose (Rajnigandha)", category: "Local", price: 19.99, image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500", desc: "Fragrant white flower spikes with an intoxicating evening scent." },
  { name: "Rose", category: "Roses", price: 22.00, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500", desc: "Classic fresh long-stem roses." },
  { name: "Sunflower", category: "Seasonal", price: 16.50, image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500", desc: "Bright golden sunflowers bringing warmth and joy." },
  { name: "Tulip", category: "Imported", price: 26.00, image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=500", desc: "Elegant spring tulips hand-picked from top growers." },
  { name: "Orchid", category: "Exotic", price: 31.00, image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=500", desc: "Exotic long-lasting orchids with striking color depth." },
  { name: "Lily", category: "Lilies", price: 27.50, image: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=500", desc: "Fragrant, peaceful lily blooms." }
];

const prefixes = ["Royal", "Fresh", "Golden", "Blossom", "Deluxe", "Imperial", "Wild", "Garden", "Sacred", "Sunlit"];
const variations = ["Bouquet", "Garland", "Arrangement", "Single Stem", "Gift Box", "Basket", "Vase Special"];

function generateLargeCatalog(targetCount = 1000) {
  const catalog = [];
  
  for (let i = 1; i <= targetCount; i++) {
    const base = baseFlowerTypes[(i - 1) % baseFlowerTypes.length];
    const prefix = prefixes[(i - 1) % prefixes.length];
    const variation = variations[(i - 1) % variations.length];
    
    // Vary prices slightly per item
    const adjustedPrice = +(base.price + ((i % 15) * 0.75)).toFixed(2);
    
    catalog.push({
      id: i,
      name: `${prefix} ${base.name} ${variation}`,
      price: adjustedPrice,
      originalPrice: +(adjustedPrice * 1.25).toFixed(2),
      rating: +(4 + ((i % 10) * 0.1)).toFixed(1),
      reviewsCount: 10 + (i % 80),
      category: base.category,
      image: base.image,
      description: `${base.desc} Premium selection batch #${i}.`
    });
  }
  
  return catalog;
}

// Global catalog with 1000+ products
const flowerCatalog = generateLargeCatalog(1000);