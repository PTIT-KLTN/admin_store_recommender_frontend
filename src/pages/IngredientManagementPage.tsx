import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import IngredientCard from '../components/Ingredients/IngredientCard';
import IngredientModal from '../components/Ingredients/IngredientModal';
import Pagination from '../components/Common/Pagination';
import {
    getIngredients,
    deleteIngredient as deleteIngredientService,
    getCategories
} from '../services/ingredients';
import { FullPageSpinner } from '../components/Common/FullPageSpinner';
import { toast } from 'react-toastify';
import { Ingredient } from '../models/dish';
import { Pagination as PaginationType } from '../models/pagination';
import ConfirmModal from '../components/Common/ConfirmModal';

const IngredientManagementPage: React.FC = () => {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [pagination, setPagination] = useState<PaginationType>({
        currentPage: 0,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: 0,
        totalElements: 0,
    });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Ingredient | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null);

    // Fetch ingredients
    const loadIngredients = () => {
        setLoading(true);
        getIngredients(page, selectedCategory, 20, searchQuery)
            .then(res => {
                setIngredients(res.ingredients);
                setPagination(res.pagination);
            })
            .catch(err => {
                console.error(err);
                toast.error('Không thể tải danh sách nguyên liệu.');
            })
            .finally(() => setLoading(false));
    };

    // Fetch categories
    const loadCategories = () => {
        getCategories()
            .then(list => setCategories(['All', ...list]))
            .catch(err => {
                console.error(err);
                toast.error('Không thể tải danh mục.');
            });
    };

    useEffect(() => {
        setPage(prev => prev);
        loadIngredients();
        loadCategories();
    }, [page, selectedCategory, searchQuery]);

    // Delete handler
    const handleDelete = async () => {
        if (!deletingIngredient) return;

        try {
            const result = await deleteIngredientService(deletingIngredient._id);
            toast.success('Xóa thành công!');
            await loadIngredients();
        } catch (err: any) {
            console.error('Delete error:', err);
            const msg = err.message || 'Xóa thất bại.';
            toast.error(msg);
        } finally {
            setConfirmOpen(false);
            setDeletingIngredient(null);
        }
    };


    if (loading) return <FullPageSpinner />;

    return (
        <DashboardLayout>
            <div className='p-4 ms-4 mt-4'>
                <header className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý danh sách nguyên liệu</h1>
                </header>
            </div>
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
                            />

                            <button
                                onClick={() => {
                                    setPage(0);
                                    setSearchQuery(searchInput);
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300"
                            >
                                <Search className="w-5 h-5 text-white" />
                            </button>
                        </div>


                        <button
                            onClick={() => { setEditing(null); setModalOpen(true); }}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Thêm nguyên liệu
                        </button>
                    </div>
                </div>

                {/* Category Scroll */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-200">
                    <div className="flex space-x-4 pb-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setPage(0); }}
                                className={`whitespace-nowrap px-5 py-2 rounded-lg border transition-colors
                                        ${selectedCategory === cat
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            >
                                {cat}
                            </button>

                        ))}
                    </div>
                </div>

                {/* Ingredient Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {ingredients.map(ing => (
                        <IngredientCard
                            key={ing._id}
                            ingredient={ing}
                            onEdit={i => { setEditing(i); setModalOpen(true); }}
                            onDelete={() => {
                                setDeletingIngredient(ing);
                                setConfirmOpen(true);
                            }}
                        />
                    ))}
                </div>

                {/* New Pagination Component */}
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages ?? 1}
                    hasPrevious={pagination.hasPrevious}
                    hasNext={pagination.hasNext}
                    onPageChange={p => setPage(Number(p))}
                />

                {/* Modal */}
                <IngredientModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { toast.success(editing ? 'Cập nhật thành công!' : 'Thêm thành công!'); loadIngredients(); }}
                    initialData={editing}
                />

                { /* Confirm Modal */}
                <ConfirmModal
                    open={confirmOpen}
                    title="Xác nhận xóa"
                    message={`Bạn có chắc chắn muốn xóa nguyên liệu "${deletingIngredient?.name}" không?`}
                    onConfirm={handleDelete}
                    onCancel={() => {
                        setConfirmOpen(false);
                        setDeletingIngredient(null);
                    }}
                />
            </div>
        </DashboardLayout >
    );
};

export default IngredientManagementPage;
