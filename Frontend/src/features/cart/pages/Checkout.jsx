
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddress } from "../../address/hooks/useAddress";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router";
import { useRazorpay } from "react-razorpay";

const Checkout = () => {
  const addresses = useSelector(
    (state) => state.address.addresses
  );

  const { handleGetAllAddress } = useAddress();
  const {handleCreteCartOrder,handleVerifyCartOrder} = useCart();

  const navigate = useNavigate();
  const { error, isLoading, Razorpay } = useRazorpay(); 
  const user = useSelector((state) => state.auth.user);

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch saved addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        await handleGetAllAddress();
      } catch (error) {
        console.error("Failed to load addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  // Automatically select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(
        (address) => address.isDefault
      );

      setSelectedAddressId(
        defaultAddress?._id || addresses[0]._id
      );
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find(
    (address) => address._id === selectedAddressId
  );

  const handlePayment = async () => {
  if (!selectedAddressId) {
    alert("Please select a delivery address");
    return;
  }

  try {
    setPaymentLoading(true);

    // Create Razorpay order with selected address
    const order = await handleCreteCartOrder(selectedAddressId);

    console.log("Razorpay Order:", order);

    const options = {
      key: "rzp_test_TyQsjBeVuMNWEr",
      amount: order.amount,
      currency: order.currency,
      name: "Snitch",
      description: "Order Payment",
      order_id: order.id,

      handler: async (response) => {
        try {
          const isValid = await handleVerifyCartOrder(response);

          if (isValid) {
            navigate(
              `/order-success?order_id=${response.razorpay_order_id}`
            );
          } else {
            alert("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          alert("Unable to verify payment");
        }
      },

      prefill: {
        name: selectedAddress.fullName,
        email: selectedAddress.email || user?.email,
        contact: selectedAddress.phone,
      },

      theme: {
        color: "#171717",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

  } catch (error) {
    console.error("Checkout failed:", error);
    alert(
      error.response?.data?.message || "Unable to start payment"
    );
  } finally {
    setPaymentLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading addresses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] px-5 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-extrabold mb-2">
          Checkout
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Select your delivery address
        </p>

        {addresses.length === 0 ? (
          <div className="bg-white border rounded-xl p-6">
            <p className="text-gray-600">
              You don't have any saved addresses.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Please add an address before checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {addresses.map((address) => (
              <div
                key={address._id}
                onClick={() =>
                  setSelectedAddressId(address._id)
                }
                className={`cursor-pointer rounded-xl border p-5 transition ${
                  selectedAddressId === address._id
                    ? "border-black bg-white"
                    : "border-[#e5ddd3] bg-white"
                }`}
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-bold">
                      {address.fullName}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                      {address.addressLine}, {address.city},
                      {address.state} - {address.pincode}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                      Phone: {address.phone}
                    </p>

                    <span className="text-xs uppercase text-gray-400 mt-2 block">
                      {address.addressType}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {address.isDefault && (
                      <span className="text-xs text-green-600">
                        Default
                      </span>
                    )}

                    <input
                      type="radio"
                      checked={
                        selectedAddressId === address._id
                      }
                      onChange={() =>
                        setSelectedAddressId(address._id)
                      }
                    />
                  </div>

                </div>
              </div>
            ))}

           <button
           disabled={!selectedAddress || paymentLoading || isLoading}
           onClick={handlePayment}
           className="w-full h-14 bg-[#171717] text-white rounded-xl font-bold disabled:opacity-40"
           >
          {paymentLoading ? "Processing..." : "Continue to Payment"}
          </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
