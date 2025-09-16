import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

import SideNavbar from './presentation/components/SideNavbar';
import SideNavbarEmployee from './presentation/components/SideNavbarEmployee';
import Home from './presentation/pages/manager/home/page';
import Login from './presentation/pages/login/page';
import Register from './presentation/pages/register/page';

import Invoice from './presentation/pages/manager/invoice/page';
import Reports from './presentation/pages/manager/reports/page';
import AuditsPage from './presentation/pages/manager/audits/page';
import AuditDetailsPage from './presentation/pages/manager/audits/details/page';
import Settings from './presentation/pages/manager/profile/page';
import Management from './presentation/pages/manager/management/page';
import BalanceSheet from './presentation/pages/manager/reports/BalanceSheet/BalanceSheet';
import InvoiceReceipt from './presentation/pages/manager/invoice/InvoiceReceipt/InvoiceReceipt';
import CashFlow from './presentation/pages/manager/reports/CashFlow/CashFlow';
import Income from './presentation/pages/manager/reports/Income/Income';
import Invest from './presentation/pages/manager/reports/Invest/Invest';
import PayrollSummary from './presentation/pages/manager/reports/PayrollSummary/PayrollSummary';

import EmployeeHome from './presentation/pages/employee/home/page';
import EmployeePayslip from './presentation/pages/employee/payslip/page';
import EmployeeHistory from './presentation/pages/employee/history/page';
import EmployeeSettings from './presentation/pages/employee/settings/page';
import TransactionDetails from './presentation/pages/employee/home/TransactionDetails/TransactionDetails';
import TaxSummary from './presentation/pages/manager/reports/TaxSummary/TaxSummary';
import { ManagerSessionsPage } from './presentation/pages/manager/profile/sessions/page';
import { GetWalletBalanceUseCase } from './domain/usecases/GetWalletBalanceUseCase';
import { ReconnectWalletUseCase } from './domain/usecases/ReconnectWalletUseCase';
import { ConnectWalletUseCase } from './domain/usecases/ConnectWalletUseCase';
import { WalletViewModel } from './domain/models/WalletViewModal';
import { WalletViewModelProvider } from './context/WalletViewModelContext';

import { WalletRepositoryImpl } from './domain/repositoriesImpl/WalletRepositoryImpl';
import MiddlewareRoute from './middleware/AuthMiddleware';
import WaitingApprovalPage from './presentation/pages/waiting-approval/page';
import { SendEthUseCase } from './domain/usecases/SendEthUseCase'; // Import SendEthUseCase

const walletRepository = new WalletRepositoryImpl();

const walletViewModel = new WalletViewModel(
  new ConnectWalletUseCase(walletRepository),
  new ReconnectWalletUseCase(walletRepository),
  new GetWalletBalanceUseCase(walletRepository),
  new SendEthUseCase(walletRepository) // Add SendEthUseCase
);
  
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
  useEffect(() => {
    walletViewModel.checkWalletConnection();
  }, []);

  return (
    <WalletViewModelProvider value={walletViewModel}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<div className="register-page-wrapper"><Register /></div>} />
          <Route path="/waiting-approval" element={<WaitingApprovalPage />} />
        <Route element={<ManagerLayout />}>
          <Route path="/home" element={
            <MiddlewareRoute isAuthenticated={true} role="manager" requiredRole="manager">
          <Home />
           </MiddlewareRoute>} />
          <Route path="/management" element={<Management />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/audits" element={<AuditsPage />} />
          <Route path="/audits/:auditId" element={<AuditDetailsPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/balance_sheet" element={<BalanceSheet />} />
          <Route path="/invoice_receipt" element={<InvoiceReceipt />} />
          <Route path="/cash_flow" element={<CashFlow />} />
          <Route path="/income" element={<Income />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/payroll_summary" element={<PayrollSummary />} />
          <Route path="/tax_summary" element={<TaxSummary />} />
          <Route path="/manager/sessions" element={<ManagerSessionsPage />} />



        </Route>

        <Route element={<EmployeeLayout />}>
          <Route path="/employee/home" element={ 
            <MiddlewareRoute isAuthenticated={true} role="employee" requiredRole="employee">
            <EmployeeHome />
          </MiddlewareRoute>} />
          <Route path="/employee/payslip" element={<EmployeePayslip />} />
          <Route path="/employee/history" element={<EmployeeHistory />} />
          <Route path="/employee/settings" element={<EmployeeSettings />} />
          <Route path="/transaction_details" element={<TransactionDetails />} />
        </Route>
      </Routes>
    </Router>
    </WalletViewModelProvider>
  );
}

export default App;

