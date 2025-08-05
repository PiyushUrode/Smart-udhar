import { useState } from "react";
import { FaCommentSms } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
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

export default function D7CreateInvoice() {
  const [customer, setCustomer] = useState({
    name: "John Doe",
    id: "CUST001",
    phone: "+91 9876543210",
    balance: 2500,
    creditScore: "N/A",
  });

  const previousInvoices = [
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" },
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" },
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" },
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" },
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "10/06/2025" },
    { name: "Anamika Traders", lastPaid: "16/06/2025", due: "16/06/2025" },
  ];

  const [rows, setRows] = useState([
    {
      id: Date.now(),
      product: "",
      qty: 1,
      unit: "",
      price: "",
      tax: "18%",
      total: 0,
    },
  ]);

  const [milestones, setMilestones] = useState([
    {
      id: Date.now(),
      name: "Advance",
      amount: "",
      dueDate: "",
      status: "",
    },
  ]);

  const [showStep4, setShowStep4] = useState(false);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        product: "",
        qty: 1,
        unit: "",
        price: "",
        tax: "18%",
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: Date.now(),
        name: "",
        amount: "",
        dueDate: "",
        status: "",
      },
    ]);
  };

  const handlePaymentMode = (mode) => {
    setShowStep4(mode === 'debt');
  };


  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-6 mt-5 md:mt-10  bg-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-robotoB text-[#1F2937] mb-4">Create New Invoice</h1>

        {/* Steps 1 to 6 (same as before) */}
        <div className="space-y-6">
          {/* Step 1: Select Customer */}
          <div className="bg-white shadow-lg shadow-[#0000001A] rounded-md p-5">
            <h2 className="flex items-center gap-2 text-lg  font-robotoSb mb-4">
              <div className="bg-[#2563EB] p-2.5 rounded-full">
                <FaSearch color="white" size={14} />
              </div>
              Step 1: Select Customer
            </h2>

            {/* Search Input & Button */}
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Search Customer
            </label>
            <div className="w-full md:w-3/4 flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by name or mobile number"
                  className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <IoIosSearch
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60"
                  size={24}
                />
              </div>
              <button className="bg-green-600 font-robotoR hover:bg-green-700 text-white px-5 py-3 rounded-md text-md whitespace-nowrap">
                + Add New Customer
              </button>
            </div>

            {/* Customer Details */}
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <p className="font-robotoR">
                  <strong className="text-black font-robotoM">Name:</strong>{" "}
                  John Doe
                </p>
                <p className="font-robotoR">
                  <strong className="text-black font-robotoM">ID:</strong>{" "}
                  CUST001
                </p>
                <p className="font-robotoR">
                  <strong className="text-black font-robotoM">Phone:</strong>{" "}
                  +91 9876543210
                </p>
                <p className="font-robotoR">
                  <strong className="text-black font-robotoM">Balance:</strong>{" "}
                  ₹2,500
                </p>
                <p className="font-robotoR">
                  <strong className="text-black font-robotoM">
                    Credit Score:
                  </strong>{" "}
                  N/A
                </p>
              </div>
            </div>
          </div>



{/* Step 2: Add Products/Services */}
 <div className="max-w-7xl mx-auto  mt-5 md:mt-10 bg-gray-50  gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Step 2: Add Products */}
        <div className="bg-white rounded-md font-robotoB shadow-lg shadow-[#0000001A] p-4 sm:p-6 w-full max-w-6xl space-y-4">
          <h2 className="flex items-center gap-3 text-base sm:text-lg font-robotoSb text-gray-800">
            <div className="bg-[#2563EB] p-2 sm:p-3 rounded-full flex items-center justify-center">
              <FaBox color="white" size={16} />
            </div>
            Step 2: Add Products/Services
          </h2>

          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] flex flex-col space-y-5">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 text-sm font-semibold text-gray-700 border-b pb-3">
                <div className="col-span-2 text-black">Product/Service</div>
                <div className="text-black">Qty</div>
                <div className="text-black">Unit</div>
                <div className="text-black">Price</div>
                <div className="text-black">Tax</div>
                <div className="text-black">Total</div>
              </div>
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-7 gap-2 sm:gap-4 items-center text-sm">
                  <input className="col-span-2 border px-2 py-1 rounded bg-white" placeholder="Search products..." />
                  <input type="number" defaultValue={row.qty} className="border px-2 py-1 rounded bg-white" />
                  <input placeholder="Unit" className="border px-2 py-1 rounded bg-white" />
                  <input type="number" placeholder="0.00" className="border px-2 py-1 rounded bg-white" />
                  <input type="text" value="18%" readOnly className="border px-2 py-1 rounded bg-white" />
                  <div className="flex items-center gap-2">
                    ₹0.00
                    <button onClick={() => handleRemoveRow(row.id)} className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleAddRow} className="text-bluecol font-robotoM text-sm sm:text-md mt-2">+ Add Row</button>
        </div>


  {/* Step 3: Payment Mode */}
        <div className="bg-white rounded-md shadow-lg shadow-[#0000001A] p-4">
          <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-6">
            <div className=" bg-[#2563EB] p-2.5 rounded-full">
              <FaRegCreditCard color="white" size={14} />
            </div>
            Step 3: Payment Mode
          </h2>
          <div className="flex flex-col sm:flex-row space-x-3">
            <button onClick={() => handlePaymentMode('cash')} className="flex justify-center items-center gap-2 border border-bluecol hover:bg-bluecol hover:text-white text-bluecol ml-3 my-1 px-4 py-1 rounded font-robotoM text-md">
              <GiCash size={18} /> Cash
            </button>
            <button onClick={() => handlePaymentMode('debt')} className="flex justify-center items-center gap-2 border border-bluecol  hover:bg-bluecol hover:text-white text-bluecol my-1 px-4 py-1 rounded font-robotoM text-md">
              <FaCalculator size={18} /> Debt
            </button>
          </div>
        </div>

        {/* Step 4: Promise Date and Payment Method */}
        {showStep4 && (
          <>
            <div className="bg-white rounded-md shadow-lg shadow-[#0000001A] p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-robotoSb mb-3">
                <div className="bg-[#2563EB] p-2.5 rounded-full">
                  <FaCalculator color="white" size={14} />
                </div>
                Step 4: Promise Date
              </h2>

              <div className="hidden sm:grid grid-cols-4 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
                <div>Milestone Name</div>
                <div>Amount (₹)</div>
                <div>Due Date</div>
                <div>Status</div>
              </div>

              {milestones.map((ms) => (
                <div key={ms.id} className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-robotoR text-sm sm:text-md border border-gray-200 p-3 rounded">
                  <input className="border px-2 py-1 rounded bg-white" placeholder="Milestone Name" defaultValue={ms.name} />
                  <input className="border px-2 py-1 rounded bg-white" placeholder="0.00" type="number" />
                  <input className="border px-2 py-1 font-interR text-sm sm:text-md rounded bg-white" type="date" />
                  <input className="w-full h-10 border border-gray-300 pl-4 pr-10 py-2 rounded text-sm font-robotoR bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Status" />
                </div>
              ))}
              <button onClick={handleAddMilestone} className="text-bluecol font-robotoR text-sm sm:text-md mt-2">+ Add Milestone</button>
            </div>

            <div className="bg-white rounded-md shadow-lg shadow-[#0000001A] p-4">
              <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
                <div className="bg-[#2563EB] p-2.5 rounded-full">
                  <FaCalculator color="white" size={14} />
                </div>
                Step 4: Payment Method
              </h2>

              <div className="grid grid-cols-2 gap-2 items-center text-sm font-robotoM text-black mb-1 px-1">
                <div>Payment Method</div>
                <div>Transaction ID / UTR </div>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center font-robotoR text-md p-3 ">
                <input className="border px-2 py-1 rounded bg-white" placeholder="Cash/UPI/Cheque/DD" />
                <input className="border px-2 py-1 rounded bg-white" placeholder="Enter Transaction reference" />
              </div>

              <button className="text-bluecol font-robotoR text-md mt-2">+ Add Milestone</button>
            </div>
          </>
        )}
      </div>
    </div>

          {/* Step 5: Additional Charges */}
          <div className="bg-white rounded-md shadow-lg shadow-[#0000001A] p-4">
            <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
              {/* <img src={add} alt="add" /> */}
              <div className="bg-[#2563EB] p-2.5 rounded-full">
                <FaPlus color="white" size={14} />
              </div>
              Step 5: Additional Charges
            </h2>
            <div className="grid grid-cols-2 gap-3 font-robotoR text-md">
              <div>
                <label className="block text-sm mb-1 font-robotoM">
                  Delivery Fee
                </label>
                <input
                  className="w-full border px-2 py-1 rounded bg-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-robotoM">
                  Packing Charges
                </label>
                <input
                  className="w-full border px-2 py-1 rounded bg-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-robotoM">
                  Discount
                </label>
                <input
                  className="w-full border px-2 py-1 rounded bg-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-robotoM">Other</label>
                <input
                  className="w-full border px-2 py-1 rounded bg-white"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Step 6: Add Note */}
          {/* box-shadow: 0px 4px 6px 0px #0000001A;

box-shadow: 0px 2px 4px 0px #0000001A;
 */}
          <div className="bg-white rounded-md shadow-lg  shadow-[#0000001A] p-4">
            <h2 className="flex items-center gap-2 text-lg font-robotoSb mb-3">
              <div className="bg-[#2563EB] p-2.5 rounded-full">
                <FaEdit color="white" size={14} />
              </div>
              Step 6: Add Note (Optional)
            </h2>
            <textarea
              className="border w-full px-3 py-2 rounded font-robotoR text-md bg-white"
              rows="3"
              placeholder="Terms & Conditions, Special instructions, Internal notes..."
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-start gap-4 p-4">
          <button className="bg-gray-600 text-white font-robotoR text-md px-4 py-2 rounded">
            Save as Draft
          </button>
          <button className="flex justify-center items-center gap-2 bg-bluecol text-white font-robotoM text-md px-4 py-2 rounded">
            <LuNewspaper size={24} />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-white shadow-lg shadow-[#0000001A] rounded-md p-4">
        <h2 className="text-lg font-robotoSb mb-4">Invoice Summary</h2>
        <ul className="text-sm font-robotoR text-black space-y-3">
          <li className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Tax (18%):</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Total Received:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Due Balance:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Paid / Not Paid:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>₹0.00</span>
          </li>
          <li className="flex justify-between text-red-500">
            <span>Discount:</span>
            <span>-₹0.00</span>
          </li>
          <li className="flex justify-between font-robotoB text-lg border-t pt-1 mt-1">
            <span>Total:</span>
            <span>₹0.00</span>
          </li>
        </ul>

        <div className="mt-6 space-y-2">
          <h3 className="text-md font-robotoM">Quick Actions</h3>
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaPrint color="#4B5563" />
            Print Invoice
          </button>
          <br />
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaWhatsapp color="#16A34A" />
            Share via WhatsApp
          </button>
          <br />
          <button className="flex items-center gap-2 text-black font-robotoR text-md">
            <FaCommentSms color="#2563EB" />
            Send via SMS
          </button>
        </div>


        <div className="mt-6">
          <h3 className="text-[22px] font-robotoSb mb-2">Previous Invoices</h3>
          {previousInvoices.map((inv, index) => (
            <div
              key={index}
              className="flex justify-between items-center shadow-lg shadow-[#0000001A] border-2 rounded-md border-[#E5E7EB] text-sm p-2 mb-2"
            >
              <div>
                <p className="font-robotoSb text-[16px]">{inv.name}</p>
                <p className="text-gray-500 font-robotoR text-sm">
                  Last Paid: {inv.lastPaid}
                </p>
                <p className="text-red-500 font-robotoM text-xs">
                  Due: {inv.due}
                </p>
              </div>
              <button className="bg-[#E6FEE2] text-[#16A34A] px-2 py-1 rounded-full font-robotoM text-xs">
                View Invoice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}