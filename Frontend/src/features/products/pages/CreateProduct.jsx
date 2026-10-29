import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "INR", label: "INR (₹)" },
  { value: "GBP", label: "GBP (£)" },
];

const MAX_IMAGES = 7;

/* ─── Shared input class ─────────────────────────────────────────────────── */
const inputCls =
  "w-full h-12 px-4 bg-[#14161f] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200";

const labelCls =
  "block text-[11px] font-semibold uppercase tracking-wider text-zinc-400";

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const addFiles = useCallback(
    (files) => {
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;
      const accepted = Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining);
      setImages((prev) => [...prev, ...accepted]);
      setPreviews((prev) => [
        ...prev,
        ...accepted.map((f) => URL.createObjectURL(f)),
      ]);
    },
    [images.length]
  );

  const handleFileInput = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError("Product title is required.");
    if (!formData.priceAmount || Number(formData.priceAmount) <= 0)
      return setError("Please enter a valid price.");

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      images.forEach((img) => data.append("images", img));
      await handleCreateProduct(data);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to publish listing.");
    } finally {
      setLoading(false);
    }
  };

  const slots = Array.from({ length: MAX_IMAGES });

  /* ── Image panel (shared between layouts) ────────────────────────────── */
  const ImagePanel = () => (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Product Imagery</label>
        <span className="text-[11px] text-zinc-600">
          {images.length} of {MAX_IMAGES} uploaded
        </span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center py-10 px-6
          ${isDragging
            ? "border-amber-400 bg-amber-400/5"
            : "border-amber-500/30 hover:border-amber-400/70 bg-[#14161f]/60 hover:bg-[#14161f]"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="w-14 h-14 rounded-full bg-[#1f2030] border border-zinc-700 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-amber-500/50 transition-all duration-300">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-amber-400">
            <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-white font-semibold text-sm mb-1">
          Drop images here or click to browse
        </p>
        <p className="text-zinc-500 text-xs">
          Up to {MAX_IMAGES} images · JPG, PNG, WEBP
        </p>
      </div>

      {/* Slot grid — 4 cols on desktop panel, 7 on mobile */}
      <div className="grid grid-cols-7 lg:grid-cols-4 gap-2">
        {slots.map((_, i) => {
          const hasPrev = previews[i];
          return (
            <div key={i} className="relative aspect-square">
              {hasPrev ? (
                <div className="w-full h-full rounded-lg overflow-hidden border border-amber-500/40 group">
                  <img
                    src={previews[i]}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"
                    aria-label="Remove image"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-400">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-full rounded-lg border border-dashed flex flex-col items-center justify-center text-zinc-600 hover:text-amber-400 hover:border-amber-500/60 hover:bg-[#14161f] transition-all duration-200 cursor-pointer
                    ${i === 0 ? "border-zinc-600/60" : "border-zinc-800/50"}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {i === 0 && (
                    <span className="text-[8px] uppercase tracking-wider mt-0.5 font-semibold">
                      Cover
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] text-[#e3e2e8] font-sans antialiased flex flex-col relative overflow-x-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-[45%] right-[-10%] w-[500px] h-[500px] bg-amber-400/[0.03] rounded-full blur-[160px]" />
      </div>

      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-14 lg:py-20 relative z-10">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <header className="mb-10 lg:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-400">
              Seller Portal
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-syne text-4xl sm:text-5xl font-bold text-white tracking-tight">
                New Listing
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                Fill in the details below to publish your product
              </p>
            </div>
            {/* Step indicator — desktop only */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-zinc-600 font-medium pb-1">
              <span className="text-amber-400">Details</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-700">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
              <span>Pricing</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-700">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
              <span>Media</span>
            </div>
          </div>
          {/* Amber hairline */}
          <div className="mt-6 h-px w-full bg-gradient-to-r from-amber-500/40 via-zinc-800/60 to-transparent" />
        </header>

        {/* ── Error Banner ─────────────────────────────────────────────── */}
        {error && (
          <div className="mb-8 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit}>
          {/*
            Mobile  → single column stack
            Desktop → 2 columns: left (details) | right (images panel)
          */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 xl:gap-12">

            {/* ── LEFT COLUMN: Details ────────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-8">

              {/* Title */}
              <div className="space-y-2.5">
                <label htmlFor="title" className={labelCls}>
                  Product Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Oversized Noir Jacket"
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className={labelCls}>
                    Description
                  </label>
                  <span className="text-[11px] text-zinc-600">Markdown supported</span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={7}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe fabric, fit, and feel..."
                  className="w-full p-4 bg-[#14161f] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200 resize-y"
                />
              </div>

              {/* Pricing */}
              <div className="space-y-2.5">
                <label className={labelCls}>Pricing &amp; Currency</label>
                <div className="flex items-center gap-3">
                  {/* Amount */}
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none select-none">
                      {CURRENCIES.find(c => c.value === formData.priceCurrency)?.label.slice(-2, -1)}
                    </span>
                    <input
                      id="priceAmount"
                      type="number"
                      name="priceAmount"
                      min="0"
                      step="0.01"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full h-12 pl-8 pr-4 bg-[#14161f] border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200"
                    />
                  </div>

                  {/* Currency selector */}
                  <div className="relative w-36">
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full h-12 pl-4 pr-9 bg-[#14161f] border border-zinc-800 rounded-xl text-white text-sm appearance-none focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition duration-200 cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.value} value={c.value} className="bg-[#14161f]">
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image panel — mobile only (renders inline) */}
              <div className="lg:hidden">
                <ImagePanel />
              </div>

            </div>

            {/* ── RIGHT COLUMN: Images (desktop only) ────────────────── */}
            <div className="hidden lg:block lg:w-[380px] xl:w-[420px] shrink-0">
              {/* Sticky card */}
              <div className="sticky top-8 bg-[#0f1118] border border-zinc-800/60 rounded-2xl p-6">
                <ImagePanel />
              </div>
            </div>

          </div>

          {/* ── Action Bar ───────────────────────────────────────────────── */}
          <div className="mt-10 pt-8 border-t border-zinc-800/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-syne font-bold text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_30px_rgba(245,158,11,0.4)] transition-all duration-200 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <span>Publish Listing</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
};

export default CreateProduct;
