import React, { useState, useEffect } from 'react';
import { LifeStyleDataCard } from '../LifeStyleDataCard';
import { searchRestaurants, Restaurant } from '../../../services/lifestyleService';
import { getPopularItems, MenuItem } from '../../../services/foodDeliveryService';

export const DiningWidget: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'delivery'>('restaurants');

  useEffect(() => {
    const fetchDiningData = async () => {
      try {
        setLoading(true);
        const [restaurantData, popularData] = await Promise.all([
          searchRestaurants('campus area'),
          getPopularItems()
        ]);
        setRestaurants(restaurantData.slice(0, 3));
        setPopularItems(popularData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dining data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiningData();
  }, []);

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const renderPriceLevel = (level: number) => {
    return '$'.repeat(level) + '·'.repeat(4 - level);
  };

  return (
    <LifeStyleDataCard
      title="Dining Services"
      footer={
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-yellow-500 text-slate-900 rounded-md hover:bg-yellow-400 text-xs font-semibold">
            View All Restaurants
          </button>
          <button className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-400 text-xs font-semibold">
            Order Delivery
          </button>
        </div>
      }
    >
      <div className="text-sm">
        {/* Tab Navigation */}
        <div className="flex mb-3 bg-slate-700/30 rounded-md p-1">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'restaurants'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-colors ${
              activeTab === 'delivery'
                ? 'bg-yellow-500 text-slate-900'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Delivery
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'restaurants' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Nearby restaurants and dining options</p>
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-yellow-200">{restaurant.name}</h4>
                      <span className="text-xs text-slate-400">{restaurant.distance}km</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300">{restaurant.cuisine}</span>
                      <span className="text-yellow-400">{renderStars(restaurant.rating)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-slate-400">{renderPriceLevel(restaurant.priceLevel)}</span>
                      <span className="text-green-400">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {restaurant.features.slice(0, 3).map(feature => (
                        <span key={feature} className="px-1.5 py-0.5 bg-slate-600/50 rounded text-xs text-slate-300">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-2">
                <p className="text-slate-400 mb-2">Popular items for delivery</p>
                {popularItems.map(item => (
                  <div key={item.id} className="p-2 bg-slate-700/50 rounded-md hover:bg-slate-700/70 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-yellow-200">{item.name}</h4>
                      <span className="text-green-400 font-semibold">${item.price}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{item.description.substring(0, 60)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">{item.category}</span>
                      <span className="text-xs text-slate-400">{item.preparationTime} min</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.isVegetarian && (
                        <span className="px-1.5 py-0.5 bg-green-600/50 rounded text-xs text-green-300">Vegetarian</span>
                      )}
                      {item.isVegan && (
                        <span className="px-1.5 py-0.5 bg-green-600/50 rounded text-xs text-green-300">Vegan</span>
                      )}
                      {item.isGlutenFree && (
                        <span className="px-1.5 py-0.5 bg-blue-600/50 rounded text-xs text-blue-300">Gluten-Free</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </LifeStyleDataCard>
  );
};
