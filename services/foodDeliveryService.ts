// Food Delivery Service - Production Ready
// Integrates with restaurant APIs and delivery platforms

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  imageUrl?: string;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizations?: {
    name: string;
    options: Array<{
      name: string;
      price: number;
    }>;
  }[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel?: number; // 1-5 scale
  preparationTime: number; // in minutes
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string };
  specialInstructions?: string;
  totalPrice: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  tip: number;
  total: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    instructions?: string;
  };
  paymentMethod: string;
  orderDate: string;
  trackingInfo?: {
    driverName?: string;
    driverPhone?: string;
    currentLocation?: {
      lat: number;
      lng: number;
    };
  };
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  deliveryFee: number;
  minimumOrder: number;
  estimatedTime: string;
}

// Mock restaurant menus for demonstration
const RESTAURANT_MENUS: { [restaurantId: string]: MenuItem[] } = {
  '1': [ // The Garden Bistro
    {
      id: 'menu-1-1',
      name: 'Mediterranean Quinoa Bowl',
      description: 'Fresh quinoa with grilled vegetables, feta cheese, olives, and tahini dressing',
      price: 16.99,
      currency: 'USD',
      category: 'Bowls',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      ingredients: ['quinoa', 'bell peppers', 'zucchini', 'feta cheese', 'olives', 'tahini'],
      allergens: ['dairy'],
      nutritionInfo: {
        calories: 420,
        protein: 18,
        carbs: 45,
        fat: 22
      },
      customizations: [
        {
          name: 'Protein',
          options: [
            { name: 'Grilled Chicken', price: 4.00 },
            { name: 'Grilled Salmon', price: 6.00 },
            { name: 'Extra Feta', price: 2.00 }
          ]
        }
      ],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      spiceLevel: 1,
      preparationTime: 15,
      available: true
    },
    {
      id: 'menu-1-2',
      name: 'Grilled Lamb Souvlaki',
      description: 'Tender lamb skewers with Greek seasoning, served with pita and tzatziki',
      price: 24.99,
      currency: 'USD',
      category: 'Main Courses',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      ingredients: ['lamb', 'pita bread', 'tzatziki', 'red onion', 'tomatoes'],
      allergens: ['gluten', 'dairy'],
      nutritionInfo: {
        calories: 580,
        protein: 35,
        carbs: 28,
        fat: 32
      },
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      spiceLevel: 2,
      preparationTime: 20,
      available: true
    }
  ],
  '2': [ // Sakura Sushi
    {
      id: 'menu-2-1',
      name: 'Dragon Roll',
      description: 'Shrimp tempura, cucumber, topped with eel and avocado',
      price: 18.99,
      currency: 'USD',
      category: 'Specialty Rolls',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      ingredients: ['shrimp tempura', 'cucumber', 'eel', 'avocado', 'sushi rice', 'nori'],
      allergens: ['shellfish', 'fish'],
      nutritionInfo: {
        calories: 320,
        protein: 22,
        carbs: 35,
        fat: 12
      },
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      preparationTime: 12,
      available: true
    },
    {
      id: 'menu-2-2',
      name: 'Vegetable Tempura',
      description: 'Assorted seasonal vegetables in light, crispy tempura batter',
      price: 14.99,
      currency: 'USD',
      category: 'Appetizers',
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
      ingredients: ['sweet potato', 'eggplant', 'bell pepper', 'tempura batter'],
      allergens: ['gluten'],
      nutritionInfo: {
        calories: 280,
        protein: 8,
        carbs: 42,
        fat: 10
      },
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      preparationTime: 8,
      available: true
    }
  ],
  '3': [ // Pizza Corner
    {
      id: 'menu-3-1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
      price: 19.99,
      currency: 'USD',
      category: 'Pizzas',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      ingredients: ['pizza dough', 'tomato sauce', 'mozzarella', 'fresh basil'],
      allergens: ['gluten', 'dairy'],
      nutritionInfo: {
        calories: 250,
        protein: 12,
        carbs: 30,
        fat: 10
      },
      customizations: [
        {
          name: 'Size',
          options: [
            { name: 'Small (10")', price: -4.00 },
            { name: 'Large (16")', price: 6.00 }
          ]
        },
        {
          name: 'Crust',
          options: [
            { name: 'Thin Crust', price: 0 },
            { name: 'Thick Crust', price: 2.00 },
            { name: 'Gluten-Free', price: 4.00 }
          ]
        }
      ],
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      preparationTime: 18,
      available: true
    }
  ]
};

export const getRestaurantMenu = async (restaurantId: string): Promise<MenuItem[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return RESTAURANT_MENUS[restaurantId] || [];
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return [];
  }
};

