import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});

    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error('Failed to fetch product details', error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
        }
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            return null;
        }

        return product.variants.find((variant) => {
            if (!variant.attributes) return false;

            const variantKeys = Object.keys(variant.attributes);
            const selectedKeys = Object.keys(selectedAttributes);

            const isMatch = variantKeys.every(
                (key) => variant.attributes[key] === selectedAttributes[key]
            );

            return variantKeys.length === selectedKeys.length && isMatch;
        });
    }, [product, selectedAttributes]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};

        const attributes = {};

        product.variants.forEach((variant) => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attributes[key]) {
                        attributes[key] = new Set();
                    }

                    attributes[key].add(value);
                });
            }
        });

        Object.keys(attributes).forEach((key) => {
            attributes[key] = Array.from(attributes[key]);
        });

        return attributes;
    }, [product]);

    useEffect(() => {
        setSelectedImage(0);
    }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttributes = {
            ...selectedAttributes,
            [attrName]: value,
        };

        const exactMatch = product.variants.find((variant) => {
            const variantAttributes = variant.attributes || {};

            return (
                Object.keys(newAttributes).every(
                    (key) => newAttributes[key] === variantAttributes[key]
                ) &&
                Object.keys(variantAttributes).every(
                    (key) => newAttributes[key] === variantAttributes[key]
                )
            );
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallbackVariant = product.variants.find(
                (variant) =>
                    variant.attributes &&
                    variant.attributes[attrName] === value
            );

            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttributes);
            }
        }
    };

    if (!product) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ backgroundColor: '#fbf9f6' }}
            >
                <p
                    className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse"
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        color: '#B5ADA3',
                    }}
                >
                    Retrieving piece...
                </p>
            </div>
        );
    }

    const displayImages = activeVariant?.images?.length > 0? activeVariant.images: product.images?.length > 0 ? product.images:[{ url: '/snitch_editorial_warm.png' }];

    const displayPrice = activeVariant?.price?.amount? activeVariant.price: product.price;

    const handlePreviousImage = () => {
        setSelectedImage((previous) =>
            previous === 0 ? displayImages.length - 1 : previous - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImage((previous) =>
            previous === displayImages.length - 1 ? 0 : previous + 1
        );
    };

    return (
        <>
            <div
                className="min-h-screen pb-24 selection:bg-[#C9A96E]/30"
                style={{
                    backgroundColor: '#fbf9f6',
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 pt-8 lg:pt-14">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 xl:gap-20 items-start">

                        {/* LEFT: Image Gallery */}
                        <div className="w-full lg:w-[60%] flex flex-col-reverse md:flex-row gap-4 lg:gap-5">

                            {/* Thumbnails */}
                            {displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-16 lg:w-20 flex-shrink-0 md:max-h-[600px]">
                                    {displayImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-16 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${
                                                selectedImage === index
                                                    ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2'
                                                    : 'opacity-50 hover:opacity-100'
                                            }`}
                                            style={{
                                                backgroundColor: '#f5f3f0',
                                                '--tw-ring-offset-color': '#fbf9f6',
                                            }}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Product view ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div
                                className="relative w-full max-w-[520px] aspect-[4/5] max-h-[650px] overflow-hidden group mx-auto"
                                style={{ backgroundColor: '#f5f3f0' }}
                            >
                                <img
                                    src={
                                        displayImages[selectedImage]?.url ||
                                        displayImages[0]?.url
                                    }
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />

                                {displayImages.length > 1 && (
                                    <>
                                        {/* Previous Image */}
                                        <button
                                            onClick={handlePreviousImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border rounded-full"
                                            style={{
                                                backgroundColor: 'rgba(251,249,246,0.8)',
                                                borderColor: '#e4e2df',
                                                color: '#1b1c1a',
                                            }}
                                            aria-label="Previous image"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.2"
                                                    d="M15 19l-7-7 7-7"
                                                />
                                            </svg>
                                        </button>

                                        {/* Next Image */}
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border rounded-full"
                                            style={{
                                                backgroundColor: 'rgba(251,249,246,0.8)',
                                                borderColor: '#e4e2df',
                                                color: '#1b1c1a',
                                            }}
                                            aria-label="Next image"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="1.2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Product Details */}
                        <div className="w-full lg:w-[40%] lg:sticky lg:top-24 flex flex-col pt-2">

                            {/* Product Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-5">
                                {product.title}
                            </h1>

                            {/* Price */}
                            <div className="mb-7">
                                <span
                                    className="text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {displayPrice?.currency}{' '}
                                    {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div
                                className="h-px w-full mb-7"
                                style={{ backgroundColor: '#e4e2df' }}
                            />

                            {/* Variant Options */}
                            {Object.entries(availableAttributes).map(
                                ([attrName, values]) => (
                                    <div key={attrName} className="mb-6">
                                        <h3
                                            className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3"
                                            style={{ color: '#C9A96E' }}
                                        >
                                            {attrName}
                                        </h3>

                                        <div className="flex flex-wrap gap-2">
                                            {values.map((value) => {
                                                const isSelected =
                                                    selectedAttributes[attrName] ===
                                                    value;

                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() =>
                                                            handleAttributeChange(
                                                                attrName,
                                                                value
                                                            )
                                                        }
                                                        className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${
                                                            isSelected
                                                                ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]'
                                                                : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'
                                                        }`}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Stock Information */}
                            {activeVariant &&
                                activeVariant.stock !== undefined && (
                                    <div className="mb-6">
                                        <span
                                            className={`text-[10px] uppercase tracking-[0.2em] font-medium ${
                                                activeVariant.stock > 0
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                            }`}
                                        >
                                            {activeVariant.stock > 0
                                                ? `${activeVariant.stock} in stock`
                                                : 'Out of stock'}
                                        </span>
                                    </div>
                                )}

                            {/* Product Description */}
                            <div className="mb-10">
                                <h3
                                    className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4"
                                    style={{ color: '#C9A96E' }}
                                >
                                    The Details
                                </h3>

                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: '#7A6E63' }}
                                >
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 mt-auto">
                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    style={{
                                        backgroundColor: '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.backgroundColor =
                                            '#C9A96E';
                                        event.currentTarget.style.color =
                                            '#1b1c1a';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.backgroundColor =
                                            '#1b1c1a';
                                        event.currentTarget.style.color =
                                            '#fbf9f6';
                                    }}
                                    onClick={() => {
                                        handleAddItem({
                                            productId: product._id,
                                            variantId: activeVariant?._id,
                                        });
                                    }}
                                    disabled={
                                        activeVariant &&
                                        activeVariant.stock <= 0
                                    }
                                >
                                    Add to Cart
                                </button>

                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: '#d0c5b5',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif",
                                    }}
                                    onMouseEnter={(event) => {
                                        event.currentTarget.style.borderColor =
                                            '#C9A96E';
                                    }}
                                    onMouseLeave={(event) => {
                                        event.currentTarget.style.borderColor =
                                            '#d0c5b5';
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra Details */}
                            <div
                                className="mt-10 space-y-4 text-[10px] uppercase tracking-[0.1em]"
                                style={{ color: '#B5ADA3' }}
                            >
                                <div
                                    className="flex justify-between gap-4 border-b pb-3"
                                    style={{ borderColor: '#e4e2df' }}
                                >
                                    <span>Shipping</span>
                                    <span className="text-right">
                                        Complimentary over INR 15,000
                                    </span>
                                </div>

                                <div
                                    className="flex justify-between gap-4 border-b pb-3"
                                    style={{ borderColor: '#e4e2df' }}
                                >
                                    <span>Returns</span>
                                    <span className="text-right">
                                        Within 14 days of delivery
                                    </span>
                                </div>

                                <div
                                    className="flex justify-between gap-4 border-b pb-3"
                                    style={{ borderColor: '#e4e2df' }}
                                >
                                    <span>Authenticity</span>
                                    <span className="text-right">
                                        100% Guaranteed
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;