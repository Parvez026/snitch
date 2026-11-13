
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddress } from "../hooks/useAddress";

const initialFormData = {
  fullName: "",
  phone: "",
  email: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  addressType: "home",
  isDefault: false,
};

const Address = () => {
  const addresses = useSelector(
    (state) => state.address.addresses
  );

  const {
    handleGetAllAddress,
    handleCreateAddress,
    handleDeleteAddress,
    handleUpdateAddress,
    handleSetDefaultAddress,
  } = useAddress();

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  // Fetch all addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        await handleGetAllAddress();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ ...initialFormData });
    setEditingAddressId(null);
    setShowForm(false);
  };

  // Add or Update address
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingAddressId) {
        await handleUpdateAddress(editingAddressId, formData);
      } else {
        await handleCreateAddress(formData);
      }

      await handleGetAllAddress();

      resetForm();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit address
  const handleEdit = (address) => {
    setEditingAddressId(address._id);

    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      email: address.email || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      landmark: address.landmark || "",
      addressType: address.addressType || "home",
      isDefault: address.isDefault || false,
    });

    setShowForm(true);
  };

  // Delete address
  const handleDelete = async (addressId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    try {
      await handleDeleteAddress(addressId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete address"
      );
    }
  };

  // Set default address
  const handleSetDefault = async (addressId) => {
    try {
      await handleSetDefaultAddress(addressId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to set default address"
      );
    }
  };

  if (loading) {
    return <div className="p-6">Loading addresses...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          My Addresses
        </h1>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border rounded-xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <h2 className="text-xl font-semibold md:col-span-2">
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h2>

          {/* Input Fields */}
          {[
            { name: "fullName", label: "Full Name" },
            { name: "phone", label: "Phone Number" },
            { name: "email", label: "Email" },
            { name: "addressLine", label: "Address Line" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "pincode", label: "Pincode" },
            { name: "landmark", label: "Landmark" },
          ].map((field) => (
            <input
              key={field.name}
              type="text"
              name={field.name}
              placeholder={field.label}
              value={formData[field.name]}
              onChange={handleChange}
              required={
                !["email", "landmark"].includes(field.name)
              }
              className="border rounded-lg p-3 outline-none focus:border-black"
            />
          ))}

          {/* Address Type */}
          <select
            name="addressType"
            value={formData.addressType}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>

          {/* Default Address - Only while adding */}
          {!editingAddressId && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-black text-white py-3 rounded-lg disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : editingAddressId
                ? "Update Address"
                : "Save Address"}
          </button>
        </form>
      )}

      {/* Saved Addresses */}
      {addresses.length === 0 ? (
        <p className="text-gray-500">
          No addresses found. Please add an address.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="border rounded-lg p-5"
            >
              {/* Name and Default Status */}
              <div className="flex justify-between">
                <h2 className="font-semibold">
                  {address.fullName}
                </h2>

                {address.isDefault && (
                  <span className="text-green-600 text-sm font-medium">
                    Default
                  </span>
                )}
              </div>

              <p>{address.phone}</p>
              <p>{address.addressLine}</p>

              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>

              {address.landmark && (
                <p>Landmark: {address.landmark}</p>
              )}

              <p className="capitalize mt-2">
                {address.addressType}
              </p>

              {/* Edit, Delete and Default Buttons */}
              <div className="flex gap-3 mt-4 flex-wrap">

                <button
                  onClick={() => handleEdit(address)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(address._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Set as Default
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Address;
