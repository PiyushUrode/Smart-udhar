import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardGuards from "./layouts/DashboardGuards.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Homepage from "./user/Pages/Homepage.jsx";
import LoginPage from "./user/Pages/LoginPage.jsx";
import SignUpPage from "./user/Pages/Signuppage.jsx";

import D1DashboardHome from "./user/Pages/dashboard/D1DashboardHome.jsx";
import D2BasicDetails from "./user/Pages/dashboard/D2BasicDetails.jsx";
import D2BussinessList from "./user/Pages/dashboard/D2BussinessList.jsx";
import D3Product from "./user/Pages/dashboard/D3Product.jsx";
import D4ProductList from "./user/Pages/dashboard/D4ProductList.jsx";
import D4StockList from "./user/Pages/dashboard/D4StockList.jsx"
import D5StaffRole from "./user/Pages/dashboard/D5StaffRole.jsx";
import D5StaffDetails from "./user/Pages/dashboard/D5StaffDetails.jsx";
import D6AddCustomer from "./user/Pages/dashboard/D6AddCustomer.jsx";
import D6CustomerDetails from "./user/Pages/dashboard/D6CustomerDetails.jsx";
import D7CreateInvoice from "./user/Pages/dashboard/D7CreateInvoice.jsx";
import D8PaymentCollection from "./user/Pages/dashboard/D8PaymentCollection.jsx";
import D8PaymentCollectionList from "./user/Pages/dashboard/D8PaymentCollectionList.jsx";
import D9CreditScore from "./user/Pages/dashboard/D9CreditScore.jsx";
import D10Expenses from "./user/Pages/dashboard/D10Expenses.jsx";
import D10ExpensesList from "./user/Pages/dashboard/D10ExprenseList.jsx";
import D11StatementDownload from "./user/Pages/dashboard/D11StatementDownload.jsx";
import D12Setting from "./user/Pages/dashboard/D12Setting.jsx";
import D13Notification from "./user/Pages/dashboard/D13Notification.jsx";
import D14GstCalculator from "./user/Pages/dashboard/D14GstCalculator.jsx";
import D14GstCalReceipt from "./user/Pages/dashboard/D14GstCalReceipt.jsx";
import D15Reward from "./user/Pages/dashboard/D15Reward.jsx";
import D16Commingsoon from "./user/Pages/dashboard/D16Commingsoon.jsx";
import D17Updates from "./user/Pages/dashboard/D17Updates.jsx";
import D18Supports from "./user/Pages/dashboard/D18Supports.jsx";
import A1AmountCollection from "./user/Pages/dashboard/A1AmountCollection.jsx";
import A2AverageCreditScore from "./user/Pages/dashboard/A2AverageCreditScore.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // adjust as per your logic

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignUpPage />} />

<Route path="/dashboard/*" element={<DashboardLayout />}>
  <Route index element={<D1DashboardHome />} />

  {/* Ye pages hamesha accessible (guard ke bahar) */}
  <Route path="information" element={<D2BasicDetails />} />
  <Route path="information/:id" element={<D2BasicDetails />} />
  <Route path="bussinessList" element={<D2BussinessList />} />

  {/* ✅ Ye sab guard ke andar */}
  <Route
    path="*"
    element={
      <DashboardGuards>
        <Routes>
          <Route path="product" element={<D3Product />} />
          <Route path="product/:id" element={<D3Product />} />
          <Route path="product-list" element={<D4ProductList />} />
          <Route path="stock-list" element={<D4StockList />} />
          <Route path="staff-role" element={<D5StaffRole />} />
          <Route path="staff-details/:id" element={<D5StaffDetails />} />
          <Route path="staff-details" element={<D5StaffDetails />} />
          <Route path="add-customer" element={<D6AddCustomer />} />
          <Route path="customer-details" element={<D6CustomerDetails />} />
          <Route path="create-invoice" element={<D7CreateInvoice />} />
          <Route path="payment-collection" element={<D8PaymentCollection />} />
          <Route path="payment-collectionList" element={<D8PaymentCollectionList />} />
          <Route path="credit-score" element={<D9CreditScore />} />
          <Route path="expenses" element={<D10Expenses />} />
          <Route path="expenses-list" element={<D10ExpensesList />} />
          <Route path="statement-download" element={<D11StatementDownload />} />
          <Route path="setting" element={<D12Setting />} />
          <Route path="setting/:id" element={<D12Setting />} />
          <Route path="notification" element={<D13Notification />} />
          <Route path="gst-calculator" element={<D14GstCalculator />} />
          <Route path="gstreceipt" element={<D14GstCalReceipt />} />
          <Route path="reward" element={<D15Reward />} />
          <Route path="commingsoon" element={<D16Commingsoon />} />
          <Route path="updates" element={<D17Updates />} />
          <Route path="supports" element={<D18Supports />} />
          <Route path="amount-collection" element={<A1AmountCollection />} />
          <Route path="average-credit-score" element={<A2AverageCreditScore />} />
        </Routes>
      </DashboardGuards>
    }
  />
</Route>



        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
