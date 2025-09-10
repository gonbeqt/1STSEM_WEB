import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

import SideNavbar from './Presentation/Components/SideNavbar';
import SideNavbarEmployee from './Presentation/Components/SideNavbarEmployee';
import Home from './Presentation/Page/manager/home/page';
import Login from './Presentation/Page/login/page';
import Register from './Presentation/Page/register/page';

import Invoice from './Presentation/Page/manager/invoice/page';
import Reports from './Presentation/Page/manager/reports/page';
import Settings from './Presentation/Page/manager/settings/page';
import Management from './Presentation/Page/manager/management/page';
import BalanceSheet from './Presentation/Page/manager/reports/BalanceSheet/BalanceSheet';
import InvoiceReceipt from './Presentation/Page/manager/invoice/InvoiceReceipt/InvoiceReceipt';
import CashFlow from './Presentation/Page/manager/reports/CashFlow/CashFlow';
import Income from './Presentation/Page/manager/reports/Income/Income';
import Invest from './Presentation/Page/manager/reports/Invest/Invest';

import EmployeeHome from './Presentation/Page/employee/home/page';
import EmployeePayslip from './Presentation/Page/employee/payslip/page';
import EmployeeHistory from './Presentation/Page/employee/history/page';
import EmployeeSettings from './Presentation/Page/employee/settings/page';
import TransactionDetails from './Presentation/Page/employee/home/TransactionDetails/TransactionDetails';


const ManagerLayout = () => (
  <div className="app-container">
    <SideNavbar />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

const EmployeeLayout = () => (
  <div className="app-container">
    <SideNavbarEmployee />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div className="register-page-wrapper"><Register /></div>} />
        <Route element={<ManagerLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/management" element={<Management />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/balance_sheet" element={<BalanceSheet />} />
          <Route path="/invoice_receipt" element={<InvoiceReceipt />} />
          <Route path="/cash_flow" element={<CashFlow />} />
          <Route path="/income" element={<Income />} />
          <Route path="/invest" element={<Invest />} />


        </Route>

        <Route element={<EmployeeLayout />}>
          <Route path="/employee/home" element={<EmployeeHome />} />
          <Route path="/employee/payslip" element={<EmployeePayslip />} />
          <Route path="/employee/history" element={<EmployeeHistory />} />
          <Route path="/employee/settings" element={<EmployeeSettings />} />
          <Route path="/transaction_details" element={<TransactionDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

