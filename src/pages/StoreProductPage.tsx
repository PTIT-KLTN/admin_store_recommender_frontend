import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    getStoreProducts,
    getStoreCategories,
    getStoreStats,
    Product,
    ProductsResponse,
    CategoriesResponse,
    StatsResponse
} from '../services/product';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { FullPageSpinner } from '../components/Common/FullPageSpinner';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Filters { page?: number; size?: number; category?: string; search?: string; chain?: string; min_price?: number; max_price?: number; }

const fmtCurrency = (v?: number) =>
    v != null
        ? v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        : '—';
const fmtDate = (iso: string) => new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

const renderChainLabel = (chain: string) => {
    const base = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
    if (chain.toLowerCase() === 'bhx') return <span className={`${base} bg-green-100 text-green-800`}>BHX</span>;
    if (chain.toLowerCase() === 'wm') return <span className={`${base} bg-blue-100 text-blue-800`}>Winmart</span>;
    return <span className={`${base} bg-gray-100 text-gray-600`}>{chain}</span>;
};

const StoreProductsPage: React.FC = () => {
    const { store_id } = useParams<{ store_id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
    const navigate = useNavigate();

    const statsQuery = useQuery<StatsResponse, Error>({ queryKey: ['stats', store_id], queryFn: () => getStoreStats(store_id!), enabled: !!store_id });
    const categoriesQuery = useQuery<CategoriesResponse, Error>({ queryKey: ['categories', store_id], queryFn: () => getStoreCategories(store_id!), enabled: !!store_id });
    const productsQuery = useQuery<ProductsResponse, Error>({
        queryKey: ['products', store_id, searchParams.toString()],
        queryFn: () => getStoreProducts(store_id!, {
            page: Number(searchParams.get('page') || 0),
            size: Number(searchParams.get('size') || 10),
            category: searchParams.get('category') || undefined,
            search: searchParams.get('search') || undefined,
            min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
            max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined
        }),
        enabled: !!store_id
    });

    const { data: stats, isLoading: statsLoading, error: statsError } = statsQuery;
    const { data: catsData, isLoading: catsLoading, error: catsError } = categoriesQuery;
    const { data: prodData, isLoading: prodLoading, isFetching: prodFetching, error: prodError } = productsQuery;

    const { pathname } = useLocation()
    const match = pathname.match(/\/store\/(\d+)/)
    const storeId = match ? match[1] : ''

    useEffect(() => {
        if (storeId) {
            document.title = `Sản phẩm của cửa hàng ${storeId}`
        }
    }, [storeId])

    useEffect(() => { if (statsError || catsError || prodError) toast.error('Lỗi tải dữ liệu, vui lòng thử lại.'); }, [statsError, catsError, prodError]);

    const chartData = useMemo(() => {
        return (
            stats?.categories
                .map(c => ({ name: c.category, count: c.product_count }))
                .sort((a, b) => b.count - a.count)
            ?? []
        );
    }, [stats]);

    if (statsLoading || catsLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-600" />
                </div>
            </DashboardLayout>
        );
    }
    if (!stats || !catsData || !prodData) return null;

    const { pagination, products } = prodData;

    const applyFilter = (f: Filters) => {
        const qp = new URLSearchParams();
        // Gộp page, size, tất cả params hiện tại và các filter mới
        const merged = {
            page: 0,
            size: pagination.page_size ?? pagination.total_elements,
            ...Object.fromEntries(searchParams.entries()),
            ...f,
        } as Record<string, any>;

        Object.entries(merged).forEach(([k, v]) => {
            if (v !== undefined && v !== '') qp.set(k, String(v));
        });
        setSearchParams(qp);
    };


    const handleReset = () => {
        setSearchTerm('');
        setSearchParams(new URLSearchParams());
    };

    const exportCSV = async () => {
        try {
            const all = await getStoreProducts(store_id!, { ...Object.fromEntries(searchParams.entries()), page: 0, size: pagination.total_elements } as any);
            const rows = all.products.map(p => ({ _id: p._id, name: p.name, category: p.category, price: p.price, unit: `${p.net_unit_value}${p.unit}`, sku: p.sku }));
            const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
            const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `store_${store_id}_products.csv`; a.click();
        } catch { toast.error('Xuất CSV thất bại.'); }
    };

    return (
        <DashboardLayout>
            <div className='p-4 ms-4 mt-4'>
                <header className="pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Cửa hàng #{storeId}</h1>
                </header>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="pt-2 ps-8 pe-8 pb-8 space-y-6">
                {/* Nút trở về trang quản lý dữ liệu */}
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/data-system')}
                        className="
                                    inline-flex items-center 
                                    px-4 py-2 
                                    text-green-600 font-medium 
                                    bg-white 
                                    border-2 border-green-200 
                                    rounded-full 
                                    shadow-sm 
                                    hover:bg-green-50 
                                    focus:outline-none focus:ring-2 focus:ring-green-200 
                                    transition duration-150 ease-in-out
                                "
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" /> Trở về quản lý dữ liệu
                    </button>

                </div>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tổng sản phẩm */}
                    <div className="
                                    bg-white p-6
                                    border-l-4 border-green-500
                                    rounded-lg
                                    shadow-sm
                                    hover:shadow-md
                                    transform hover:-translate-y-0.5
                                    transition-all duration-150
                                    ">
                        <div className="text-sm font-medium text-gray-500 uppercase">Tổng sản phẩm</div>
                        <div className="mt-2 text-2xl font-semibold text-gray-800">{pagination.total_elements}</div>
                    </div>

                    {/* Tổng danh mục */}
                    <div className="
                                    bg-white p-6
                                    border-l-4 border-blue-500
                                    rounded-lg
                                    shadow-sm
                                    hover:shadow-md
                                    transform hover:-translate-y-0.5
                                    transition-all duration-150
                                    ">
                        <div className="text-sm font-medium text-gray-500 uppercase">Tổng danh mục</div>
                        <div className="mt-2 text-2xl font-semibold text-gray-800">{stats.total_categories}</div>
                    </div>

                    {/* Giá trung bình */}
                    <div className="
                                    bg-white p-6
                                    border-l-4 border-purple-500
                                    rounded-lg
                                    shadow-sm
                                    hover:shadow-md
                                    transform hover:-translate-y-0.5
                                    transition-all duration-150
                                    ">
                        <div className="text-sm font-medium text-gray-500 uppercase">Giá trung bình</div>
                        <div className="mt-2 text-2xl font-semibold text-gray-800">{fmtCurrency(stats.price_range.avg_price)}</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h4 className="text-gray-700 font-semibold mb-4">Phân bố sản phẩm theo danh mục</h4>
                    <ResponsiveContainer width="100%" height={250}><BarChart data={chartData} barCategoryGap="15%" barSize={40}><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="count" fill="#10B981" /></BarChart></ResponsiveContainer>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {/* Search */}
                    <div className="flex flex-col sm:col-span-2 lg:col-span-1">
                        <label className="mb-1 text-sm font-medium text-gray-600">Tìm kiếm</label>
                        <div className="flex">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Tên sản phẩm hoặc chuỗi" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col"><label className="mb-1 text-sm font-medium text-gray-600">Danh mục</label><select value={searchParams.get('category') || ''} onChange={e => applyFilter({ category: e.target.value || undefined, page: 0 })} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"><option value="">Tất cả danh mục</option>{catsData.categories.map(c => (<option key={c.category} value={c.category}>{c.category}</option>))}</select></div>

                    {/* Price Range */}
                    <div className="flex space-x-4">
                        <div className="flex-1 flex flex-col"><label className="mb-1 text-sm font-medium text-gray-600">Giá từ</label><input type="number" placeholder="Min" value={searchParams.get('min_price') || ''} onChange={e => applyFilter({ min_price: e.target.value ? Number(e.target.value) : undefined, page: 0 })} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" /></div>
                        <div className="flex-1 flex flex-col"><label className="mb-1 text-sm font-medium text-gray-600">Giá đến</label><input type="number" placeholder="Max" value={searchParams.get('max_price') || ''} onChange={e => applyFilter({ max_price: e.target.value ? Number(e.target.value) : undefined, page: 0 })} className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" /></div>
                    </div>
                    <div className='flex justify-content text-end'>
                        <button
                            onClick={() => applyFilter({ search: searchTerm, page: 0 })}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                            Tìm
                        </button>
                        <button
                            onClick={handleReset}
                            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white p-6 rounded-2xl shadow overflow-auto">
                    {(prodLoading || prodFetching) ? (
                        <div className="flex justify-center items-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-4 border-green-600" /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left text-ms font-medium text-gray-800 uppercase">Ảnh</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 uppercase">Tên</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 uppercase">Mã vạch</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 uppercase">Chuỗi</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 uppercase">Danh mục</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-800 uppercase">Giá</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-800 uppercase">Đơn vị</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-800 uppercase">Khuyến mãi</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-800 uppercase">Crawled</th></tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">{products.map((p: Product) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2"><img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover" /></td>
                                    <td className="px-4 py-2"><div className="font-medium text-gray-800">{p.name}
                                    </div>
                                        <div className="text-xs text-gray-500">{p.name_en}</div>
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{p.sku}</td>
                                    <td className="px-4 py-2">{renderChainLabel(p.chain)}</td>
                                    <td className="px-4 py-2 text-gray-700">{p.category}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-green-600 font-semibold">{fmtCurrency(p.price)}</span>
                                            {p.discount_percent > 0 &&
                                                <span className="px-1 text-xs bg-red-100 text-red-600 rounded">-{p.discount_percent}%</span>}
                                        </div>
                                        {p.discount_percent > 0 &&
                                            <div className="text-xs text-gray-400 line-through">{fmtCurrency(p.sys_price)}</div>}
                                    </td>
                                    <td className="px-4 py-2 text-center text-gray-700">{p.unit}</td>
                                    <td className="px-4 py-2 text-center">{p.promotion ?
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">{p.promotion}</span>
                                        : <span className="text-gray-400 text-xs">—</span>}
                                    </td>
                                    <td className="px-4 py-2 text-center text-xs text-gray-500">{fmtDate(p.crawled_at)}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-4 text-right"><button onClick={exportCSV} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">Xuất CSV</button></div>
                    <div className="flex justify-center items-center space-x-4 mt-6"><button onClick={() => applyFilter({ page: pagination.current_page - 1 })} disabled={!pagination.has_previous} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"><ChevronLeft /></button><span>Trang {pagination.current_page + 1} / {pagination.total_pages}</span><button onClick={() => applyFilter({ page: pagination.current_page + 1 })} disabled={!pagination.has_next} className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"><ChevronRight /></button></div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StoreProductsPage;
