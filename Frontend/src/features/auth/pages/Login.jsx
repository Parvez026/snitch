import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─── Shared input class ────────────────────────────────────────────── */
const inputCls =
  "w-full h-12 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition duration-200";

const labelCls =
  "block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        // Fallback demo redirect if server isn't running
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:h-screen bg-[#FAFAF8] text-stone-800 flex flex-col lg:flex-row overflow-x-hidden font-sans">
      {/* ── LEFT HALF: Minimal Form Container ───────────────────────── */}
      <div className="w-full lg:w-1/2 min-h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-14 xl:px-20 py-12 lg:py-8 overflow-y-auto bg-[#FAFAF8] order-2 lg:order-1">
        <div className="w-full max-w-[380px] my-auto">
          {/* Mobile brand mark */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="font-syne text-xl font-extrabold tracking-[0.28em] text-stone-900">
              SNITCH
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          </div>

          {/* Header */}
          <div className="mb-7">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400 block mb-2.5">
              Member Portal
            </span>
            <h1 className="font-syne text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Sign In
            </h1>
            <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
              Enter your credentials to access your Snitch account.
            </p>
          </div>

          {/* Hairline */}
          <div className="h-px w-full bg-stone-200 mb-6" />

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
            {/* Field 1: Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={inputCls}
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls.replace("mb-1.5", "")}>Password</label>
                <a
                  href="#forgot"
                  className="text-[11px] text-stone-400 hover:text-stone-700 transition"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`${inputCls} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 text-[11px] font-semibold text-stone-400 hover:text-stone-700 transition cursor-pointer select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-700 text-white font-syne font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-[11px] text-stone-400 font-medium">or continue with</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <ContinueWithGoogle />
          </form>

          {/* Footer Notice */}
          <div className="mt-7 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <span>
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-stone-700 hover:text-stone-900 font-semibold underline underline-offset-2 transition"
              >
                Create Account
              </Link>
            </span>
            <span>&copy; {new Date().getFullYear()} Snitch</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT HALF: Full-Height Aesthetic Editorial Image ─────────── */}
      <div className="hidden lg:flex relative w-1/2 h-full flex-shrink-0 bg-stone-100 overflow-hidden order-1 lg:order-2">
        <img
          src="/snitch_editorial_man.jpg"
          alt="Snitch Luxury Member Portal"
          className="w-full h-full object-cover object-center"
        />

        {/* Subtle gradient overlays for seamless light integration */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#FAFAF8]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Brand Tag Top-Right */}
        <div className="absolute top-10 right-10 z-10 flex items-center gap-2.5">
          <span className="font-syne text-2xl font-extrabold tracking-[0.28em] text-white drop-shadow-sm">
            SNITCH
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-10 left-10 right-10 z-10 max-w-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-stone-300 font-semibold block mb-1">
            Exclusive Member Portal
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-bold text-white leading-snug drop-shadow-sm">
            Welcome Back to Snitch
          </h2>
          <p className="text-stone-200 text-xs mt-2 leading-relaxed hidden sm:block">
            Access your wardrobe orders, saved styles, and tailored member drops.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
