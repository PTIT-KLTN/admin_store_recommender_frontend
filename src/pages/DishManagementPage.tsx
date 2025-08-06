// src/pages/DishManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import DishModal from '../components/Dishes/DishModal';
import ConfirmModal from '../components/Common/ConfirmModal';
import Pagination from '../components/Common/Pagination';
import DishCard from '../components/Dishes/DishCard';
import { getDishes, deleteDish } from '../services/dishes';
import type { Dish } from '../models/dish';
import { toast } from 'react-toastify';

const DishManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const [openModal, setOpenModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  // confirm delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<Dish | null>(null);

  // initial load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await getDishes();
        setDishes(list);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Không thể tải danh sách món ăn.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // reset page khi search thay đổi
  useEffect(() => {
    setPage(0);
  }, [search]);

  // Add: clear selected và mở modal
  const handleAdd = () => {
    setSelectedDish(null);
    setOpenModal(true);
  };
  // Edit: gán món và mở modal :contentReference[oaicite:4]{index=4}
  const handleEdit = (dish: Dish) => {
    setSelectedDish(dish);
    setOpenModal(true);
  };

  // filter + phân trang
  const filtered = dishes.filter(d =>
    d.vietnamese_name.toLowerCase().includes(search.toLowerCase()) ||
    d.dish.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageItems = filtered.slice(page * pageSize, (page + 1) * pageSize);

  // Xác nhận xóa
  const openConfirm = (dish: Dish) => {
    setDishToDelete(dish);
    setIsConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!dishToDelete) return;
    try {
      await deleteDish(dishToDelete._id);
      setDishes(prev => prev.filter(d => d._id !== dishToDelete._id));
      toast.success(`Đã xóa món “${dishToDelete.vietnamese_name}”`);
    } catch (err: any) {
      toast.error(err.message || 'Xóa món thất bại');
    } finally {
      setIsConfirmOpen(false);
      setDishToDelete(null);
    }
  };
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDishToDelete(null);
  };

  return (
    <DashboardLayout>

      <div className='p-4 ms-4 mt-4'>
        <header className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý danh sách món ăn</h1>
        </header>
      </div>
      <div className="pt-2 ps-8 pe-8 pb-8">
        {/* Header */}
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Search dishes."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5 mr-2" /> Thêm món ăn
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pageItems.map(dish => (
              <DishCard
                key={dish._id}
                dish={dish}
                onEdit={() => handleEdit(dish)}
                onDelete={() => openConfirm(dish)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          hasPrevious={page > 0}
          hasNext={page < totalPages - 1}
          onPageChange={setPage}
        />

        {/* Dish Modal */}
        <DishModal
          isOpen={openModal}
          // onClose clear cả modal và selectedDish :contentReference[oaicite:5]{index=5}
          onClose={() => {
            setOpenModal(false);
            setSelectedDish(null);
          }}
          dish={selectedDish}
          onSaved={() => {
            setOpenModal(false);
            setSelectedDish(null);
            getDishes()
              .then(list => setDishes(list))
              .catch(err => {
                console.error(err);
                toast.error('Không thể tải lại danh sách sau khi lưu.');
              });
          }}
        />

        {/* Confirm Delete */}
        {isConfirmOpen && dishToDelete && (
          <ConfirmModal
            open={isConfirmOpen}
            title="Xác nhận xóa món"
            message={`Bạn chắc chắn muốn xóa món “${dishToDelete.vietnamese_name}”?`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DishManagementPage;
