//create Invoice
import React from "react";
import { FaCommentSms } from "react-icons/fa6";
import Select from "react-select";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPrint } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa6";
import { FaClock } from "react-icons/fa6";
import { GiCash } from "react-icons/gi";
import { FaCalculator } from "react-icons/fa";
import { LuNewspaper } from "react-icons/lu";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaBox } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
// NEW: date picker + date-fns
import DatePicker from "react-datepicker";
import { parse, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../common/Button.jsx";
import { useCreateInvoiceController } from "../../api/CreateInvoiceCTR.js";

function convertAmountToWords(amount) {
  if (isNaN(amount)) return "";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (num) => {
    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + numToWords(num % 100) : "")
      );
    return "";
  };

  const number = Math.floor(amount);
  const paise = Math.round((amount - number) * 100);

  const crore = Math.floor(number / 10000000);
  const lakh = Math.floor((number % 10000000) / 100000);
  const thousand = Math.floor((number % 100000) / 1000);
  const hundred = Math.floor((number % 1000) / 100);
  const remainder = number % 100;

  let words = "";
  if (crore) words += numToWords(crore) + " Crore ";
  if (lakh) words += numToWords(lakh) + " Lakh ";
  if (thousand) words += numToWords(thousand) + " Thousand ";
  if (hundred) words += numToWords(hundred) + " Hundred ";
  if (remainder) words += numToWords(remainder) + " ";

  words = words.trim() + " Rupees";
  if (paise > 0) words += " and " + numToWords(paise) + " Paise";
  words += " Only";

  return words.replace(/\s+/g, " ");
}

