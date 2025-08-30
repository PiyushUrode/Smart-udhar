import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardGuards from './layouts/DashboardGuards';
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
  
  {/* ✅ relative paths, no leading slash */}
  <Route path="information" element={<D2BasicDetails />} />
  <Route path="information/:id" element={<D2BasicDetails />} />

  <Route path="bussinessList" element={<D2BussinessList />} />

  <Route path="product" element={  <DashboardGuards>   <D3Product /> </DashboardGuards>  } />
  <Route path="product-list" element={    <DashboardGuards>  <D4ProductList />  </DashboardGuards>              } />
  
  <Route path="stock-list"        element={ <DashboardGuards>      <D4StockList /> </DashboardGuards> } />
  <Route path="staff-role"        element={ <DashboardGuards>      <D5StaffRole /> </DashboardGuards> } />
  <Route path="staff-details"     element={ <DashboardGuards>      <D5StaffDetails /> </DashboardGuards>} />
  <Route path="add-customer"      element={ <DashboardGuards>      <D6AddCustomer /> </DashboardGuards>} />
  <Route path="customer-details"  element={ <DashboardGuards>      <D6CustomerDetails /> </DashboardGuards>} />
  
  
  <Route path="create-invoice" element={    <DashboardGuards>         <D7CreateInvoice />  </DashboardGuards>} />
  <Route path="payment-collection" element={ <DashboardGuards>   <D8PaymentCollection />    </DashboardGuards> } />
  <Route path="payment-collectionList" element={ <DashboardGuards>   <D8PaymentCollectionList />    </DashboardGuards> } />

  <Route path="credit-score" element={ <DashboardGuards>   <D9CreditScore />    </DashboardGuards> } />
  <Route path="expenses" element={ <DashboardGuards>   <D10Expenses />    </DashboardGuards> } />
  <Route path="expenses-list" element={ <DashboardGuards>   <D10ExpensesList />    </DashboardGuards>  } />
  <Route path="statement-download" element={ <DashboardGuards>   <D11StatementDownload />    </DashboardGuards> } />
  <Route path="setting" element={ <DashboardGuards>   <D12Setting />    </DashboardGuards> } />
  <Route path="notification" element={ <DashboardGuards>   <D13Notification />    </DashboardGuards> } />
  <Route path="gst-calculator" element={ <DashboardGuards>   <D14GstCalculator />    </DashboardGuards> } />
  <Route path="gstreceipt" element={ <DashboardGuards>   <D14GstCalReceipt />    </DashboardGuards> } />
  <Route path="reward" element={ <DashboardGuards>   <D15Reward />    </DashboardGuards> } />
  <Route path="commingsoon" element={ <DashboardGuards>   <D16Commingsoon />    </DashboardGuards> } />
  <Route path="updates" element={  <DashboardGuards>  <D17Updates /> </DashboardGuards>  } />
  <Route path="supports" element={ <DashboardGuards>   <D18Supports />    </DashboardGuards> } />
  <Route path="amount-collection" element={ <DashboardGuards>   <A1AmountCollection />    </DashboardGuards> } />
  <Route path="average-credit-score" element={ <DashboardGuards>   <A2AverageCreditScore />    </DashboardGuards> } />
</Route>


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
