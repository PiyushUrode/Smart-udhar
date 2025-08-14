import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

import Homepage from './Pages/Homepage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/Signuppage';
import DashboardLayout from './layouts/DashboardLayout';

import D1DashboardHome from './Pages/dashboard/D1DashboardHome';
import D2BasicDetails from './Pages/dashboard/D2BasicDetails';
import D2BussinessList from './Pages/dashboard/D2BussinessList';
import D3Product from './Pages/dashboard/D3Product';
import D4ProductList from './Pages/dashboard/D4ProductList';
import D4StockList from "./Pages/dashboard/D4StockList"
import D5StaffRole from './Pages/dashboard/D5StaffRole';
import D5StaffDetails from './Pages/dashboard/D5StaffDetails';
import D6AddCustomer from './Pages/dashboard/D6AddCustomer';
import D6CustomerDetails from './Pages/dashboard/D6CustomerDetails';
import D7CreateInvoice from './Pages/dashboard/D7CreateInvoice';
import D8PaymentCollection from './Pages/dashboard/D8PaymentCollection';
import D8PaymentCollectionList from './Pages/dashboard/D8PaymentCollectionList';
import D9CreditScore from './Pages/dashboard/D9CreditScore';
import D10Expenses from './Pages/dashboard/D10Expenses';
import D10ExpensesList from './Pages/dashboard/D10ExprenseList';
import D11StatementDownload from './Pages/dashboard/D11StatementDownload';
import D12Setting from './Pages/dashboard/D12Setting';
import D13Notification from './Pages/dashboard/D13Notification';
import D14GstCalculator from './Pages/dashboard/D14GstCalculator';
import D14GstCalReceipt from './Pages/dashboard/D14GstCalReceipt';
import D15Reward from './Pages/dashboard/D15Reward';
import D16Commingsoon from './Pages/dashboard/D16Commingsoon';
import D17Updates from './Pages/dashboard/D17Updates';
import D18Supports from './Pages/dashboard/D18Supports';
import A1AmountCollection from './Pages/dashboard/A1AmountCollection';
import A2AverageCreditScore from './Pages/dashboard/A2AverageCreditScore';

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
          <Route path="information" element={<D2BasicDetails />} />
          <Route path="bussinessList" element={<D2BussinessList />} />

          <Route path="product" element={<D3Product />} />
          <Route path="product-list" element={<D4ProductList />} />
          <Route path="stock-list" element={<D4StockList />} />
          
          <Route path="staff-role" element={<D5StaffRole />} />
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
          <Route path="notification" element={<D13Notification />} />
          <Route path="gst-calculator" element={<D14GstCalculator />} />
          <Route path="gstreceipt" element={<D14GstCalReceipt />} />
          <Route path="reward" element={<D15Reward />} />
          <Route path="commingsoon" element={<D16Commingsoon />} />
          <Route path="updates" element={<D17Updates />} />
          <Route path="supports" element={<D18Supports />} />
          <Route path="amount-collection" element={<A1AmountCollection />} />
          <Route path="average-credit-score" element={<A2AverageCreditScore />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
