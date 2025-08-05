// ForgotPasswordRequest.tsx
import React, { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_API || "";

const ForgotPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Lỗi gửi mail");
      setSent(true);
      toast.success("Liên kết đã được gửi. Kiểm tra email của bạn.");
    } catch (err: any) {
      toast.error(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-6 py-10"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="w-full max-w-md p-10 bg-white rounded-2xl border border-amber-200 shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">Quên mật khẩu</h1>
        <p className="text-center text-gray-600 mb-8">Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.</p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-amber-300 rounded-xl placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 focus:ring-4 focus:ring-amber-200 transition disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết"}
            </button>
          </form>
        ) : (
          <div className="text-center mt-10">
            <Mail className="mx-auto mb-3 w-14 h-14 text-amber-400 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Gửi thành công!</h2>
            <p className="text-gray-600">Vui lòng kiểm tra email của bạn.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a href="/login" className="text-amber-500 font-medium hover:underline">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