export default function D7CreateInvoice({ onCustomerSelect }) {
  const navigate = useNavigate();
  const {
    invoceId,
    createdDate,
    setCreatedDate,
    selectedFormat,
    setSelectedFormat,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    searchTriggered,
    filteredCustomers,
    handleSelectCustomer,
    storeProfile,

    products,
    rows,
    handleSelectProduct,
    handleAddRow,
    handleRemoveRow,
    handleChange,

    showStep3,
    showStep4,
    paymentMode,
    handlePaymentMode,
    paymentMethod,
    setPaymentMethod,
    transactionId,
    setTransactionId,
    milestones,
    setMilestones,
    handleAddMilestone,
    // handleMilestoneChange, // not used in view
    additionalCharges,
    handleAdditionalChange,
    note,
    setNote,
    partialCashAmount,
    setPartialCashAmount,

    invoiceSummary,
    calculateTotal,

    previewInvoice,
    setPreviewInvoice,
    showPreview,
    setShowPreview,
    handlePreview,
    handleSubmit,

    popupType,
    setPopupType,
    message,
    // setMessage, // not directly used here

    invoices,
    // todayCollection, // available if needed
    // totalCollection, // available if needed

    //customer
    customerProfile,
    setCustomerProfile,

    previewRef,
    downloadPreviewAsPDF,
    setSearchTriggered,

    taxType,
    handleTaxTypeChange,

    formatCurrency,
  } = useCreateInvoiceController({ onCustomerSelect });
  const handleCreateDate = (date) => {
    setCreatedDate(date);
  };

  const handleView = (id) => {
    navigate(`/dashboard/invoice-view/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 mt-5 md:mt-10   grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-robotoB text-[#1F2937] mb-4">
          Create New Invoice
        </h1>

        {/* Steps 1 to 6 (same as before) */}
        <div className="space-y-6">
          {/* Step 1: Select Customer */}
          <div className="bg-white shadow-customCard rounded-lg p-5">
            <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-4">
              <div className="bg-[#2563EB] p-2.5 rounded-full">
                <FaSearch color="white" size={14} />
              </div>
              Step 1: Select Customer
            </h2>

            {/* {created date as input box } */}
            <div className="mb-4">
              <p className="my-6">
                Invoice ID : <strong>{invoceId}</strong>{" "}
              </p>
              <label className="block text-sm font-medium text-gray-700 my-3">
                Invoice Created Date
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-300 md:w-[60%] h-10 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={createdDate}
                onChange={(e) => handleCreateDate(e.target.value)}
              />
            </div>

            {/* Search Input & Button */}
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search Customer
            </label>
            <div className="w-full md:w-3/4 flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name or mobile number"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchTriggered(true);
                  }}
                  className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <IoIosSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60" />
              </div>
              <button
                className="bg-green-600 font-robotoR hover:bg-green-700 text-white px-5 py-3 rounded-lg text-md whitespace-nowrap"
                onClick={() => navigate("/dashboard/add-customer")}
              >
                + Add New Customer
              </button>
            </div>

            {/* Customers List (Search Results) */}
            {loading ? (
              <p className="text-gray-500 text-sm">Loading customers...</p>
            ) : searchTriggered && filteredCustomers.length === 0 ? (
              <p className="text-red-500 text-sm">No customer found.</p>
            ) : (
              searchTerm && (
                <ul className="border bg-white rounded mt-2 shadow max-h-40 overflow-y-auto">
                  {filteredCustomers.map((cust) => (
                    <li
                      key={cust._id}
                      onClick={() => handleSelectCustomer(cust)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    >
                      {cust.name} ({cust.mobile})
                    </li>
                  ))}
                </ul>
              )
            )}

            {/* Selected Customer Details */}
            {selectedCustomer && (
              <div className="text-sm  p-3 rounded mt-3 bg-blue-500 text-white">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <p className="font-robotoR">
                    <strong className=" font-robotoM font-bold text-md capitalize">
                      Name:
                    </strong>{" "}
                    {selectedCustomer.name}
                  </p>
                  <p className="font-robotoR">
                    <strong className=" font-robotoM font-bold text-md capitalize">
                      mobile:
                    </strong>{" "}
                    {selectedCustomer.mobile}
                  </p>
                  <p className="font-robotoR">
                    <strong className=" font-robotoM font-bold text-md capitalize">
                      Credit Score:
                    </strong>{" "}
                    {selectedCustomer.creditScore || "N/A"}
                  </p>
                  <p className="font-robotoR">
                    <strong className=" font-robotoM font-bold text-md capitalize">
                      Address:
                    </strong>{" "}
                    {selectedCustomer.address || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Add Products/Services */}
          <div className="max-w-7xl mx-auto  my-5 md:mt-10 bg-white  gap-6 overflow-hidden">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg font-robotoB shadow-customCard p-4 sm:p-6 w-full max-w-6xl space-y-4">
                <h2 className="flex items-center gap-3 text-base sm:text-lg font-robotoSb text-gray-800">
                  <div className="bg-[#2563EB] p-2 sm:p-3 rounded-full flex items-center justify-center">
                    <FaBox color="white" size={16} />
                  </div>
                  Step 2: Add Products/Services
                </h2>

                <div className="w-full">
                  {/* Rows */}
                  {rows.map((row) => (
                    <>
                      <div
                        key={row.id}
                        className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 items-end py-3 border-b sm:border-0"
                      >
                        {/* Product */}
                        <div className="col-span-2 md:col-span-6">
                          <label className="text-xs text-gray-600 font-robotoM ">
                            Product/Service
                          </label>
                          <Select
                            className="text-sm w-[100%] md:w-[50%] hover:text-black"
                            placeholder="Select Product..."
                            isClearable
                            isSearchable
                            menuPortalTarget={document.body}
                            filterOption={(option, inputValue) =>
                              inputValue
                                ? option.label
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                                : option.data.index < 3
                            }
                            options={
                              Array.isArray(products)
                                ? products
                                    .filter((p) => p && (p._id || p.id))
                                    .map((p, index) => ({
                                      value: p._id || p.id,
                                      label:
                                        p.name || p.product_name || "Unnamed",
                                      index,
                                    }))
                                : []
                            }
                            value={
                              row.productId
                                ? (() => {
                                    const selected = products?.find(
                                      (p) =>
                                        p &&
                                        (p._id === row.productId ||
                                          p.id === row.productId)
                                    );
                                    return selected
                                      ? {
                                          value: row.productId,
                                          label:
                                            selected.name ||
                                            selected.product_name ||
                                            "Unnamed",
                                        }
                                      : null;
                                  })()
                                : null
                            }
                            onChange={(selectedOption) => {
                              const selectedProduct = products?.find(
                                (p) =>
                                  p &&
                                  (p._id === selectedOption?.value ||
                                    p.id === selectedOption?.value)
                              );
                              handleSelectProduct(
                                row.id,
                                selectedProduct || null
                              );
                            }}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              control: (base, state) => ({
                                ...base,
                                minHeight: 36,
                                borderColor: state.isFocused
                                  ? "#2563eb"
                                  : "#d1d5db",
                                boxShadow: state.isFocused
                                  ? "0 0 0 1px #2563eb"
                                  : "none",
                                "&:hover": { borderColor: "#2563eb" },
                                borderRadius: 8,
                              }),
                              option: (base, { isFocused, isSelected }) => ({
                                ...base,
                                backgroundColor: isFocused
                                  ? "#f3f4f6"
                                  : isSelected
                                  ? "#2563eb"
                                  : "white",
                                color: isSelected ? "white" : "#111827",
                                fontSize: 12,
                                cursor: "pointer",
                                padding: "8px 12px",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: "#111827",
                                fontWeight: 500,
                              }),
                              menu: (base) => ({
                                ...base,
                                marginTop: 2,
                                borderRadius: 8,
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                overflowX: "hidden",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#9CA3AF",
                                fontSize: 14,
                              }),
                            }}
                          />
                        </div>

                        {/* Qty */}
                        <div className="col-span-1 md:col-span-3">
                          <label className="text-xs text-gray-600 font-robotoM">
                            Qty
                          </label>
                          <input
                            type="text"
                            min="1"
                            value={row.qty}
                            onChange={(e) =>
                              handleChange(row.id, "qty", e.target.value)
                            }
                            className="w-full h-9 border border-gray-300 px-2 rounded-md focus:border-blue-500 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>

                        {/* Unit */}
                        <div className="col-span-1 md:col-span-3">
                          <label className="text-xs text-gray-600 font-robotoM">
                            Unit
                          </label>
                          <input
                            placeholder="Unit"
                            value={row.unit}
                            onChange={(e) =>
                              handleChange(row.id, "unit", e.target.value)
                            }
                            className="w-full h-9 border-2 border-gray-300 px-2 rounded-md focus:border-blue-500 focus:ring-blue-500 outline-none text-sm"
                          />
                        </div>

                        {/* Price */}
                        <div className="col-span-1 md:col-span-2 h-full">
                          <label className="text-xs text-gray-600 font-robotoM">
                            Base Price
                          </label>
                          <input
                            type="text"
                            placeholder="0.00"
                            value={row.price}
                            onChange={(e) =>
                              handleChange(row.id, "price", e.target.value)
                            }
                            className="w-full h-9 border border-gray-300 px-2 rounded-md focus:border-blue-500 focus:ring-blue-500 outline-none text-sm"
                          />

                          {convertAmountToWords(row.price) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(row.price)}
                            </p>
                          )}
                        </div>

                        {/* Tax */}
                        {taxType === "taxable" ? (
                          <div className="col-span-1 md:col-span-2 h-full">
                            <label className="text-xs text-gray-600 font-robotoM">
                              Tax %
                            </label>
                            <input
                              type="text"
                              value={`${row.tax}`}
                              onChange={(e) =>
                                handleChange(row.id, "tax", e.target.value)
                              }
                              className="w-full h-9 border border-gray-300 px-2 rounded-md bg-gray-50 text-sm"
                            />

                            {convertAmountToWords(calculateTotal(row)) && (
                            <p className="text-gray-500 text-[10px] mt-1 hidden">
                              {convertAmountToWords(calculateTotal(row))}
                            </p>
                          )}

                          </div>
                        ) : (
                          ""
                        )}

                        {/* Total */}
                        <div className="col-span-1 md:col-span-2 h-full">
                          <label className="text-xs text-gray-600 font-robotoM">
                            Total
                          </label>
                          <div className="flex items-center justify-between w-full h-9 border-2 border-gray-300 px-2 rounded-md bg-gray-50 text-sm">
                            <span>₹{calculateTotal(row).toFixed(2)}</span>
                            <button
                              onClick={() => handleRemoveRow(row.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <FaTrash />
                            </button>
                          </div>

                          {convertAmountToWords(calculateTotal(row)) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(calculateTotal(row))}
                            </p>
                          )}
                        </div>
                      </div>

                      <hr />
                    </>
                  ))}
                </div>

                {/* Add Row button */}
                <button
                  onClick={handleAddRow}
                  className="text-bluecol font-robotoM text-sm sm:text-md mt-2"
                >
                  + Add Row
                </button>

                {/* Tax Type Dropdown */}
                <div className="mt-4">
                  <label className="text-xs text-gray-600 font-robotoM block mb-1">
                    Tax Type
                  </label>
                  <select
                    className="w-full h-9 border border-gray-300 px-2 rounded-md focus:border-blue-500 focus:ring-blue-500 outline-none text-sm"
                    value={taxType}
                    onChange={(e) => handleTaxTypeChange(e.target.value)}
                  >
                    <option value="taxable">Taxable</option>
                    <option value="non-taxable">Non Taxable</option>
                  </select>
                </div>
              </div>

              {/* Step 5: Additional Charges */}
              {/* Step 5: Additional Charges */}
              <div className="bg-white rounded-lg shadow-customCard p-4">
                <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
                  <div className="bg-[#2563EB] p-2.5 rounded-full">
                    <FaPlus color="white" size={14} />
                  </div>
                  Step 3: Additional Charges
                </h2>
                <div className="grid grid-cols-2 gap-3 font-robotoR text-md">
                  <div>
                    <label className="block text-sm mb-1 font-robotoM">
                      Delivery Fee
                    </label>
                    <input
                      className="w-full border px-2 py-1 rounded bg-white 
      "
                      placeholder="0.00"
                      type="text"
                      min="0" // ❌ Negative values block
                      inputMode="decimal" // ✅ Mobile keyboards show numeric with dot
                      value={additionalCharges.deliveryFee}
                      onChange={(e) =>
                        handleAdditionalChange(
                          "deliveryFee",
                          e.target.value < 0 ? 0 : e.target.value // ❌ Prevents manual negative typing
                        )
                      }
                    />

                    {convertAmountToWords(additionalCharges.deliveryFee) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(additionalCharges.deliveryFee)}
                            </p>
                          )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-robotoM">
                      Packing Charges
                    </label>
                    <input
                      className="w-full border px-2 py-1 rounded bg-white 
       "
                      placeholder="0.00"
                      type="text"
                      min="0"
                      inputMode="decimal"
                      value={additionalCharges.packingCharges}
                      onChange={(e) =>
                        handleAdditionalChange(
                          "packingCharges",
                          e.target.value < 0 ? 0 : e.target.value
                        )
                      }
                    />

                     {convertAmountToWords(additionalCharges.packingCharges) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(additionalCharges.packingCharges)}
                            </p>
                          )}

                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-robotoM">
                      Discount
                    </label>
                    <input
                      className="w-full border px-2 py-1 rounded bg-white 
     "
                      placeholder="0.00"
                      type="text"
                      min="0"
                      inputMode="decimal"
                      value={additionalCharges.discount}
                      onChange={(e) =>
                        handleAdditionalChange(
                          "discount",
                          e.target.value < 0 ? 0 : e.target.value
                        )
                      }
                    />

                    {convertAmountToWords(additionalCharges.discount) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(additionalCharges.discount)}
                            </p>
                          )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 font-robotoM">
                      Other
                    </label>
                    <input
                      className="w-full border px-2 py-1 rounded bg-white 
"
                      placeholder="0.00"
                      type="text"
                      min="0"
                      inputMode="decimal"
                      value={additionalCharges.other}
                      onChange={(e) =>
                        handleAdditionalChange(
                          "other",
                          e.target.value < 0 ? 0 : e.target.value
                        )
                      }
                    />

                    {convertAmountToWords(additionalCharges.other) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(additionalCharges.other)}
                            </p>
                          )}

                  </div>
                </div>
              </div>

              {/* Step 3: Payment Mode */}
              <div className="bg-white rounded-lg shadow-customCard p-4">
                <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-6">
                  <div className="bg-[#2563EB] p-2.5 rounded-full">
                    <FaRegCreditCard color="white" size={14} />
                  </div>
                  Step 4: Payment Mode
                </h2>
                <div className="flex flex-col sm:flex-row space-x-3">
                  <button
                    onClick={() => handlePaymentMode("cash")}
                    className={`flex justify-center items-center gap-2 border border-bluecol hover:bg-bluecol hover:text-white text-bluecol ml-3 my-1 px-4 py-1 rounded font-robotoM text-md ${
                      paymentMode === "cash" ? "bg-bluecol text-white" : ""
                    }`}
                  >
                    <GiCash size={18} /> Cash
                  </button>
                  <button
                    onClick={() => handlePaymentMode("debt")}
                    className={`flex justify-center items-center gap-2 border border-bluecol hover:bg-bluecol hover:text-white text-bluecol ml-3 my-1 px-4 py-1 rounded font-robotoM text-md ${
                      paymentMode === "debt" ? "bg-bluecol text-white" : ""
                    }`}
                  >
                    <FaCalculator size={18} /> Debt
                  </button>
                </div>
              </div>

              {/* Step 4: Payment Method (if Cash) */}
              {showStep3 && (
                <div className="bg-white rounded-lg shadow-customCard p-4">
                  <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
                    <div className="bg-[#2563EB] p-2.5 rounded-full">
                      <FaCalculator color="white" size={14} />
                    </div>
                    Step 5: Payment Method
                  </h2>

                  <div className="grid grid-cols-2 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
                    <div>Payment Method</div>
                    <div>Transaction ID / UTR</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center font-robotoR text-md p-3">
                    <input
                      className="border px-2 py-1 rounded bg-white"
                      placeholder="Cash/UPI/Cheque/DD"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <input
                      className="border px-2 py-1 rounded bg-white"
                      placeholder="Enter Transaction reference"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Milestones (if Debt) with Partial Cash */}
              {showStep4 && (
                <div className="bg-white rounded-lg shadow-customCard p-4 sm:p-6">
                  <h2 className="flex items-center gap-2 text-base sm:text-lg font-robotoSb mb-3">
                    <div className="bg-[#2563EB] p-2.5 rounded-full">
                      <FaCalculator color="white" size={14} />
                    </div>
                    Step 5: Promise Date
                  </h2>

                  <div className="mt-4 border-t py-4">
                    <label className="block text-sm mb-1 font-robotoM">
                      Partial Cash Paid (Mixed Payment)
                    </label>
                    <input
                      type="text"
                      value={partialCashAmount}
                      onChange={(e) => setPartialCashAmount(e.target.value)}
                      className="border px-2 py-1 rounded bg-white w-full"
                      placeholder="Enter cash amount (optional, rest in debt)"
                    />
                    {convertAmountToWords(partialCashAmount) && (
                            <p className="text-gray-500 text-[10px] mt-1">
                              {convertAmountToWords(partialCashAmount)}
                            </p>
                          )}
                    <p className="text-sm text-gray-500 mt-1">
                      Remaining Due: ₹{invoiceSummary.dueBalance.toFixed(2)}
                    </p>
                  </div>

                  <div className="hidden sm:grid grid-cols-4 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
                    <div>Milestone Name</div>
                    <div>Amount (₹)</div>
                    <div>Due Date</div>
                    <div>Status</div>
                  </div>

                  {milestones.map((ms, index) => (
                    <div
                      key={ms.id}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-robotoR text-sm sm:text-md border border-gray-200 p-3 rounded items-center"
                    >
                      <input
                        className="border px-2 py-1 rounded bg-white"
                        placeholder="Milestone Name"
                        value={ms.name}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].name = e.target.value;
                          setMilestones(newMilestones);
                        }}
                      />

                      <input
                        className="border px-2 py-1 rounded bg-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        placeholder="0.00"
                        type="text"
                        inputMode="decimal" // Changed from 'numeric' to 'decimal'
                        pattern="[0-9]*[.]?[0-9]*" // Updated pattern to allow optional decimal
                        value={ms.amount}
                        onChange={(e) => {
                          const newMilestones = [...milestones];
                          const rawValue = e.target.value;

                          // 1. Allow digits and a single decimal point
                          const sanitizedValue = rawValue
                            .replace(/[^\d.]/g, "") // Remove all non-digits except '.'
                            .replace(
                              /^(\d*\.)(.*)$/,
                              (match, p1, p2) => p1 + p2.replace(/\./g, "")
                            ); // Only allow one '.'

                          // 2. Update the milestone amount
                          // We store the string to allow for '5.' or '5.0' before the user types the final digit.
                          // If the string is empty, use an empty string.
                          newMilestones[index].amount = sanitizedValue;

                          setMilestones(newMilestones);
                        }}
                      />
                       
                    
                      <DatePicker
                        className="w-full h-10 border border-gray-300 px-2 py-1 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        selected={
                          ms.dueDate
                            ? parse(ms.dueDate, "dd/MM/yyyy", new Date())
                            : null
                        }
                        onChange={(date) => {
                          const newMilestones = [...milestones];
                          newMilestones[index].dueDate = date
                            ? format(date, "dd/MM/yyyy")
                            : "";
                          setMilestones(newMilestones);
                        }}
                        dateFormat="dd/MM/yyyy"
                        // minDate={new Date()}
                        placeholderText="Select due date"
                      />

                      <div className="relative flex flex-row gap-2">
                        <input
                          className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Status"
                          value={ms.status}
                          readOnly
                        />

                        {/* 🔹 Delete button */}
                        <button
                          onClick={() => {
                            const newMilestones = milestones.filter(
                              (_, i) => i !== index
                            );
                            setMilestones(newMilestones);
                          }}
                          className="text-red-500 hover:text-red-700 flex justify-center items-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddMilestone}
                    className="text-bluecol font-robotoR text-sm sm:text-md mt-2"
                  >
                    + Add Milestone
                  </button>
                </div>
              )}

              {/* Step 6: Add Note */}
              <div className="bg-white rounded-lg shadow-lg shadow-[#0000001A] p-4 shadow-customCard">
                <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
                  <div className="bg-[#2563EB] p-2.5 rounded-full">
                    <FaEdit color="white" size={14} />
                  </div>
                  Step 6: Add Note (Optional)
                </h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border w-full px-3 py-2 rounded font-robotoR text-md bg-white"
                  rows="3"
                  placeholder="Terms & Conditions, Special instructions, Internal notes..."
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-start gap-4 p-4">
              {/* <button className="bg-gray-600 text-white font-robotoR text-md px-4 py-2 rounded">
                Save as Draft
              </button> */}
              <button
                onClick={handlePreview}
                className="flex justify-center items-center gap-2 bg-bluecol text-white font-robotoM text-md px-4 py-2 rounded"
              >
                <LuNewspaper size={24} />
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Invoice Preview Modal ---------- */}

      {/* ---------- Invoice Preview Modal ---------- */}
      {/* ---------- Invoice Preview Modal (with 3 format options) ---------- */}
      {/* ---------- Invoice Preview Modal ---------- */}
      {showPreview && customerProfile && previewInvoice && (
        // 1. MODAL OVERLAY: Full screen on mobile, larger on desktop
        <div className="fixed z-50 inset-0 flex items-start justify-center p-2 sm:p-6 bg-black/40">
          {/* 1. MODAL CONTAINER: 
      - max-w-full on mobile, max-w-4xl on desktop 
      - max-h-[98vh] on mobile, max-h-[90vh] on desktop
    */}
          <div className="bg-white w-full max-w-full sm:max-w-6xl rounded-lg shadow-lg overflow-auto max-h-[98vh] sm:max-h-[90vh]">
            {/* ---------- Modal Header ---------- */}
            {/* Fixed header for better mobile scrolling experience */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-robotoSb">Invoice Preview</h3>

              <div className="flex items-center gap-3">
                {/* Format selector: Keep hidden as it only supports 'Classic' */}
                <span className="border-2 border-gray-400 rounded px-3 py-1 text-xs sm:text-sm text-gray-700">
                  Classic
                </span>

                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewInvoice(null);
                  }}
                  className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* ---------- Body: Printable Area ---------- */}
            {/* Padding adjusted for smaller screens: p-3 on mobile, md:p-6 on desktop */}
            <div className="p-3 md:p-6">
              {/* ========== CLASSIC FORMAT (Invoice Content) ========== */}
              {selectedFormat === "classic" && (
                // 2. INVOICE WRAPPER: Responsive/Print-Friendly Container
                <div
                  ref={previewRef}
                  className="bg-white border border-gray-300 p-4 sm:p-8 pt-6 shadow-xl rounded-lg text-gray-800"
                >
                  {/* ---------- Header / Title & Invoice Details ---------- */}
                  {/* Swapping flex-row to flex-col on mobile for stacking */}
                  <div className="flex flex-row justify-between items-start border-b-2 border-gray-400 pb-4 mb-6">
                    <div className="text-left mb-4 sm:mb-0 max-w-[50%]">
                      <h3 className="font-bold text-base  pb-2 uppercase text-gray-700">
                        <span className="">Bill From</span>
                      </h3>
                      <div className="word-break leading-relaxed  text-sm">
                        {storeProfile?.businessName && (
                          <p className="font-bold text-lg">
                            {storeProfile.businessName}
                          </p>
                        )}

                        {storeProfile?.address && (
                          <p>
                            <strong>Address:</strong> {storeProfile.address}
                          </p>
                        )}

                        {/* {storeProfile?.city}, {storeProfile?.state} - {storeProfile?.zipCode} */}

                        {storeProfile?.mobile && (
                          <p>
                            <strong>Mobile:</strong> {storeProfile.mobile}
                          </p>
                        )}

                        {storeProfile?.email && (
                          <p>
                            <strong>Email:</strong> {storeProfile.email}
                          </p>
                        )}

                        {storeProfile?.gstNumber && (
                          <p>
                            <strong>GSTIN:</strong> {storeProfile.gstNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Invoice Details: Adjusted font size to text-xs on mobile */}
                    <div className="text-left sm:text-right text-xs sm:text-sm">
                      <p className="mb-1">
                        <strong className="font-semibold text-gray-700">
                          Invoice ID:
                        </strong>{" "}
                        <span className="text-blue-600 font-bold">
                          {invoceId}
                        </span>
                      </p>
                      <p className="mb-1">
                        <strong className="font-semibold text-gray-700">
                          Invoice Date:
                        </strong>{" "}
                        {previewInvoice.InvoiceCreatedDate ||
                          new Date().toLocaleDateString()}
                      </p>
                      <p className="mb-1">
                        <strong className="font-semibold text-gray-700">
                          Status:
                        </strong>{" "}
                        <span
                          className={`font-bold ${
                            (previewInvoice?.paymentStatus ||
                              (invoiceSummary.totalReceived ===
                              invoiceSummary.total
                                ? "Paid"
                                : "Unpaid")) === "Paid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {previewInvoice?.paymentStatus ||
                            (invoiceSummary.totalReceived ===
                            invoiceSummary.total
                              ? "Paid"
                              : invoiceSummary.totalReceived > 0
                              ? "Partial"
                              : "Unpaid")}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ---------- Customer Info ---------- */}
                  {/* Removed md:grid-cols-2 to keep it a single column stack on all screen sizes */}
                  <div className="flex justify-between gap-4 text-sm mb-6 sm:mb-8 pb-4 border-b border-gray-300">
                    <div className="text-left">
                      <h3 className="font-bold text-base pb-2 uppercase text-gray-700">
                        <span className="">Bill To</span>
                      </h3>
                      <p className="font-bold text-lg text-gray-800">
                        {customerProfile?.name && (
                          <>
                            {customerProfile.name}
                            <br />
                          </>
                        )}
                      </p>
                      <p>
                        {customerProfile?.companyName && (
                          <>
                            {customerProfile.companyName}
                            <br />
                          </>
                        )}
                      </p>
                      <p>
                        {customerProfile?.address && (
                          <>
                            <strong>Address</strong>: {customerProfile.address}
                            <br />
                          </>
                        )}
                      </p>
                      <p>
                        {customerProfile?.mobile && (
                          <>
                            <strong>Phone</strong>: {customerProfile.mobile}
                            <br />
                          </>
                        )}
                      </p>

                      <p>
                        {customerProfile?.gstNumber && (
                          <>
                            <strong>GSTIN</strong>: {customerProfile.gstNumber}
                            <br />
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-base mb-2 uppercase text-gray-700 pb-1">
                        <span className=""> Payment Details</span>
                      </h3>
                      <p>
                        <strong>Mode:</strong> {previewInvoice.paymentMode}
                      </p>
                      {previewInvoice.paymentMethod && (
                        <p>
                          <strong>Method:</strong>{" "}
                          {previewInvoice.paymentMethod}
                        </p>
                      )}
                      {/* <p>
                        <strong>Current Balance:</strong>{" "}
                        {formatCurrency(previewInvoice.balance)}
                      </p> */}
                    </div>
                  </div>

                  {/* ---------- Products Table ---------- */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-3">
                      Itemized Charges
                    </h3>
                    {/* 3. RESPONSIVE TABLE: Add overflow-x-auto so the table 
                can be scrolled horizontally on very small screens (like a narrow phone). 
                The 'print:table' ensures it renders as a proper table on paper.
              */}
                    <div className="overflow-x-auto print:overflow-visible">
                      <table className="w-full border-collapse min-w-[500px] print:min-w-full">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr className="text-left text-xs font-semibold uppercase text-gray-600">
                            <th className="p-3 w-8 sm:w-10">#</th>
                            <th className="p-3">Product</th>

                            <th className="p-3 text-center w-16 sm:w-20">
                              Qty
                            </th>
                            <th className="p-3 text-right w-20 sm:w-24">
                              Price/Unit
                            </th>
                            {taxType === "taxable" && (
                              <th className="p-3 text-right w-14 sm:w-16">
                                Tax
                              </th>
                            )}
                            <th className="p-3 text-right w-28 sm:w-32">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(previewInvoice.products || []).map((p, i) => (
                            <tr
                              key={i}
                              className="text-gray-700 odd:bg-gray-50 text-sm"
                            >
                              <td className="p-3 border-b border-gray-200">
                                {i + 1}
                              </td>
                              <td className="p-3 border-b border-gray-200">
                                {p.name}
                              </td>
                              <td className="p-3 border-b border-gray-200 text-center">
                                {p.qty}
                              </td>
                              <td className="p-3 border-b border-gray-200 text-right">
                                ₹{Number(p.price).toFixed(2)}
                              </td>
                              {taxType === "taxable" && (
                                <td className="p-3 border-b border-gray-200 text-right">
                                  {p.tax}%
                                </td>
                              )}
                              <td className="p-3 border-b border-gray-200 text-right font-medium">
                                ₹
                                {Number(
                                  p.total ||
                                    p.qty * p.price +
                                      (p.qty * p.price * p.tax) / 100
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ---------- Summary & Notes ---------- */}
                  {/* Swapping flex-row to flex-col on mobile for stacking */}
                  <div className="flex flex-col sm:flex-row justify-between pt-4 border-t-2 border-gray-400">
                    {/* Notes & Payment Section */}
                    {/* Changed sm:w-1/2 to w-full sm:w-1/2 for mobile first width */}
                    <div className="w-full sm:w-1/2 text-sm">
                      <h3 className="font-bold text-base mb-1 text-gray-700">
                        Details:
                      </h3>
                      <div className="text-gray-600 italic border p-3 bg-gray-50 rounded min-h-[50px] space-y-1">
                        <p>
                          <strong>Payment Mode:</strong>{" "}
                          {previewInvoice.paymentMode || paymentMode}
                        </p>
                        {paymentMode == "cash" && (
                          <p>
                            <strong>Payment Method:</strong>{" "}
                            {previewInvoice.paymentMethod || paymentMethod}{" "}
                            {previewInvoice.transactionId
                              ? `/ ${previewInvoice.transactionId}`
                              : ""}
                          </p>
                        )}
                        {previewInvoice.note && (
                          <p>
                            <strong>Note:</strong> {previewInvoice.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Summary Totals */}
                    {/* Changed sm:w-1/3 to w-full sm:w-1/3 for mobile first width */}
                    <div className="w-full sm:w-1/3 mt-6 sm:mt-0">
                      <div className="space-y-1 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-medium">
                            ₹
                            {Number(
                              previewInvoice.subtotal || invoiceSummary.subtotal
                            ).toFixed(2)}
                          </span>
                        </div>

                        {taxType === "taxable" && (
                          <>
                            <div className="flex justify-between">
                              <span>CGST:</span>
                              <span className="font-medium">
                                ₹
                                {Number(
                                  previewInvoice.tax / 2 ||
                                    invoiceSummary.totalTax / 2
                                ).toFixed(2)}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>SGST:</span>
                              <span className="font-medium">
                                ₹
                                {Number(
                                  previewInvoice.tax / 2 ||
                                    invoiceSummary.totalTax / 2
                                ).toFixed(2)}
                              </span>
                            </div>
                          </>
                        )}

                        {previewInvoice.deliveryFee ||
                        invoiceSummary.deliveryFee ? (
                          <div className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span className="font-medium">
                              ₹
                              {Number(
                                previewInvoice.deliveryFee ||
                                  invoiceSummary.deliveryFee
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        {previewInvoice.packingCharges ||
                        invoiceSummary.packingCharges ? (
                          <div className="flex justify-between">
                            <span>Packing Charges:</span>
                            <span className="font-medium">
                              ₹
                              {Number(
                                previewInvoice.packingCharges ||
                                  invoiceSummary.packingCharges
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        {previewInvoice.other || invoiceSummary.other ? (
                          <div className="flex justify-between">
                            <span>Other:</span>
                            <span className="font-medium">
                              ₹
                              {Number(
                                previewInvoice.other || invoiceSummary.other
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}

                        {previewInvoice.discount || invoiceSummary.discount ? (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="font-medium text-red-600">
                              -&nbsp;₹
                              {Number(
                                previewInvoice.discount ||
                                  invoiceSummary.discount
                              ).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* Total, Paid, Due */}
                      <div className="mt-3 pt-3 border-t border-gray-400">
                        <div className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
                          <span className="text-base font-bold text-gray-800">
                            TOTAL:
                          </span>
                          <span className="text-base font-bold text-gray-800">
                            ₹
                            {Number(
                              previewInvoice.total || invoiceSummary.total
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Amount Paid:</span>
                          <span className="font-medium text-green-600">
                            ₹
                            {Number(
                              previewInvoice.totalReceived ||
                                invoiceSummary.totalReceived
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2 bg-blue-50 p-2 rounded">
                          <span className="text-lg font-bold text-blue-800">
                            TOTAL DUE:
                          </span>
                          <span className="text-lg font-bold text-blue-800">
                            ₹
                            {Number(
                              previewInvoice.dueBalance ||
                                invoiceSummary.dueBalance
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-500 mt-6">
                    Generated By SmartUdhar - Computer Generated Invoice.
                  </div>
                </div>
              )}
            </div>

            {/* ---------- Modal Footer Buttons ---------- */}
            <div className="flex justify-end gap-3 p-4 border-t">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Submit Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="bg-white shadow-customCard  border rounded-lg p-4">
        <h2 className="text-lg font-robotoSb mb-4 hidden">Invoice Summary</h2>
        <ul className="text-sm font-robotoR text-black space-y-3 hidden">
          <li className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{invoiceSummary.subtotal.toFixed(2)}</span>
          </li>
          <li className="flex justify-between hidden">
            <span>Tax :</span>
            <span>₹{invoiceSummary.totalTax.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Total Received:</span>
            <span>₹{invoiceSummary.totalReceived.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Due Balance:</span>
            <span>₹{invoiceSummary.dueBalance.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>₹{invoiceSummary.deliveryFee.toFixed(2)}</span>
          </li>
          <li className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span>-₹{invoiceSummary.discount.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-robotoB text-lg border-t pt-1 mt-1">
            <span>Total:</span>
            <span>₹{invoiceSummary.total.toFixed(2)}</span>
          </li>
        </ul>
        {/* Previous Invoices Section */}
        <div className="mt-6">
          <h3 className="text-[22px] font-robotoSb mb-2">Invoices List</h3>

          {invoices.length === 0 ? (
            <p className="text-gray-500 text-sm">No invoices found.</p>
          ) : (
            invoices.map((inv, index) => (
              <div
                key={index}
                className="flex justify-between items-center shadow-customCard border-2 rounded-lg border-[#E5E7EB] text-sm p-2 mb-2"
              >
                <div>
                  <p className="font-robotoSb text-[16px]">{inv.name}</p>
                  <p className="text-gray-500 font-robotoR text-sm">
                    Last Paid:{" "}
                    {inv.updatedAt
                      ? new Date(inv.updatedAt).toLocaleDateString()
                      : new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-red-500 font-robotoM text-xs">
                    Due: ₹{inv.dueBalance?.toFixed(2) || 0}
                  </p>
                </div>

                <button
                  onClick={() => handleView(inv._id)}
                  className="bg-[#E6FEE2] text-[#16A34A] px-2 py-1 rounded-full font-robotoM text-xs"
                >
                  View Invoice
                </button>
              </div>
            ))
          )}
        </div>
        {/* 🟢 The requested Button component integration for pop-up messages */}
        {popupType && (
          <Button
            type={popupType}
            message={message}
            onClose={() => setPopupType(null)}
          />
        )}
      </div>
    </div>
  );
}
