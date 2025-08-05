// src/components/AdminAuth/Login.tsx
import React, { useState, FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import loginImage from '../../assets/images/login.jpg';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';


export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const { signIn } = useContext(AuthContext)!;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/account', { state: { success: true } });
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-200 to-green-50 p-6">
            {/* Decorative Blobs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000" />

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex overflow-hidden">
                {/* Illustration */}
                <div
                    className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: `url(${loginImage})` }}
                />

                {/* Form */}
                <div className="w-full lg:w-1/2 p-10">
                    <h2 className="text-4xl font-extrabold text-green-600 mb-6">Welcome back!</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">Tên đăng nhập</label>
                            <div className="relative">
                                <EnvelopeIcon className="w-5 h-5 text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-green-200 bg-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <LockClosedIcon className="w-5 h-5 text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-green-200 bg-green-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                    w-full flex items-center justify-center
                                    py-3 px-6
                                    bg-gradient-to-r from-green-400 to-green-600
                                    hover:from-green-500 hover:to-green-700
                                    text-white font-semibold
                                    rounded-lg shadow-lg
                                    transform hover:scale-105
                                    transition duration-300
                                    focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50
                                disabled:opacity-50 disabled:cursor-not-allowed
                                "
                                >
                            {loading && (
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                            )}
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                    </form>

                    <div className="mt-4 text-right">
                        <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
