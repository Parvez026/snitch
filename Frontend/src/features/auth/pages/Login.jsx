import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

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
    <div className="w-full min-h-screen lg:h-screen bg-[#0b0c10] text-[#e3e2e8] flex flex-col lg:flex-row overflow-x-hidden font-sans">
      {/* LEFT HALF: Full-Height Edge-to-Edge Desktop Image */}
      <div className="hidden lg:block relative w-full lg:w-1/2 h-72 sm:h-96 lg:h-full flex-shrink-0 bg-black overflow-hidden">
        <img
          src="/snitch-hero.jpg"
          alt="Snitch Luxury Apparel"
          className="w-full h-full object-cover object-center scale-[0.99]"
        />

        {/* Ambient Gradient Overlays for Seamless Dark Integration */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-[#0b0c10]" />

        {/* Brand Tag Top-Left */}
        <div className="absolute top-6 left-6 lg:top-12 lg:left-12 z-10 flex items-center gap-3">
          <span className="font-syne text-2xl lg:text-3xl font-extrabold tracking-[0.28em] text-white drop-shadow-md">
            SNITCH
          </span>
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12 z-10 max-w-lg">
          <span className="font-syne text-[11px] uppercase tracking-[0.24em] text-amber-400 font-bold block mb-1">
            Exclusive Member Portal
          </span>
          <h2 className="font-syne text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
            Welcome Back to Snitch
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm mt-1.5 leading-relaxed hidden sm:block">
            Access your wardrobe orders, saved styles, and tailored member drops.
          </p>
        </div>
      </div>

      {/* RIGHT HALF: Full-Height Clean & Minimal Login Form */}
      <div className="w-full lg:w-1/2 min-h-full flex flex-col justify-center items-center px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-10 lg:py-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="font-syne text-xs uppercase tracking-[0.28em] text-amber-400 font-bold block mb-1.5">
              Account Login
            </span>
            <h1 className="font-syne text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-zinc-400 text-sm mt-1.5">
              Enter your credentials to access your Snitch account.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full h-12 px-4 bg-[#14161f] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200"
              />
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <a
                  href="#forgot"
                  className="text-xs text-zinc-400 hover:text-amber-400 transition"
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
                  className="w-full h-12 pl-4 pr-14 bg-[#14161f] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 text-xs font-semibold text-zinc-400 hover:text-amber-400 transition cursor-pointer select-none"
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
                className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-syne font-bold text-sm tracking-wider uppercase transition shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_30px_rgba(245,158,11,0.4)] active:scale-[0.99] cursor-pointer disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
            <ContinueWithGoogle/>
          </form>

          {/* Footer Notice */}
          <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <span>
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-400 hover:underline font-medium">
                Create Account
              </Link>
            </span>
            <span>&copy; {new Date().getFullYear()} Snitch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;