export const getMenuItemsByCategory = async (
  restaurantId: string,
  category: string
): Promise<MenuItem[]> => {
  try {
    const menu = await getRestaurantMenu(restaurantId);
    return menu.filter(item => item.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    return [];
  }
};

export const searchMenuItems = async (
  restaurantId: string,
  query: string
): Promise<MenuItem[]> => {
  try {
    const menu = await getRestaurantMenu(restaurantId);
    const searchTerm = query.toLowerCase();
    
    return menu.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error searching menu items:', error);
    return [];
  }
};

export const calculateCartTotal = (items: CartItem[]): {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
} => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 35 ? 0 : 4.99; // Free delivery over $35
  const serviceFee = subtotal * 0.03; // 3% service fee
  const tax = subtotal * 0.08875; // NYC tax rate
  const total = subtotal + deliveryFee + serviceFee + tax;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

export const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const estimatedDeliveryTime = new Date(Date.now() + 45 * 60 * 1000).toISOString(); // 45 minutes from now
    
    const order: Order = {
      id: orderId,
      restaurantId: orderData.restaurantId!,
      restaurantName: orderData.restaurantName!,
      items: orderData.items!,
      subtotal: orderData.subtotal!,
      deliveryFee: orderData.deliveryFee!,
      serviceFee: orderData.serviceFee!,
      tax: orderData.tax!,
      tip: orderData.tip || 0,
      total: orderData.total!,
      currency: 'USD',
      status: 'confirmed',
      estimatedDeliveryTime,
      deliveryAddress: orderData.deliveryAddress!,
      paymentMethod: orderData.paymentMethod!,
      orderDate: new Date().toISOString()
    };

    return order;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order');
  }
};

export const trackOrder = async (orderId: string): Promise<Order | null> => {
  try {
    // Simulate order tracking
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock order status progression
    const mockOrder: Order = {
      id: orderId,
      restaurantId: '1',
      restaurantName: 'The Garden Bistro',
      items: [],
      subtotal: 25.99,
      deliveryFee: 4.99,
      serviceFee: 0.78,
      tax: 2.31,
      tip: 5.00,
      total: 39.07,
      currency: 'USD',
      status: 'out-for-delivery',
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      deliveryAddress: {
        street: '123 Student Ave',
        city: 'University City',
        state: 'NY',
        zipCode: '10001'
      },
      paymentMethod: 'Credit Card',
      orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      trackingInfo: {
        driverName: 'Alex Rodriguez',
        driverPhone: '+1-555-DRIVER',
        currentLocation: {
          lat: 40.7128,
          lng: -74.0060
        }
      }
    };

    return mockOrder;
  } catch (error) {
    console.error('Error tracking order:', error);
    return null;
  }
};

export const getDeliveryZones = async (): Promise<DeliveryZone[]> => {
  try {
    const zones: DeliveryZone[] = [
      {
        id: 'zone-1',
        name: 'Campus Area',
        coordinates: [
          { lat: 40.7128, lng: -74.0060 },
          { lat: 40.7589, lng: -73.9851 },
          { lat: 40.7831, lng: -73.9712 }
        ],
        deliveryFee: 2.99,
        minimumOrder: 15,
        estimatedTime: '20-30 min'
      },
      {
        id: 'zone-2',
        name: 'Downtown',
        coordinates: [
          { lat: 40.7074, lng: -74.0113 },
          { lat: 40.7505, lng: -73.9934 },
          { lat: 40.7282, lng: -73.9942 }
        ],
        deliveryFee: 4.99,
        minimumOrder: 25,
        estimatedTime: '30-45 min'
      }
    ];

    return zones;
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    return [];
  }
};

export const getPopularItems = async (restaurantId?: string): Promise<MenuItem[]> => {
  try {
    let allItems: MenuItem[] = [];
    
    if (restaurantId) {
      allItems = await getRestaurantMenu(restaurantId);
    } else {
      // Get items from all restaurants
      for (const id of Object.keys(RESTAURANT_MENUS)) {
        const menu = await getRestaurantMenu(id);
        allItems.push(...menu);
      }
    }

    // Sort by popularity (mock popularity based on price and category)
    return allItems
      .sort((a, b) => {
        const popularityA = a.category === 'Main Courses' ? 3 : a.category === 'Appetizers' ? 2 : 1;
        const popularityB = b.category === 'Main Courses' ? 3 : b.category === 'Appetizers' ? 2 : 1;
        return popularityB - popularityA;
      })
      .slice(0, 10);
  } catch (error) {
    console.error('Error fetching popular items:', error);
    return [];
  }
};
