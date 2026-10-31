import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─── Shared input class ────────────────────────────────────────────── */
const inputCls =
  "w-full h-12 px-4 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200 transition duration-200";

const labelCls =
  "block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1.5";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await handleRegister({
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        isSeller: formData.isSeller,
      });
      navigate("/");
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setSuccess(true);
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
              Membership Registration
            </span>
            <h1 className="font-syne text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
              Join the Snitch community as a patron or atelier vendor.
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

          {/* Success Screen */}
          {success ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 border border-stone-300 text-stone-800 flex items-center justify-center text-2xl shadow-sm">
                ✓
              </div>
              <h3 className="font-syne text-2xl font-bold text-stone-900">
                Account Created
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Welcome to Snitch,{" "}
                <span className="text-stone-900 font-semibold">{formData.fullName}</span>.
                {formData.isSeller && (
                  <span className="block mt-2 text-stone-700 text-xs bg-stone-100 border border-stone-200 rounded-lg p-2.5">
                    ✦ Atelier Vendor status active. You can now publish apparel listings.
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="text-xs uppercase tracking-wider text-stone-600 hover:text-stone-900 underline underline-offset-4 pt-4 inline-block font-semibold cursor-pointer"
              >
                Register another account
              </button>
            </div>
          ) : (
            /* Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
              {/* Field 1: Full Name */}
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Julian Vance"
                  className={inputCls}
                />
              </div>

              {/* Field 2: Email */}
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

              {/* Field 3: Contact */}
              <div>
                <label className={labelCls}>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  required
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </div>

              {/* Field 4: Password */}
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
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

              {/* Field 5: isSeller Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="isSeller"
                    checked={formData.isSeller}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-stone-300 text-stone-900 accent-stone-900 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-800">
                        Register as Seller
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        Clothing Vendor
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Enable to showcase and sell designs on Snitch Studio.
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-stone-900 hover:bg-stone-700 text-white font-syne font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
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
          )}

          {/* Footer Notice */}
          <div className="mt-7 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="text-stone-700 hover:text-stone-900 font-semibold underline underline-offset-2 transition">
                Sign In
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
          alt="Snitch Menswear Luxury Apparel"
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
            New Season • Lookbook &apos;26
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-bold text-white leading-snug drop-shadow-sm">
            Contemporary Luxury &amp; Haute Silhouette
          </h2>
          <p className="text-stone-200 text-xs mt-2 leading-relaxed hidden sm:block">
            Fast-fashion oversized tailoring, sculptured layers, and signature runway drops.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
