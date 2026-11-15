
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  IndianRupee,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  MapPin,
  Phone,
  CalendarDays,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hooks/useCart";

const formatPrice = (price) => {
  if (!price) return "—";

  const amount =
    typeof price === "object" ? price.amount : price;

  const currency =
    typeof price === "object" ? price.currency : "INR";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

const statusStyles = {
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  processing: "bg-amber-50 text-amber-700 border-amber-100",
  shipped: "bg-violet-50 text-violet-700 border-violet-100",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
};

const statusIcons = {
  confirmed: Clock3,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

const Dashboard = () => {
  const navigate = useNavigate();

  const {handleGetSellerProduct,handleDeleteProduct} = useProduct();
  const {handleGetSellerOrders,handleUpdateSellerOrderStatus} = useCart();

  const rawProducts = useSelector((state) => state.product.sellerProduct);

  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [sellerOrders, setSellerOrders] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const products = useMemo(() => {
    if (Array.isArray(rawProducts)) return rawProducts;

    if (Array.isArray(rawProducts?.sellProducts)) {
      return rawProducts.sellProducts;
    }

    if (Array.isArray(rawProducts?.products)) {
      return rawProducts.products;
    }

    return [];
  }, [rawProducts]);

  // Fetch products
  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        await handleGetSellerProduct();
      } catch (error) {
        console.error("Products fetch error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  // Fetch seller orders
  const fetchSellerOrders = async () => {
    try {
      setOrdersLoading(true);

      const orders = await handleGetSellerOrders();
      setSellerOrders(orders || []);
    } catch (error) {
      console.error("Orders fetch error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to fetch seller orders"
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // Update seller order status
  const handleStatusChange = async (orderId, orderStatus) => {
    if (updatingOrderId) return;

    try {
      setUpdatingOrderId(orderId);

      const response = await handleUpdateSellerOrderStatus({
        orderId,
        orderStatus,
      });

      if (response.success) {
        setSellerOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: response.orderStatus }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Status update error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update order status"
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete || deleting) return;

    try {
      setDeleting(true);
      await handleDeleteProduct(productToDelete._id);
      setProductToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete product"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Search and sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-asc") {
      result.sort(
        (a, b) =>
          (a.price?.amount || 0) - (b.price?.amount || 0)
      );
    } else if (sortBy === "price-desc") {
      result.sort(
        (a, b) =>
          (b.price?.amount || 0) - (a.price?.amount || 0)
      );
    } else if (sortBy === "title-asc") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const totalValue = products.reduce((sum, product) =>sum + (Number(product.price?.amount) || 0),0);

  const orderStats = [
    {
      label: "Total Orders",
      value: sellerOrders.length,
      icon: ShoppingBag,
      color: "bg-stone-100 text-stone-800",
    },
    {
      label: "Processing",
      value: sellerOrders.filter(
        (order) => order.orderStatus === "processing"
      ).length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Shipped",
      value: sellerOrders.filter(
        (order) => order.orderStatus === "shipped"
      ).length,
      icon: Truck,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Delivered",
      value: sellerOrders.filter(
        (order) => order.orderStatus === "delivered"
      ).length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#22211F]">

      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden lg:flex w-[245px] shrink-0 bg-[#191919] text-white flex-col sticky top-0 h-screen">

          <div className="px-7 py-4 border-b border-white/10">
            <h1 className="text-sm font-black tracking-[0.22em] uppercase">
                Seller Studio
            </h1>
          </div>

          <div className="px-5 py-8 flex-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-bold px-3 mb-4">
              Workspace
            </p>

            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C7A77B] text-[#191919] font-bold text-sm">
                <LayoutDashboard size={18} />
                Dashboard
              </div>

              <button
                onClick={() =>
                  document.getElementById("orders-section")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition text-sm"
              >
                <ShoppingBag size={18} />
                Orders
              </button>

              <button
                onClick={() =>
                  document.getElementById("products-section")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition text-sm"
              >
                <Package size={18} />
                Products
              </button>
            </nav>
          </div>

          <div className="p-5 border-t border-white/10">
            <p className="text-[10px] text-white/40">
              SELLER CONTROL PANEL
            </p>
            <p className="text-xs text-white/70 mt-1">
              Manage your store with ease.
            </p>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <main className="flex-1 min-w-0">

          {/* TOP NAVBAR */}

          <header className="h-[76px] bg-white border-b border-stone-200 flex items-center justify-between px-5 sm:px-8 lg:px-10 sticky top-0 z-30">
            <button
              onClick={() => navigate("/seller/create-product")}
              className="flex items-center gap-2 bg-[#191919] text-white px-4 sm:px-5 h-10 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-[#393939] transition"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden">Add</span>
            </button>
          </header>

          <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-10 py-8 sm:py-10">

            {/* WELCOME SECTION */}

            <section className="mb-8 sm:mb-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#A28A6C] font-bold">
                Store Overview
              </p>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-2">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Your Dashboard
                  </h1>
                  <p className="text-sm text-stone-500 mt-2">
                    Monitor your products, manage orders and grow your store.
                  </p>
                </div>
              </div>
            </section>

            {/* OVERVIEW CARDS */}

            <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-12">

              {[
                {
                  label: "Total Products",
                  value: products.length,
                  note: "Products in your store",
                },
                {
                  label: "Total Orders",
                  value: sellerOrders.length,  
                  note: "Orders containing your items",
                },
                {
                  label: "Catalog Value",
                  value: formatPrice({
                    amount: totalValue,
                    currency: products[0]?.price?.currency || "INR",
                  }),
                  note: "Combined product prices",
                },
                {
                  label: "Total Delivered",
                  value: sellerOrders.filter(
                    (order) => order.orderStatus === "delivered"
                  ).length,
                  note: "Successfully delivered",
                },
              ].map((item) => {
                

                return (
                  <div
                    key={item.label}
                    className="bg-white border border-stone-200/80 rounded-2xl p-2 sm:p-6 shadow-[0_3px_15px_rgba(0,0,0,0.025)] hover:shadow-md transition"
                  >
                  <div className="flex items-center justify-between">
                      <div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                        {item.label}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black  tracking-tight">
                      {item.value}
                    </h3>
                  </div>
                  </div>
                );
              })}

            </section>

            {/* ORDERS SECTION */}

            <section id="orders-section" className="mb-14 scroll-mt-24">

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">
                    Recent Orders
                  </h2>
               
                <button
                  onClick={fetchSellerOrders}
                  disabled={ordersLoading}
                  className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-white border border-stone-200 text-xs font-bold hover:bg-stone-100 transition disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={ordersLoading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              {/* ORDER STATUS STATS */}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {orderStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="bg-white border border-stone-200 rounded-xl px-4 py-4 flex items-center gap-3"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="text-xl font-black">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-stone-400 font-semibold">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {ordersLoading ? (
                <div className="grid md:grid-cols-2 gap-5">
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-72 bg-white rounded-2xl border border-stone-200 animate-pulse"
                    />
                  ))}
                </div>
              ) : sellerOrders.length === 0 ? (
                <div className="bg-white border border-stone-200 rounded-2xl py-16 text-center">
                  <div className="w-14 h-14 bg-[#F3F0EA] rounded-2xl flex items-center justify-center mx-auto text-[#927958]">
                    <ShoppingBag size={24} />
                  </div>
                  <h3 className="font-bold text-lg mt-4">
                    No orders yet
                  </h3>
                  <p className="text-xs text-stone-400 mt-2">
                    Your customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid xl:grid-cols-2 gap-5">
                  {sellerOrders.map((order, index) => {
                    const StatusIcon =
                      statusIcons[order.orderStatus] || Clock3;

                    return (
                      <article
                        key={order.orderId}
                        className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-[0_3px_15px_rgba(0,0,0,0.025)] hover:shadow-md transition"
                      >
                        {/* Order heading */}

                        <div className="p-5 sm:p-6 border-b border-stone-100">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                                Order #{index + 1}
                              </p>
                              <h3 className="font-extrabold text-base mt-1">
                                {order.customer?.fullName || "Customer"}
                              </h3>
                              <p className="text-[11px] text-stone-400 mt-1">
                                ID: {order.orderId}
                              </p>
                            </div>

                            <span
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[9px] uppercase tracking-wider font-bold ${statusStyles[order.orderStatus] || statusStyles.confirmed}`}
                            >
                              <StatusIcon size={13} />
                              {order.orderStatus}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-5 text-[10px] text-stone-500">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays size={13} />
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                                : "Date unavailable"}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Phone size={13} />
                              {order.customer?.phone || "Phone unavailable"}
                            </span>
                          </div>
                        </div>

                        {/* Address */}

                        <div className="px-5 sm:px-6 py-4 bg-[#FAF9F6] border-b border-stone-100">
                          <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-2 flex items-center gap-1.5">
                            <MapPin size={12} />
                            Delivery Address
                          </p>

                          <p className="text-xs font-semibold text-stone-700">
                            {order.customer?.address?.addressLine || "Address unavailable"}
                          </p>

                          <p className="text-[10px] text-stone-500 mt-1">
                            {[
                              order.customer?.address?.city,
                              order.customer?.address?.state,
                              order.customer?.address?.pincode,
                            ].filter(Boolean).join(", ")}
                          </p>
                        </div>

                        {/* Items */}

                        <div className="p-5 sm:p-6">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
                              Ordered Products
                            </p>
                            <span className="text-[10px] text-stone-400">
                              {order.items?.length || 0} items
                            </span>
                          </div>

                          <div className="space-y-4">
                            {order.items?.map((item, itemIndex) => (
                              <div
                                key={item._id || itemIndex}
                                className="flex items-center gap-3"
                              >
                                <img
                                  src={
                                    item.images?.[0]?.url ||
                                    "/placeholder-image.jpg"
                                  }
                                  alt={item.title}
                                  className="w-14 h-[68px] rounded-lg object-cover bg-stone-100"
                                />

                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold truncate">
                                    {item.title}
                                  </h4>
                                  <p className="text-[10px] text-stone-400 mt-1">
                                    Qty: {item.quantity}
                                  </p>
                                </div>

                                <p className="text-xs font-bold whitespace-nowrap">
                                  {formatPrice(item.price)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status update */}

                        <div className="px-5 sm:px-6 py-5 bg-[#FAF9F6] border-t border-stone-100">
                          <label
                            htmlFor={`status-${order.orderId}`}
                            className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-2"
                          >
                            Update Order Status
                          </label>

                          <div className="relative">
                            <select
                              id={`status-${order.orderId}`}
                              value={order.orderStatus}
                              disabled={
                                updatingOrderId === order.orderId ||
                                order.orderStatus === "cancelled"
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderId,
                                  e.target.value
                                )
                              }
                              className="w-full h-11 appearance-none bg-white border border-stone-200 rounded-lg px-4 pr-10 text-xs font-bold outline-none focus:border-[#A28A6C] disabled:opacity-50"
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>

                            <ChevronDown
                              size={15}
                              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"
                            />
                          </div>

                          {updatingOrderId === order.orderId && (
                            <p className="text-[10px] text-stone-400 mt-2">
                              Updating status...
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* PRODUCTS SECTION */}

            <section id="products-section" className="scroll-mt-24">

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">  
                  <h2 className="text-2xl sm:text-3xl font-black mt-1">
                    Your Products
                  </h2>  

                <p className="text-xs text-stone-400 font-semibold">
                  {filteredProducts.length} Products
                </p>
              </div>

              {/* Search and sorting */}

              <div className="bg-white border border-stone-200 rounded-xl p-3 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full h-10 pl-10 pr-4 text-xs outline-none"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 px-3 bg-[#F7F6F3] rounded-lg text-xs font-semibold outline-none"
                >
                  <option value="newest">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Name: A to Z</option>
                </select>
              </div>

              {/* Product grid */}

              <div className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-72 bg-white rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="bg-white border border-stone-200 rounded-2xl py-16 text-center">
                    <ImageIcon
                      size={28}
                      className="mx-auto text-stone-300"
                    />
                    <h3 className="font-bold mt-4">
                      {searchQuery ? "No products found" : "Your catalog is empty"}
                    </h3>
                    <p className="text-xs text-stone-400 mt-2">
                      {searchQuery
                        ? "Try a different search."
                        : "Add your first product to get started."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {filteredProducts.map((product) => {
                      const image =
                        product.images?.[0]?.url ||
                        "/placeholder-image.jpg";

                      return (
                        <article
                          key={product._id}
                          className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <div className="relative aspect-[3/4] bg-[#EFEEE9] overflow-hidden">
                            <img
                              src={image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-md text-[9px] font-bold text-stone-700">
                              {product.images?.length || 0} PHOTOS
                            </span>

                            <button
                              onClick={() => setProductToDelete(product)}
                              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 text-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-red-50"
                              title="Delete product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="p-3 sm:p-4">
                            <h3 className="text-xs sm:text-sm font-bold truncate">
                              {product.title}
                            </h3>

                            <div className="flex items-center justify-between gap-2 mt-3">
                              <p className="text-sm font-black">
                                {formatPrice(product.price)}
                              </p>

                              <button
                                onClick={() =>
                                  navigate(`/seller/product/${product._id}`)
                                }
                                className="text-[9px] uppercase tracking-wider font-bold text-[#927958] flex items-center gap-1 hover:text-stone-900"
                              >
                                View <ArrowUpRight size={12} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

          </div>
        </main>
      </div>

      {/* DELETE MODAL */}

      {productToDelete && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            if (!deleting) setProductToDelete(null);
          }}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <Trash2 size={20} />
            </div>

            <p className="text-[9px] uppercase tracking-widest text-red-500 font-bold">
              Delete Product
            </p>

            <h2 className="text-2xl font-black mt-2">
              Are you sure?
            </h2>

            <p className="text-xs text-stone-500 mt-3 leading-6">
              You are about to delete{" "}
              <strong className="text-stone-900">
                {productToDelete.title}
              </strong>
              . This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-7">
              <button
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="flex-1 h-11 rounded-lg border border-stone-200 text-xs font-bold hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 h-11 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
