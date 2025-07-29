// src/pages/DishManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import DishModal from '../components/Dishes/DishModal';
import { getDishes } from '../services/dishes';
import type { Dish } from '../models/models';
import DishCard from '../components/Dishes/DishCard';

const DishManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await getDishes(); // chỉ lấy mảng dishes
        setDishes(list);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = () => {
    setSelectedDish(null);
    setOpenModal(true);
  };

  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setOpenModal(true);
  };

  // filter trên cả tên tiếng Việt và key dish
  const filtered = dishes.filter(d =>
    d.vietnamese_name.toLowerCase().includes(search.toLowerCase()) ||
    d.dish.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dish List</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Dish
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(dish => (
            <DishCard
            key={dish._id}
            dish={dish}
            onEdit={handleEdit}
            onDelete={id => console.log('delete', id)}
          />
          ))}
        </div>
      )}

      {/* Modal */}
      <DishModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        dish={selectedDish}
        onSaved={() => {
          setOpenModal(false);
          getDishes().then(setDishes);
        }}
      />
    </div>
    </DashboardLayout>
  );
};

export default DishManagementPage;
