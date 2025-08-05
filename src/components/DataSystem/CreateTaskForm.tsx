// src/components/DataSystem/CreateTaskForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { getStores, startCrawl } from '../../services/dataSystem';
import { Store } from '../../models/store';
import { toast } from 'react-toastify';

interface CreateCrawlTaskFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const CreateCrawlTaskForm: React.FC<CreateCrawlTaskFormProps> = ({ onSuccess, onCancel }) => {
    const [selectedChain, setSelectedChain] = useState<'WM' | 'BHX'>('WM');
    const [isStoresLoading, setIsStoresLoading] = useState(false);

    const [stores, setStores] = useState<Store[]>([]);
    const [storeId, setStoreId] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsStoresLoading(true);
        setStoreId('');
        setStores([]);

        const chains = selectedChain === 'WM'
            ? (['winmart', 'winmart+'] as const)
            : ([selectedChain] as const);

        Promise.all(chains.map(chain => getStores(chain)))
            .then(results => {
                const merged = results.flatMap(data =>
                    Array.isArray(data) ? data : (data ?? [])
                );
                setStores(merged);
            })
            .catch(() => toast.error('Không tải được danh sách cửa hàng'))
            .finally(() => setIsStoresLoading(false));
    }, [selectedChain]);


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId) {
            toast.warning('Vui lòng chọn cửa hàng');
            return;
        }
        setIsSubmitting(true);

        try {
            const params: any = { chain: selectedChain, storeId, provinceId: 0, districtId: 0, wardId: 0, concurrency: 5 };
            if (selectedChain === 'BHX') {
                const chosen = stores.find(s => s.store_id === storeId);
                if (chosen) {
                    params.provinceId = chosen.province_id || 0;
                    params.districtId = chosen.district_id || 0;
                    params.wardId = chosen.ward_id || 0;
                }
            }
            await startCrawl(params);
            toast.success('Task mới đã được khởi tạo');
            onSuccess?.();
        } catch (err: any) {
            toast.error(err.message || 'Lỗi khởi tạo Task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            // khi click ngay vào backdrop (e.target === container) thì gọi onCancel
            onClick={e => {
                if (e.target === e.currentTarget) {
                    onCancel?.();
                }
            }}
        >
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-visible">
                <header className="bg-green-600 p-4 flex justify-between items-center">
                    <h2 className="text-white text-lg font-bold">Tạo Crawl Task</h2>
                    {onCancel && (
                        <button onClick={onCancel} className="text-white hover:text-gray-200 transition">✕</button>
                    )}
                </header>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Chuỗi</label>
                        <div className="flex space-x-2">
                            {(['WM', 'BHX'] as const).map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setSelectedChain(c)}
                                    className={`flex-1 text-center py-2 rounded-lg transition ${selectedChain === c
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {c === 'WM' ? 'WinMart' : 'Bách Hóa Xanh'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6 relative" ref={dropdownRef}>
                        <label className="block text-gray-700 font-medium mb-2">Cửa hàng</label>
                        <div
                            onClick={() => setIsDropdownOpen(o => !o)}
                            className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 cursor-pointer flex justify-between items-center"
                        >
                            <span className="truncate text-gray-800">
                                {storeId
                                    ? stores.find(s => s.store_id === storeId)?.store_name
                                    : 'Chọn cửa hàng'}
                            </span>
                            <span className="text-gray-500">{isDropdownOpen ? '▲' : '▼'}</span>
                        </div>
                        {isDropdownOpen && (
                            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
                                {stores.length > 0 ? (
                                    stores.map(s => (
                                        <li
                                            key={s.store_id}
                                            onClick={() => {
                                                setStoreId(s.store_id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${storeId === s.store_id ? 'bg-green-50' : ''
                                                }`}
                                        >
                                            <p className="text-sm font-medium">{s.store_name}</p>
                                            <p className="text-xs text-gray-500">{s.store_location}</p>
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-4 py-2 text-center text-gray-500">Không có cửa hàng</li>
                                )}
                            </ul>
                        )}
                    </div>

                    <div className="flex justify-end">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="mr-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Hủy
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-2 rounded-lg text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {isSubmitting ? 'Đang tạo…' : 'Khởi tạo Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};