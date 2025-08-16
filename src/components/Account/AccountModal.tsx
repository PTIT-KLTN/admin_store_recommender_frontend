import React, { useState, useEffect, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../Common/Dialog';
import { Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Account {
  email?: string;
  fullname?: string;
}

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string, fullname: string) => Promise<void>; 
  account?: Account;
}

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const isValidName = (value: string) => /^[\p{L}\s]+$/u.test(value.trim());

const validateEmail = (val: string) => {
  if (!val.trim()) return 'Email là bắt buộc';
  if (!isValidEmail(val)) return 'Email không hợp lệ (ví dụ: ten@domain.com)';
  return '';
};

const validateName = (val: string) => {
  const t = val.trim();
  if (!t) return 'Họ và tên là bắt buộc';
  if (!isValidName(t)) return 'Tên chỉ được chứa chữ cái và khoảng trắng';
  return '';
};

const toTitleCaseVi = (val: string) =>
  val
    .trim()
    .split(/\s+/)
    .map(w =>
      w.length
        ? w.charAt(0).toLocaleUpperCase('vi') + w.slice(1).toLocaleLowerCase('vi')
        : w
    )
    .join(' ');

// Kéo message thật từ cả axios hoặc fetch Response
async function getApiErrorMessage(err: any): Promise<string> {
  try {

    if (err?.response?.data) {
      const data = err.response.data;
      return data.message || data.detail || JSON.stringify(data);
    }

    if (typeof Response !== 'undefined' && err instanceof Response) {
      const data = await err.json().catch(() => null);
      if (data && (data.message || data.detail)) return data.message || data.detail;
      return `${err.status} ${err.statusText}`.trim();
    }
  } catch {

  }
  return err?.message || 'Đã có lỗi xảy ra';
}

const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSave, account }) => {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (account) {
      setEmail(account.email || '');
      setFullname(account.fullname || '');
    } else {
      setEmail('');
      setFullname('');
    }
    setEmailTouched(false);
    setEmailError('');
    setNameTouched(false);
    setNameError('');
  }, [account, isOpen]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailTouched) setEmailError(validateEmail(val));
  };

  const handleNameChange = (val: string) => {
    setFullname(val);
    if (nameTouched) setNameError(validateName(val));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const nErr = validateName(fullname);

    setEmailTouched(true);
    setNameTouched(true);
    setEmailError(eErr);
    setNameError(nErr);

    if (eErr || nErr) {
      toast.error(eErr || nErr);
      return; // KHÔNG đóng modal
    }

    const normalizedFullname = toTitleCaseVi(fullname);

    setLoading(true);
    try {
      await onSave(email.trim(), normalizedFullname);
      toast.success('Lưu tài khoản thành công');
      setTimeout(() => onClose(), 100);
    } catch (err: any) {
      const msg = await getApiErrorMessage(err);
      console.error(err);
      toast.error(msg); 
    } finally {
      setLoading(false);
    }
  };

  const emailInputClasses = `
    w-full px-6 py-3 border rounded-xl focus:outline-none
    ${emailError ? 'border-red-500 focus:ring-4 focus:ring-red-200' : 'border-gray-300 focus:ring-4 focus:ring-green-300'}
  `;

  const nameInputClasses = `
    w-full px-6 py-3 border rounded-xl focus:outline-none
    ${nameError ? 'border-red-500 focus:ring-4 focus:ring-red-200' : 'border-gray-300 focus:ring-4 focus:ring-green-300'}
  `;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <ToastContainer position="top-right" />

      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="bg-white rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>
              {account ? 'Chỉnh sửa Tài khoản' : 'Thêm Tài khoản'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-3 text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                className={emailInputClasses}
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                onBlur={() => {
                  setEmailTouched(true);
                  setEmailError(validateEmail(email));
                }}
                placeholder="ten@domain.com"
                aria-invalid={!!emailError}
                aria-describedby="email-error"
                required
              />
              {emailError && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            {/* Fullname */}
            <div>
              <label htmlFor="fullname" className="block mb-3 text-lg font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                id="fullname"
                type="text"
                autoComplete="name"
                className={nameInputClasses}
                value={fullname}
                onChange={e => handleNameChange(e.target.value)}
                onBlur={() => {
                  setNameTouched(true);
                  const err = validateName(fullname);
                  setNameError(err);
                  if (!err) setFullname(toTitleCaseVi(fullname)); // chuẩn hóa ngay khi hợp lệ
                }}
                placeholder="Ví dụ: Nguyễn Văn A"
                aria-invalid={!!nameError}
                aria-describedby="name-error"
                required
              />
              {nameError && (
                <p id="name-error" className="mt-2 text-sm text-red-600">
                  {nameError}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Chỉ cho phép chữ cái và khoảng trắng; ví dụ hợp lệ: "Nguyễn Văn A".
              </p>
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
                disabled={loading || !!emailError || !!nameError || !email.trim() || !fullname.trim()}
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
