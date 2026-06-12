export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: "⚡",
    color: "bg-blue-100",
    subcategories: [
      { name: "Phones & Tablets", slug: "phones-tablets" },
      { name: "Computers & Accessories", slug: "computers-accessories" },
      { name: "TVs & Audio", slug: "tvs-audio" },
      { name: "Cameras", slug: "cameras" },
      { name: "Gaming", slug: "gaming" },
      { name: "Smart Wearables", slug: "smart-wearables" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    icon: "👗",
    color: "bg-pink-100",
    subcategories: [
      { name: "Men's Clothing", slug: "mens-clothing" },
      { name: "Women's Clothing", slug: "womens-clothing" },
      { name: "Kids' Fashion", slug: "kids-fashion" },
      { name: "Shoes & Sneakers", slug: "shoes-sneakers" },
      { name: "Watches & Jewelry", slug: "watches-jewelry" },
      { name: "Bags & Luggage", slug: "bags-luggage" },
    ],
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: "💄",
    color: "bg-red-100",
    subcategories: [
      { name: "Skincare", slug: "skincare" },
      { name: "Hair Care", slug: "hair-care" },
      { name: "Fragrances", slug: "fragrances" },
      { name: "Vitamins & Supplements", slug: "vitamins-supplements" },
      { name: "Medical Supplies", slug: "medical-supplies" },
    ],
  },
  {
    name: "Home & Living",
    slug: "home-living",
    icon: "🏠",
    color: "bg-green-100",
    subcategories: [
      { name: "Furniture", slug: "furniture" },
      { name: "Kitchen & Dining", slug: "kitchen-dining" },
      { name: "Bedding & Bath", slug: "bedding-bath" },
      { name: "Garden & Outdoors", slug: "garden-outdoors" },
      { name: "Tools & Hardware", slug: "tools-hardware" },
    ],
  },
  {
    name: "Sports & Fitness",
    slug: "sports-fitness",
    icon: "🏋️",
    color: "bg-orange-100",
    subcategories: [
      { name: "Exercise Equipment", slug: "exercise-equipment" },
      { name: "Sportswear", slug: "sportswear" },
      { name: "Outdoor Recreation", slug: "outdoor-recreation" },
      { name: "Cycling", slug: "cycling" },
      { name: "Team Sports", slug: "team-sports" },
    ],
  },
  {
    name: "Grocery & Food",
    slug: "grocery-food",
    icon: "🛒",
    color: "bg-yellow-100",
    subcategories: [
      { name: "Fresh Produce", slug: "fresh-produce" },
      { name: "Beverages", slug: "beverages" },
      { name: "Snacks", slug: "snacks" },
      { name: "Dairy & Eggs", slug: "dairy-eggs" },
    ],
  },
  {
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "🧸",
    color: "bg-purple-100",
    subcategories: [
      { name: "Toys & Games", slug: "toys-games" },
      { name: "Baby Care", slug: "baby-care" },
      { name: "School Supplies", slug: "school-supplies" },
      { name: "Kids' Clothing", slug: "kids-clothing" },
    ],
  },
  {
    name: "Automotive",
    slug: "automotive",
    icon: "🚗",
    color: "bg-gray-100",
    subcategories: [
      { name: "Car Accessories", slug: "car-accessories" },
      { name: "Motorcycle Parts", slug: "motorcycle-parts" },
      { name: "Car Electronics", slug: "car-electronics" },
      { name: "Car Care", slug: "car-care" },
    ],
  },
  {
    name: "Books & Stationery",
    slug: "books-stationery",
    icon: "📚",
    color: "bg-cyan-100",
    subcategories: [
      { name: "Books", slug: "books" },
      { name: "School Stationery", slug: "school-stationery" },
      { name: "Art Supplies", slug: "art-supplies" },
    ],
  },
  {
    name: "Industrial & Business",
    slug: "industrial-business",
    icon: "🔧",
    color: "bg-slate-100",
    subcategories: [
      { name: "Safety & Security", slug: "safety-security" },
      { name: "Cleaning Supplies", slug: "cleaning-supplies" },
      { name: "Office Equipment", slug: "office-equipment" },
    ],
  },
];
