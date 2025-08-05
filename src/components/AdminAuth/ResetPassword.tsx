// ResetPassword.tsx
import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Lock, CheckCircle, XCircle } from "lucide-react";

const BASE_URL = process.env.REACT_APP_BASE_API || "";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token") || "";
  const role = searchParams.get("role") || "";

  // Tính độ mạnh mật khẩu (0-4)
  const strength = useMemo(() => {
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return Math.min(score, 4);
  }, [newPassword]);

  const strengthLabel = ["Quá ngắn", "Yếu", "Trung bình", "Khá", "Mạnh"][strength];
  const strengthColor = [
    "bg-red-200",
    "bg-red-400",
    "bg-yellow-300",
    "bg-green-300",
    "bg-green-600",
  ][strength];

  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const canSubmit = strength >= 3 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword, role }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Lỗi đổi mật khẩu");
      }
      toast.success("Đổi mật khẩu thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-yellow-300 via-yellow-100 to-white" style={{ fontFamily: '"Nunito", sans-serif' }}>
      <div className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-3xl shadow-2xl border border-yellow-400 backdrop-blur-md">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mật khẩu mới</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              />
            </div>
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-200 rounded-xl overflow-hidden">
                <div
                  className={`${strengthColor} h-full rounded-xl transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                Độ mạnh: <span className="font-semibold text-gray-800">{strengthLabel}</span>
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Xác nhận mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 rotate-45" />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              />
            </div>
            {confirmPassword && (
              <div className="flex items-center mt-2 text-sm">
                {passwordsMatch ? (
                  <> 
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-600">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-600">Mật khẩu không khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
