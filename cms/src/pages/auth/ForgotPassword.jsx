import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage("لینک بازیابی رمز عبور به ایمیل شما ارسال شد");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-navy font-bold text-2xl">د</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">بازیابی رمز عبور</h1>
          <p className="text-gray-500 mt-1">ایمیل خود را وارد کنید</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {message && (
              <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-200">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gold focus:border-gold outline-none transition"
                placeholder="example@email.com"
                required
                dir="ltr"
                style={{ textAlign: "left" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-navy py-2.5 rounded-lg text-sm font-medium hover:bg-gold-hover focus:ring-2 focus:ring-gold focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ارسال..." : "ارسال لینک بازیابی"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-gold hover:text-gold-hover text-sm font-medium"
            >
              بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
