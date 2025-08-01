// src/components/Account/AccountModal.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../Common/Dialog';
import { Save } from 'lucide-react';
import { Account } from '../../models/account';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (username: string, fullname: string) => Promise<void>;
  account?: Account;
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setUsername(account.username || '');
      setFullname(account.fullname);
    } else {
      setUsername('');
      setFullname('');
    }
  }, [account, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(username.trim(), fullname.trim());
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {account ? 'Chỉnh sửa Tài khoản' : 'Thêm Tài khoản'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div>
              <label htmlFor="username" className="block mb-3 text-lg font-medium text-gray-700">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div>
              <label htmlFor="fullname" className="block mb-3 text-lg font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                id="fullname"
                type="text"
                className="w-full px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-300"
                value={fullname}
                onChange={e => setFullname(e.target.value)}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition text-base font-medium"
                disabled={loading}
              >
                Hủy
              </button>

              <button
                type="submit"
                className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-base font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-6 w-6 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  <Save className="w-6 h-6 mr-3" />
                )}
                Lưu (Admin)
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountModal;
