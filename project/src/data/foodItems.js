const STORAGE_KEY = "fh_food_items";
const baseFoodItems = [
  { id: "f1", name: "Margherita Pizza", price: 9.99, categoryId: "pizza", restaurantId: "r1", image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Classic pizza with fresh mozzarella, basil & tomato sauce.", isVeg: true, rating: 4.6, popular: true },
  { id: "f2", name: "Pepperoni Pizza", price: 12.49, categoryId: "pizza", restaurantId: "r1", image: "https://images.pexels.com/photos/803290/pexels-photo-803290.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Loaded with mozzarella and spicy pepperoni slices.", isVeg: false, rating: 4.7, popular: true },
  { id: "f3", name: "Quattro Formaggi", price: 13.99, categoryId: "pizza", restaurantId: "r1", image: "https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Four-cheese pizza with mozzarella, gorgonzola, parmesan & cheddar.", isVeg: true, rating: 4.5, popular: false },
  { id: "f4", name: "Garlic Bread", price: 4.99, categoryId: "pizza", restaurantId: "r1", image: "https://images.pexels.com/photos/5410224/pexels-photo-5410224.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crispy garlic bread with herbs and melted butter.", isVeg: true, rating: 4.3, popular: false },
  { id: "f5", name: "Cheese Burst Pizza", price: 14.99, categoryId: "pizza", restaurantId: "r1", image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Double cheese stuffed crust with premium toppings.", isVeg: true, rating: 4.8, popular: true },
  { id: "f6", name: "Classic Cheeseburger", price: 7.49, categoryId: "burger", restaurantId: "r2", image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Juicy beef patty, cheddar, lettuce, tomato & house sauce.", isVeg: false, rating: 4.5, popular: true },
  { id: "f7", name: "Double Decker Burger", price: 10.99, categoryId: "burger", restaurantId: "r2", image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Two beef patties stacked with double cheese.", isVeg: false, rating: 4.7, popular: true },
  { id: "f8", name: "Veggie Deluxe Burger", price: 6.99, categoryId: "burger", restaurantId: "r2", image: "https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crispy veg patty with fresh veggies and vegan mayo.", isVeg: true, rating: 4.2, popular: false },
  { id: "f9", name: "Crispy Fries", price: 3.49, categoryId: "fast-food", restaurantId: "r2", image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Golden crispy fries seasoned with sea salt.", isVeg: true, rating: 4.4, popular: true },
  { id: "f10", name: "Chicken Wings (6 pcs)", price: 8.99, categoryId: "burger", restaurantId: "r2", image: "https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crispy-60616.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Spicy buffalo wings with blue cheese dip.", isVeg: false, rating: 4.6, popular: true },
  { id: "f11", name: "Butter Chicken", price: 11.99, categoryId: "indian", restaurantId: "r3", image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Creamy tomato-based chicken curry with aromatic spices.", isVeg: false, rating: 4.8, popular: true },
  { id: "f12", name: "Paneer Tikka Masala", price: 9.99, categoryId: "indian", restaurantId: "r3", image: "https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Grilled paneer cubes in a rich creamy gravy.", isVeg: true, rating: 4.6, popular: true },
  { id: "f13", name: "Chicken Biryani", price: 10.49, categoryId: "indian", restaurantId: "r3", image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fragrant basmati rice layered with spiced chicken.", isVeg: false, rating: 4.7, popular: true },
  { id: "f14", name: "Dal Makhani", price: 7.99, categoryId: "indian", restaurantId: "r3", image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Slow-cooked black lentils in a buttery tomato gravy.", isVeg: true, rating: 4.5, popular: false },
  { id: "f15", name: "Garlic Naan", price: 2.49, categoryId: "indian", restaurantId: "r3", image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Soft tandoor-baked bread brushed with garlic butter.", isVeg: true, rating: 4.4, popular: false },
  { id: "f16", name: "Veg Hakka Noodles", price: 8.49, categoryId: "chinese", restaurantId: "r4", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Stir-fried noodles with crunchy vegetables and soy sauce.", isVeg: true, rating: 4.4, popular: true },
  { id: "f17", name: "Chilli Chicken", price: 9.99, categoryId: "chinese", restaurantId: "r4", image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crispy chicken tossed in spicy chilli sauce.", isVeg: false, rating: 4.6, popular: true },
  { id: "f18", name: "Veg Manchurian", price: 7.99, categoryId: "chinese", restaurantId: "r4", image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fried veg balls in a tangy Manchurian sauce.", isVeg: true, rating: 4.3, popular: false },
  { id: "f19", name: "Spring Rolls (4 pcs)", price: 5.49, categoryId: "chinese", restaurantId: "r4", image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crispy rolls stuffed with shredded vegetables.", isVeg: true, rating: 4.5, popular: true },
  { id: "f20", name: "Schezwan Fried Rice", price: 8.99, categoryId: "chinese", restaurantId: "r4", image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Spicy schezwan rice with mixed vegetables.", isVeg: true, rating: 4.4, popular: false },
  { id: "f21", name: "Chocolate Lava Cake", price: 6.49, categoryId: "desserts", restaurantId: "r5", image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Warm cake with a molten chocolate centre.", isVeg: true, rating: 4.9, popular: true },
  { id: "f22", name: "New York Cheesecake", price: 7.99, categoryId: "desserts", restaurantId: "r5", image: "https://images.pexels.com/photos/302468/pexels-photo-302468.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Classic creamy cheesecake on a graham crust.", isVeg: true, rating: 4.8, popular: true },
  { id: "f23", name: "Red Velvet Cupcake", price: 4.49, categoryId: "desserts", restaurantId: "r5", image: "https://images.pexels.com/photos/302468/pexels-photo-302468.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Moist red velvet topped with cream cheese frosting.", isVeg: true, rating: 4.6, popular: false },
  { id: "f24", name: "Tiramisu", price: 6.99, categoryId: "desserts", restaurantId: "r5", image: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Italian coffee-flavoured layered dessert.", isVeg: true, rating: 4.7, popular: false },
  { id: "f25", name: "Ice Cream Sundae", price: 5.99, categoryId: "desserts", restaurantId: "r5", image: "https://images.pexels.com/photos/2130215/pexels-photo-2130215.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Vanilla ice cream with hot fudge and nuts.", isVeg: true, rating: 4.5, popular: true },
  { id: "f26", name: "Beef Tacos (3 pcs)", price: 8.49, categoryId: "fast-food", restaurantId: "r6", image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Soft tortillas filled with seasoned beef and salsa.", isVeg: false, rating: 4.5, popular: true },
  { id: "f27", name: "Chicken Burrito", price: 9.49, categoryId: "fast-food", restaurantId: "r6", image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Grilled chicken, rice, beans & cheese wrapped tight.", isVeg: false, rating: 4.6, popular: true },
  { id: "f28", name: "Nachos Supreme", price: 7.49, categoryId: "fast-food", restaurantId: "r6", image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Loaded nachos with cheese, jalapeños and guacamole.", isVeg: true, rating: 4.4, popular: false },
  { id: "f29", name: "Quesadilla", price: 6.99, categoryId: "fast-food", restaurantId: "r6", image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Grilled tortilla stuffed with cheese and chicken.", isVeg: false, rating: 4.3, popular: false },
  { id: "f30", name: "Loaded Fries", price: 5.99, categoryId: "fast-food", restaurantId: "r6", image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fries topped with cheese sauce and jalapeños.", isVeg: true, rating: 4.5, popular: true },
  { id: "f31", name: "Salmon Nigiri (4 pcs)", price: 11.99, categoryId: "fast-food", restaurantId: "r7", image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fresh salmon over hand-pressed sushi rice.", isVeg: false, rating: 4.9, popular: true },
  { id: "f32", name: "California Roll (8 pcs)", price: 9.49, categoryId: "fast-food", restaurantId: "r7", image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crab, avocado and cucumber rolled in rice.", isVeg: false, rating: 4.7, popular: true },
  { id: "f33", name: "Tempura Prawns", price: 12.99, categoryId: "fast-food", restaurantId: "r7", image: "https://images.pexels.com/photos/8969238/pexels-photo-8969238.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Lightly battered crispy prawns with tentsuyu dip.", isVeg: false, rating: 4.8, popular: false },
  { id: "f34", name: "Chicken Ramen", price: 10.99, categoryId: "fast-food", restaurantId: "r7", image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Rich broth with ramen noodles, egg and chicken.", isVeg: false, rating: 4.8, popular: true },
  { id: "f35", name: "Vegetable Sushi (6 pcs)", price: 8.49, categoryId: "fast-food", restaurantId: "r7", image: "https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Assorted vegetable sushi with soy and wasabi.", isVeg: true, rating: 4.4, popular: false },
  { id: "f36", name: "Greek Salad", price: 8.99, categoryId: "fast-food", restaurantId: "r8", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crisp veggies, feta and olives with olive oil dressing.", isVeg: true, rating: 4.5, popular: true },
  { id: "f37", name: "Quinoa Power Bowl", price: 10.49, categoryId: "fast-food", restaurantId: "r8", image: "https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Quinoa, roasted veggies, chickpeas and tahini.", isVeg: true, rating: 4.6, popular: true },
  { id: "f38", name: "Grilled Chicken Salad", price: 11.49, categoryId: "fast-food", restaurantId: "r8", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Grilled chicken over fresh greens and vinaigrette.", isVeg: false, rating: 4.7, popular: false },
  { id: "f39", name: "Caesar Salad", price: 8.49, categoryId: "fast-food", restaurantId: "r8", image: "https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crisp romaine, parmesan and classic caesar dressing.", isVeg: true, rating: 4.3, popular: false },
  { id: "f40", name: "Avocado Toast", price: 6.99, categoryId: "fast-food", restaurantId: "r8", image: "https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Sourdough topped with smashed avocado and seeds.", isVeg: true, rating: 4.4, popular: false },
  { id: "f41", name: "Mutton Rogan Josh", price: 13.99, categoryId: "indian", restaurantId: "r9", image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Aromatic Kashmiri-style mutton curry.", isVeg: false, rating: 4.8, popular: true },
  { id: "f42", name: "Veg Biryani", price: 8.99, categoryId: "indian", restaurantId: "r9", image: "https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fragrant rice with mixed vegetables and spices.", isVeg: true, rating: 4.5, popular: true },
  { id: "f43", name: "Chicken Tikka", price: 10.99, categoryId: "indian", restaurantId: "r9", image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Tandoor-grilled spiced chicken skewers.", isVeg: false, rating: 4.7, popular: true },
  { id: "f44", name: "Palak Paneer", price: 9.49, categoryId: "indian", restaurantId: "r9", image: "https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Soft paneer in a creamy spinach gravy.", isVeg: true, rating: 4.6, popular: false },
  { id: "f45", name: "Tandoori Roti", price: 1.99, categoryId: "indian", restaurantId: "r9", image: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Whole wheat flatbread baked in a tandoor.", isVeg: true, rating: 4.2, popular: false },
  { id: "f46", name: "Cappuccino", price: 4.49, categoryId: "drinks", restaurantId: "r10", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Espresso with steamed milk and velvety foam.", isVeg: true, rating: 4.6, popular: true },
  { id: "f47", name: "Iced Latte", price: 4.99, categoryId: "drinks", restaurantId: "r10", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Chilled espresso with milk over ice.", isVeg: true, rating: 4.5, popular: true },
  { id: "f48", name: "Hot Chocolate", price: 4.99, categoryId: "drinks", restaurantId: "r10", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Rich chocolate drink with whipped cream.", isVeg: true, rating: 4.7, popular: false },
  { id: "f49", name: "Fresh Lime Soda", price: 2.99, categoryId: "drinks", restaurantId: "r10", image: "https://images.pexels.com/photos/3220141/pexels-photo-3220141.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Refreshing lime soda - sweet, salty or mixed.", isVeg: true, rating: 4.3, popular: false },
  { id: "f50", name: "Mango Smoothie", price: 5.49, categoryId: "drinks", restaurantId: "r10", image: "https://images.pexels.com/photos/3220141/pexels-photo-3220141.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Thick mango smoothie with yoghurt and honey.", isVeg: true, rating: 4.6, popular: true },
  { id: "f51", name: "Stuffed Paneer Kulcha", price: 5.99, categoryId: "indian", restaurantId: "r13", image: "https://images.pexels.com/photos/1389657/pexels-photo-1389657.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Soft kulcha stuffed with spiced paneer and served with butter.", isVeg: true, rating: 4.7, popular: true },
  { id: "f52", name: "Aloo Gobi", price: 7.49, categoryId: "indian", restaurantId: "r13", image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Savory cauliflower and potato curry with warm spices.", isVeg: true, rating: 4.6, popular: false },
  { id: "f53", name: "Hot and Sour Soup", price: 4.99, categoryId: "chinese", restaurantId: "r14", image: "https://images.pexels.com/photos/842541/pexels-photo-842541.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Zesty broth with tofu, bamboo shoots, mushrooms and a kick of pepper.", isVeg: true, rating: 4.5, popular: true },
  { id: "f54", name: "Matcha Latte", price: 4.79, categoryId: "drinks", restaurantId: "r17", image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Creamy matcha latte made with premium Japanese green tea.", isVeg: true, rating: 4.6, popular: false },
  { id: "f55", name: "Acai Bowl", price: 8.99, categoryId: "fast-food", restaurantId: "r18", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Fresh acai blended with berries, granola and banana.", isVeg: true, rating: 4.8, popular: true },
  { id: "f56", name: "Chicken Satay", price: 9.49, categoryId: "fast-food", restaurantId: "r12", image: "https://images.pexels.com/photos/5519972/pexels-photo-5519972.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Grilled chicken skewers served with crunchy peanut sauce.", isVeg: false, rating: 4.7, popular: true },
  { id: "f57", name: "Cinnamon Roll", price: 4.29, categoryId: "desserts", restaurantId: "r15", image: "https://images.pexels.com/photos/302920/pexels-photo-302920.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Warm cinnamon roll drizzled with cream cheese glaze.", isVeg: true, rating: 4.8, popular: true },
  { id: "f58", name: "Blueberry Muffin", price: 3.99, categoryId: "desserts", restaurantId: "r20", image: "https://images.pexels.com/photos/2214362/pexels-photo-2214362.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Moist muffin bursting with juicy blueberries.", isVeg: true, rating: 4.5, popular: false },
  { id: "f59", name: "Bagel Sandwich", price: 6.99, categoryId: "fast-food", restaurantId: "r20", image: "https://images.pexels.com/photos/434555/pexels-photo-434555.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Toasted bagel with egg, cheese and avocado.", isVeg: false, rating: 4.4, popular: false },
  { id: "f60", name: "Espresso Shot", price: 2.99, categoryId: "drinks", restaurantId: "r20", image: "https://images.pexels.com/photos/951658/pexels-photo-951658.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Rich espresso shot with a bold caramel crema.", isVeg: true, rating: 4.7, popular: true },
  { id: "f61", name: "Mango Lassi", price: 3.99, categoryId: "drinks", restaurantId: "r19", image: "https://images.pexels.com/photos/1210392/pexels-photo-1210392.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Smooth mango yogurt drink with a touch of cardamom.", isVeg: true, rating: 4.8, popular: true },
  { id: "f62", name: "Samosa Chaat", price: 5.49, categoryId: "indian", restaurantId: "r13", image: "https://images.pexels.com/photos/374599/pexels-photo-374599.jpeg?auto=compress&cs=tinysrgb&w=600", description: "Crispy samosa pieces topped with chutney, yogurt and sev.", isVeg: true, rating: 4.6, popular: true },
];
const loadStoredFoodItems = () => {
  if (typeof window === "undefined") return baseFoodItems;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fall back to the built-in menu items.
  }

  return baseFoodItems;
};

let foodItems = loadStoredFoodItems();

export const addFoodItem = (item) => {
  const safeItem = {
    id: item.id || `f${Date.now()}`,
    name: item.name,
    price: Number(item.price) || 0,
    categoryId: item.categoryId || item.category || "general",
    category: item.category || item.categoryId || "general",
    restaurantId: item.restaurantId || "r1",
    image: item.image || "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: item.description || "Freshly prepared and served hot.",
    isVeg: Boolean(item.isVeg),
    rating: Number(item.rating) || 4.5,
    popular: Boolean(item.popular),
    prepTime: item.prepTime || "15 mins",
  };

  foodItems = [safeItem, ...foodItems];

  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(foodItems));
  }

  return safeItem;
};

export { foodItems };
export default foodItems;
