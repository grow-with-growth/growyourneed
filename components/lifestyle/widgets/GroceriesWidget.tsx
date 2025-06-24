import React, { useState, useEffect } from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';

interface GroceryStore {
  id: string;
  name: string;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  rating: number;
  categories: string[];
  isOpen: boolean;
}

interface GroceryOrder {
  id: string;
  store: string;
  items: number;
  total: number;
  status: 'preparing' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  orderDate: string;
}

export const GroceriesWidget: React.FC = () => {
  const [stores, setStores] = useState<GroceryStore[]>([]);
  const [recentOrders, setRecentOrders] = useState<GroceryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stores' | 'orders'>('stores');

  useEffect(() => {
    const fetchGroceryData = async () => {
      try {
        setLoading(true);

        // Mock grocery stores data
        const mockStores: GroceryStore[] = [
          {
            id: '1',
            name: 'FreshMart Express',
            deliveryTime: '30-45 min',
            deliveryFee: 2.99,
            minimumOrder: 25,
            rating: 4.5,
            categories: ['Fresh Produce', 'Dairy', 'Meat', 'Pantry'],
            isOpen: true
          },
          {
            id: '2',
            name: 'Organic Valley',
            deliveryTime: '45-60 min',
            deliveryFee: 4.99,
            minimumOrder: 35,
            rating: 4.7,
            categories: ['Organic', 'Gluten-Free', 'Vegan', 'Health'],
            isOpen: true
          },
          {
            id: '3',
            name: 'QuickStop Groceries',
            deliveryTime: '20-30 min',
            deliveryFee: 1.99,
            minimumOrder: 15,
            rating: 4.2,
            categories: ['Convenience', 'Snacks', 'Beverages', 'Essentials'],
            isOpen: false
          }
        ];

        // Mock recent orders
        const mockOrders: GroceryOrder[] = [
          {
            id: 'ORD-001',
            store: 'FreshMart Express',
            items: 12,
            total: 67.45,
            status: 'out-for-delivery',
            estimatedDelivery: '25 min',
            orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            id: 'ORD-002',
            store: 'Organic Valley',
            items: 8,
            total: 89.20,
            status: 'delivered',
            estimatedDelivery: 'Delivered',
            orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];

        setStores(mockStores);
        setRecentOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching grocery data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroceryData();
  }, []);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-400';
      case 'out-for-delivery': return 'text-blue-400';
      case 'delivered': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LifeStyleDataCard
      title="Grocery Delivery"
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-400 text-xs font-semibold">
            Start Shopping
          </button>
          <button className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 text-xs font-semibold">
            View Cart
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Tab Navigation */}
        <div className="flex mb-3 bg-slate-700/30 rounded-md p-1">
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'stores'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Stores
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Orders
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'stores' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Available grocery stores</p>
                {stores.map(store => (
                  <div key={store.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-yellow-200">{store.name}</h4>
                      <div className="flex items-center gap-1">
                        {store.isOpen ? (
                          <span className="text-xs bg-green-600/50 text-green-300 px-1.5 py-0.5 rounded">
                            Open
                          </span>
                        ) : (
                          <span className="text-xs bg-red-600/50 text-red-300 px-1.5 py-0.5 rounded">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-yellow-400">{renderStars(store.rating)}</span>
                      <span className="text-slate-400">{store.deliveryTime}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-slate-300">Min order: ${store.minimumOrder}</span>
                      <span className="text-green-400">Delivery: ${store.deliveryFee}</span>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {store.categories.slice(0, 3).map(category => (
                        <span key={category} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Recent orders</p>
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-yellow-200">{order.store}</h4>
                        <span className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-300">{order.items} items</span>
                        <span className="text-green-400 font-semibold">${order.total}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">#{order.id}</span>
                        <span className="text-blue-400">{order.estimatedDelivery}</span>
                      </div>

                      <div className="text-xs text-slate-400 mt-1">
                        Ordered: {formatDate(order.orderDate)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400">
                    <p>No recent orders</p>
                    <p className="text-xs mt-1">Start shopping to see your orders here</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </LifeStyleDataCard>
  );
};
