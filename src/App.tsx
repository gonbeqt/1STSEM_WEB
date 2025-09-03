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
import ExpensesPage from './Presentation/Page/manager/home/homeExpenses/page';
import EmployeeDetails from './Presentation/Page/manager/home/Tabs/Payroll/EmployeeDetails';
import PayrollOverview from './Presentation/Page/manager/home/Tabs/Payroll/PayrollOverview';
import ServiceDetails from './Presentation/Page/manager/home/Tabs/Service/ServiceDetails';
import ServiceOverview from './Presentation/Page/manager/home/Tabs/Service/ServiceOverview';
import AddEmployee from './Presentation/Page/manager/management/AddEmployee/AddEmployee';
import ManagementEmployeeDetails from './Presentation/Page/manager/management/EmployeeDetails/ManagementEmployeeDetails';
import BalanceSheet from './Presentation/Page/manager/reports/BalanceSheet/BalanceSheet';
import Assets from './Presentation/Page/manager/reports/BalanceSheet/Assets/Assets';
import Liabilities from './Presentation/Page/manager/reports/BalanceSheet/Liabilities/Liabilities';
import Equity from './Presentation/Page/manager/reports/BalanceSheet/Equity/Equity';


import EmployeeHome from './Presentation/Page/employee/home/page';
import EmployeePayslip from './Presentation/Page/employee/payslip/page';
import EmployeeHistory from './Presentation/Page/employee/history/page';
import EmployeeSettings from './Presentation/Page/employee/settings/page';
import Payslip from './Presentation/Page/manager/reports/Payslip/Payslip';
import GeneralReports from './Presentation/Page/manager/reports/GeneralReports/GeneralReports';
import InvoiceDetails from './Presentation/Page/manager/invoice/InvoiceDetails/InvoiceDetails';
import InvoiceReceipt from './Presentation/Page/manager/invoice/InvoiceReceipt/InvoiceReceipt';
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
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/manager/payroll/employee/:id" element={<EmployeeDetails />} />
          <Route path="/manager/payroll/overview" element={<PayrollOverview />} />
          <Route path="/manager/service/:id" element={<ServiceDetails />} />
          <Route path="/service/overview" element={<ServiceOverview />} />
          <Route path="/management" element={<Management />} />
          <Route path="/add_employee" element={<AddEmployee />} />
          <Route path="/management/employee/:id" element={<ManagementEmployeeDetails />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/balance_sheet" element={<BalanceSheet />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/liabilities" element={<Liabilities />} />
          <Route path="/equity" element={<Equity />} />
          <Route path="/payslip" element={<Payslip />} />
          <Route path="/general_reports" element={<GeneralReports />} />
          <Route path="/invoice_details/:id" element={<InvoiceDetails />} />
          <Route path="/invoice_receipt" element={<InvoiceReceipt />} />
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

