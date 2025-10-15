import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

import SideNavbar from './presentation/components/SideNavbar';
import SideNavbarEmployee from './presentation/components/SideNavbarEmployee';
import Home from './presentation/pages/manager/home/page';
import Login from './presentation/pages/login/page';
import Register from './presentation/pages/register/page';
import EmailVerification from './presentation/pages/email-verification/page';
import ForgotPassword from './presentation/pages/forgot-password/page';
import ResetPassword from './presentation/pages/reset-password/page';

import PayslipDetailsPage from './presentation/pages/manager/invoice/page';
import Reports from './presentation/pages/manager/reports/page';
import AuditsPage from './presentation/pages/manager/audits/page';
import AuditDetailsPage from './presentation/pages/manager/audits/details/page';
import Settings from './presentation/pages/manager/profile/page';
import Management from './presentation/pages/manager/management/page';
import BalanceSheet from './presentation/pages/manager/reports/BalanceSheet/BalanceSheet';
import CashFlow from './presentation/pages/manager/reports/CashFlow/CashFlow';
import Income from './presentation/pages/manager/reports/Income/Income';
import Invest from './presentation/pages/manager/reports/Invest/Invest';
import PayrollSummary from './presentation/pages/manager/reports/PayrollSummary/PayrollSummary';
import CompliancePage from './presentation/pages/manager/profile/compliance/page';
import EmployeeHome from './presentation/pages/employee/home/page';
import EmployeeHistory from './presentation/pages/employee/history/page';


import EmployeeSettings from './presentation/pages/employee/settings/page';
import TaxSummary from './presentation/pages/manager/reports/TaxSummary/TaxSummary';

import { WalletViewModelProvider } from './context/WalletViewModelContext';
import MiddlewareRoute from './middleware/AuthMiddleware';
import { container } from './di/container'; // Import the container
import { ToastProvider } from './presentation/components/Toast/ToastProvider';


const ManagerLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbar onExpansionChange={setIsSidebarExpanded} />
      <main
        className={`flex-grow flex flex-col items-start justify-start bg-gray-50 w-full pl-0 transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-52' : 'lg:pl-16'
          }`}
      >        <Outlet />
      </main>
    </div>
  );
};

const EmployeeLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideNavbarEmployee onExpansionChange={setIsSidebarExpanded} />
      <main
        className={`flex-grow flex flex-col items-start justify-start bg-gray-50 w-full pl-0 transition-all duration-300 ${isSidebarExpanded ? 'lg:pl-52' : 'lg:pl-16'
          }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const walletViewModel = container.walletViewModel();

  // Auto-reconnect wallet on app load (handled within hooks/viewmodels as needed)

  return (
    <ToastProvider>
      <WalletViewModelProvider value={walletViewModel}>
        <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
              <Register />
            </div>
          } />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ManagerLayout />}>
            <Route path="/home" element={
              <MiddlewareRoute isAuthenticated={true} role="manager" requiredRole="manager">
                <Home />
              </MiddlewareRoute>} />
            <Route path="/management" element={<Management />} />
            <Route path="/invoice" element={<PayslipDetailsPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audits" element={<AuditsPage />} />
            <Route path="/audits/:auditId" element={<AuditDetailsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/balance_sheet" element={<BalanceSheet />} />
            <Route path="/cash_flow" element={<CashFlow />} />
            <Route path="/income" element={<Income />} />
            <Route path="/invest" element={<Invest />} />
            <Route path="/payroll_summary" element={<PayrollSummary />} />
            <Route path="/tax_summary" element={<TaxSummary />} />
            <Route path="/compliance" element={<CompliancePage />} />



          </Route>

          <Route element={<EmployeeLayout />}>
            <Route path="/employee/home" element={
              <MiddlewareRoute isAuthenticated={true} role="employee" requiredRole="employee">
                <EmployeeHome />
              </MiddlewareRoute>} />
            <Route path="/employee/history" element={<EmployeeHistory />} />

            <Route path="/employee/settings" element={<EmployeeSettings />} />

          </Route>
        </Routes>
        </Router>
      </WalletViewModelProvider>
    </ToastProvider>
  );
}

export default App;

