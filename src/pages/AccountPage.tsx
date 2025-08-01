import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Admin } from '../models/admin';
import { updateAdminProfile } from '../services/auth';
import { toast } from 'react-toastify';
import { User, Key } from 'lucide-react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';

const AccountPage: React.FC = () => {
    const { user } = useContext(AuthContext)! as { user: Admin | null };

    // 1) Hooks must always run in same order, before any early return:
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (user) {
        setUsername(user.username);
        setFullname(user.fullname);
      }
    }, [user]);

    // 2) After hooks, guard on `user`:
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          {/* Your spinner or loading text */}
        </div>
      );
    }

    // 3) Now it's safe to read `user` properties:
    const isSuperAdmin = user.role === 'SUPER_ADMIN';

    const handleSave = async () => {
        setLoading(true);
        try {
            const updated = await updateAdminProfile(user.id, { username, fullname });
            localStorage.setItem('admin_user', JSON.stringify(updated));
            toast.success('Thông tin đã được cập nhật.');
            setEditing(false);
            window.location.reload();
        } catch (err: any) {
            toast.error(err.message || 'Cập nhật thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Profile Panel */}
                    <div className="bg-gradient-to-br from-green-600 to-green-400 rounded-2xl p-6 text-center text-white shadow-inner">
                        <div className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center text-5xl text-blue-600 shadow-md">
                            {user.fullname.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="mt-4 text-2xl font-bold">{user.fullname}</h3>
                        <p className="mt-1 uppercase tracking-wide text-blue-200 font-medium">{user.role.replace('_', ' ')}</p>
                        {isSuperAdmin && (
                            <button
                                onClick={() => setEditing(!editing)}
                                className="mt-6 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-gray-100 transition"
                            >
                                <User className="mr-2" size={16} />
                                {editing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
                            </button>
                        )}
                    </div>

                    {/* Info Form */}
                    <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chi tiết tài khoản</h2>
                        <div className="space-y-6">
                            <div className="relative">
                                <label className="block text-gray-600 mb-1">Username</label>
                                <div className="flex items-center border-b-2 border-gray-300 focus-within:border-green-500 transition">
                                    <User className="text-gray-400 mx-3" size={18} />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        disabled={!isSuperAdmin || !editing}
                                        className={`w-full px-2 py-2 bg-transparent focus:outline-none transition
                    ${!isSuperAdmin || !editing ? 'text-gray-500 cursor-not-allowed' : 'text-gray-800'}`}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-600 mb-1">Họ và tên</label>
                                <div className="flex items-center border-b-2 border-gray-300 focus-within:border-green-500 transition">
                                    <User className="text-gray-400 mx-3" size={18} />
                                    <input
                                        type="text"
                                        value={fullname}
                                        onChange={e => setFullname(e.target.value)}
                                        disabled={!isSuperAdmin || !editing}
                                        className={`w-full px-2 py-2 bg-transparent focus:outline-none transition
                    ${!isSuperAdmin || !editing ? 'text-gray-500 cursor-not-allowed' : 'text-gray-800'}`}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-gray-600 mb-1">Vai trò</label>
                                <div className="flex items-center border-b-2 border-gray-300 bg-gray-100 cursor-not-allowed">
                                    <Key className="text-gray-400 mx-3" size={18} />
                                    <input
                                        type="text"
                                        value={user.role.replace('_', ' ')}
                                        disabled
                                        className="w-full px-2 py-2 bg-transparent focus:outline-none text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {isSuperAdmin && editing && (
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AccountPage;
