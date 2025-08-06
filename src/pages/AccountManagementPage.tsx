import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Plus, Search, Edit, UserX2, ChevronsUpDown } from 'lucide-react';
import {
  getAccounts,
  createAccount,
  updateAccount,
  toggleAccountEnabled
} from '../services/account';
import { Pagination } from '../models/pagination';
import { Account } from '../models/account';
import AccountModal from '../components/Account/AccountModal';
import { toast } from 'react-toastify';
import ConfirmModal from '../components/Common/ConfirmModal';


const AccountManagementPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Account>('fullname');
  const [sortAsc, setSortAsc] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account | undefined>(undefined);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accountToToggle, setAccountToToggle] = useState<Account | null>(null);

  useEffect(() => {
    load(currentPage);
  }, [currentPage, search, sortField, sortAsc]);

  const load = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAccounts(page, pageSize, search, sortField, sortAsc);
      setAccounts(response.admins);
      setCurrentPage(response.pagination.currentPage);
      setTotalPages(response.pagination.totalPages);
      setHasPrevious(response.pagination.hasPrevious);
      setHasNext(response.pagination.hasNext);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Không thể tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const onSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(0);
  };

  const toggleSort = (field: keyof Account) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
    setCurrentPage(0);
  };

  const openNew = () => { setActiveAccount(undefined); setModalOpen(true); };
  const openEdit = (acc: Account) => { setActiveAccount(acc); setModalOpen(true); };

  const handleSave = async (email: string, fullname: string) => {
    try {
      if (activeAccount) {
        await updateAccount(activeAccount.id, email, fullname);
      } else {
        await createAccount(email, fullname);
      }
      toast.success('Lưu thành công');
      setModalOpen(false);
      load(0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Lưu thất bại');
    }
  };

  const handleToggleClick = (acc: Account) => {
    if (acc.is_enabled) {
      setAccountToToggle(acc);
      setConfirmOpen(true);
    } else {
      executeToggle(acc);
    }
  };

  const executeToggle = async (acc: Account) => {
    try {
      await toggleAccountEnabled(acc.id, !acc.is_enabled);
      toast.success(`Tài khoản “${acc.email}” đã ${acc.is_enabled ? 'vô hiệu hóa' : 'kích hoạt'} thành công`);
      load(currentPage);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Thao tác thất bại');
    }
  };

  const SortableTh: React.FC<{ label: string; field: keyof Account }> = ({ label, field }) => (
    <th
      onClick={() => toggleSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
    >
      <div className="inline-flex items-center space-x-1">
        <span>{label}</span>
        <ChevronsUpDown
          className={`w-4 h-4 transition-transform ${sortField === field ? (sortAsc ? 'rotate-180' : '') : 'opacity-30'}`}
        />
      </div>
    </th>
  );

  return (
    <DashboardLayout>
      <div className='p-4 ms-4 mt-4'>
        <header className="pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý tài khoản admin</h1>
        </header>
      </div>
      <div className="p-8 rounded-lg shadow-sm">
        <div className="flex justify-end items-end mb-6">
          <button
            onClick={openNew}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
          >
            <Plus className="w-5 h-5 mr-2" /> Thêm tài khoản
          </button>
        </div>


        <div className="mb-4 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Tìm kiếm theo tên, email..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-100">
              <tr>
                <SortableTh label="Họ và tên" field="fullname" />
                <SortableTh label="Email" field="email" />
                <SortableTh label="Vai trò" field="role" />
                <SortableTh label="Trạng thái" field="is_enabled" />
                <SortableTh label="Ngày tạo" field="created_at" />
                <SortableTh label="Cập nhật" field="updated_at" />
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : (
                accounts.map(acc => (
                  <tr
                    key={acc.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="px-4 py-3 text-gray-700">{acc.fullname}</td>
                    <td className="px-4 py-3 text-gray-600 truncate" title={acc.email}>{acc.email}</td>
                    <td className="px-4 py-3 text-gray-700">{acc.role}</td>
                    <td className="px-4 py-3">
                      {acc.is_enabled ? (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">Kích hoạt</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">Vô hiệu</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(acc.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(acc.updated_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => openEdit(acc)}
                        className="p-2 hover:bg-gray-100 rounded transition text-gray-600 hover:text-gray-800"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleToggleClick(acc)}
                        className="p-2 hover:bg-gray-100 rounded transition text-gray-600 hover:text-gray-800"
                        title={acc.is_enabled ? 'Vô hiệu hoá' : 'Kích hoạt'}
                      >
                        <UserX2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={!hasPrevious}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Trước</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`px-3 py-1 border rounded ${currentPage === i ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
            >{i + 1}</button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={!hasNext}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Tiếp</button>
        </div>

        <AccountModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          account={activeAccount}
        />
      </div>

      {accountToToggle && (
        <ConfirmModal
          open={confirmOpen}
          title="Xác nhận vô hiệu hóa"
          message={`Bạn có chắc chắn muốn vô hiệu hóa tài khoản “${accountToToggle.email}” không?`}
          onConfirm={() => {
            setConfirmOpen(false);
            executeToggle(accountToToggle);
            setAccountToToggle(null);
          }}
          onCancel={() => {
            setConfirmOpen(false);
            setAccountToToggle(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default AccountManagementPage;
