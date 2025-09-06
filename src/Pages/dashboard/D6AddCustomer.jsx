import { FaUpload } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomerService } from "../../api/customerService";

const D6AddCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If coming from Edit
  const editingCustomer = location.state?.customer || null;

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    pin: "",
    city: "",
    state: "",
    aadharCardNumber: "",
    panNumber: "",
    companyName: "",
    gstNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        _id: editingCustomer._id || editingCustomer.id || "",
        name: editingCustomer.name || "",
        mobile: editingCustomer.mobile || "",
        email: editingCustomer.email || "",
        address: editingCustomer.address || "",
        pin: editingCustomer.pin || "",
        city: editingCustomer.city || "",
        state: editingCustomer.state || "",
        aadharCardNumber: editingCustomer.aadharCardNumber || "",
        panNumber: editingCustomer.panNumber || "",
        companyName: editingCustomer.companyName || "",
        gstNumber: editingCustomer.gstNumber || "",
      });
    }
  }, [editingCustomer]);

  // handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // frontend validation
  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    return newErrors;
  };

  // submit handler (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert("⚠️ Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };

      let res;
      if (formData._id) {
        // 🔹 UPDATE FLOW
        res = await CustomerService.updateCustomer(payload);
        alert("✅ Customer updated successfully!");

        // overwrite formData with updated one from backend
        if (res?.customer) {
          setFormData({
            _id: res.customer._id,
            name: res.customer.name || "",
            mobile: res.customer.mobile || "",
            email: res.customer.email || "",
            address: res.customer.address || "",
            pin: res.customer.pin || "",
            city: res.customer.city || "",
            state: res.customer.state || "",
            aadharCardNumber: res.customer.aadharCardNumber || "",
            panNumber: res.customer.panNumber || "",
            companyName: res.customer.companyName || "",
            gstNumber: res.customer.gstNumber || "",
          });
        }
      } else {
        // 🔹 CREATE FLOW
        res = await CustomerService.createCustomer(payload);
        alert(
          `✅ Customer added successfully\nUnique ID: ${
            res?.customerId || ""
          }`
        );

        // reset form only after creating new customer
        setFormData({
          _id: "",
          name: "",
          mobile: "",
          email: "",
          address: "",
          pin: "",
          city: "",
          state: "",
          aadharCardNumber: "",
          panNumber: "",
          companyName: "",
          gstNumber: "",
        });
      }

      console.log("Response:", res);

      // after save → go back to customer list
      navigate("/dashboard/customers");
    } catch (error) {
      console.error("❌ Error saving customer:", error);
      alert(
        error?.message ||
          "Something went wrong while saving the customer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (formData._id && editingCustomer) {
      // if editing, just reset to original values
      setFormData({
        _id: editingCustomer._id || editingCustomer.id || "",
        name: editingCustomer.name || "",
        mobile: editingCustomer.mobile || "",
        email: editingCustomer.email || "",
        address: editingCustomer.address || "",
        pin: editingCustomer.pin || "",
        city: editingCustomer.city || "",
        state: editingCustomer.state || "",
        aadharCardNumber: editingCustomer.aadharCardNumber || "",
        panNumber: editingCustomer.panNumber || "",
        companyName: editingCustomer.companyName || "",
        gstNumber: editingCustomer.gstNumber || "",
      });
    } else {
      // if creating, clear everything
      setFormData({
        _id: "",
        name: "",
        mobile: "",
        email: "",
        address: "",
        pin: "",
        city: "",
        state: "",
        aadharCardNumber: "",
        panNumber: "",
        companyName: "",
        gstNumber: "",
      });
    }
    setErrors({});
  };

  return (
    <div className="max-w-5xl mx-auto mt-5 md:mt-10 pb-10 bg-white rounded-lg shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between bg-bluecol rounded-t-xl px-4 md:px-10 py-4 items-center mb-8">
        <h1 className="text-lg md:text-2xl font-bold text-white">
          {formData._id ? "Edit Customer" : "Add Customer"}
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-10 max-w-5xl"
      >
        {[
          { key: "name", label: "Name *" },
          { key: "mobile", label: "Mobile *" },
          { key: "email", label: "Email *", type: "email" },
          { key: "address", label: "Address *" },
          { key: "pin", label: "PIN" },
          { key: "city", label: "City *" },
          { key: "state", label: "State *" },
          { key: "aadharCardNumber", label: "Aadhar Card Number" },
          { key: "panNumber", label: "PAN Number" },
          { key: "companyName", label: "Company Name" },
          { key: "gstNumber", label: "GST Number" },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-gray-600">{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.key}
              value={formData[field.key]}
              onChange={handleChange}
              placeholder={`Enter ${field.label}`}
              className={`w-full border rounded-md px-4 py-2 mt-1 text-sm ${
                errors[field.key] ? "border-red-500" : "bg-gray-100"
              }`}
            />
            {errors[field.key] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </form>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
        <button
          onClick={handleClear}
          disabled={loading}
          className="bg-bluecol text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
        >
          {formData._id ? "Reset Fields" : "Clear Fields"}
        </button>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : formData._id
            ? "Update Customer"
            : "Submit"}
        </button>

        <button
          type="button"
          className="border border-gray-300 bg-white text-black px-4 py-2 rounded-md text-sm font-medium flex flex-row gap-3"
        >
          <FaUpload color="bluecol" />
          Import CSV
        </button>
      </div>
    </div>
  );
};

export default D6AddCustomer;
