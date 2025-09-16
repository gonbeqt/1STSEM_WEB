import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

// Middleware imports
import { 
  AuthMiddleware, 
  RequireManager, 
  RequireEmployee, 
  RequireApproval, 
  PublicOnly 
} from './middleware/AuthMiddleware';

// Component imports
import SideNavbar from './presentation/components/SideNavbar';
import SideNavbarEmployee from './presentation/components/SideNavbarEmployee';
import Home from './presentation/pages/manager/home/page';
import Login from './presentation/pages/login/page';
import Register from './presentation/pages/register/page';
import WaitingForApproval from './presentation/pages/waitingScreen/waiting-for-approval';

// Manager pages
import Invoice from './presentation/pages/manager/invoice/page';
import Reports from './presentation/pages/manager/reports/page';
import Settings from './presentation/pages/manager/profile/page';
import Management from './presentation/pages/manager/management/page';
import BalanceSheet from './presentation/pages/manager/reports/BalanceSheet/BalanceSheet';
import InvoiceReceipt from './presentation/pages/manager/invoice/InvoiceReceipt/InvoiceReceipt';
import CashFlow from './presentation/pages/manager/reports/CashFlow/CashFlow';
import Income from './presentation/pages/manager/reports/Income/Income';
import Invest from './presentation/pages/manager/reports/Invest/Invest';
import PayrollSummary from './presentation/pages/manager/reports/PayrollSummary/PayrollSummary';
import TaxSummary from './presentation/pages/manager/reports/TaxSummary/TaxSummary';
import { ManagerSessionsPage } from './presentation/pages/manager/profile/sessions/page';

// Employee pages
import EmployeeHome from './presentation/pages/employee/home/page';
import EmployeePayslip from './presentation/pages/employee/payslip/page';
import EmployeeHistory from './presentation/pages/employee/history/page';
import EmployeeSettings from './presentation/pages/employee/settings/page';
import TransactionDetails from './presentation/pages/employee/home/TransactionDetails/TransactionDetails';

// Domain and context imports
import { GetWalletBalanceUseCase } from './domain/usecases/GetWalletBalanceUseCase';
import { ReconnectWalletUseCase } from './domain/usecases/ReconnectWalletUseCase';
import { ConnectWalletUseCase } from './domain/usecases/ConnectWalletUseCase';
import { WalletViewModel } from './domain/models/WalletViewModal';
import { WalletViewModelProvider } from './context/WalletViewModelContext';
import { WalletRepositoryImpl } from './domain/repositoriesImpl/WalletRepositoryImpl';

const walletRepository = new WalletRepositoryImpl();

const walletViewModel = new WalletViewModel(
  new ConnectWalletUseCase(walletRepository),
  new ReconnectWalletUseCase(walletRepository),
  new GetWalletBalanceUseCase(walletRepository)
);

// Layout components with middleware protection
const ManagerLayout = () => (
  <RequireManager>
    <div className="app-container">
      <SideNavbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  </RequireManager>
);

const EmployeeLayout = () => (
  <RequireEmployee>
    <div className="app-container">
      <SideNavbarEmployee />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  </RequireEmployee>
);

function App() {
  useEffect(() => {
    walletViewModel.checkWalletConnection();
  }, []);

  return (
    <WalletViewModelProvider value={walletViewModel}>
      <Router>
        <Routes>
          {/* Public routes - redirect to home if already authenticated */}
          <Route 
            path="/" 
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicOnly>
                <div className="register-page-wrapper">
                  <Register />
                </div>
              </PublicOnly>
            } 
          />

          {/* Waiting for approval route - requires auth but not approval */}
          <Route 
            path="/waiting-approval" 
            element={
              <AuthMiddleware requireAuth={true} requireApproval={false}>
                <WaitingForApproval />
              </AuthMiddleware>
            } 
          />
          
          {/* Manager routes - requires auth, approval, and Manager role */}
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
            <Route path="/payroll_summary" element={<PayrollSummary />} />
            <Route path="/tax_summary" element={<TaxSummary />} />
            <Route path="/manager/sessions" element={<ManagerSessionsPage />} />
          </Route>

          {/* Employee routes - requires auth, approval, and Employee role */}
          <Route element={<EmployeeLayout />}>
            <Route path="/employee/home" element={<EmployeeHome />} />
            <Route path="/employee/payslip" element={<EmployeePayslip />} />
            <Route path="/employee/history" element={<EmployeeHistory />} />
            <Route path="/employee/settings" element={<EmployeeSettings />} />
            <Route path="/transaction_details" element={<TransactionDetails />} />
          </Route>

          {/* Catch-all route - redirect to appropriate home based on user role */}
          <Route 
            path="*" 
            element={
              <RequireApproval>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100vh',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                  <button 
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      window.location.href = user.role === 'Manager' ? '/home' : '/employee/home';
                    }}
                    style={{
                      padding: '12px 24px',
                      background: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Home
                  </button>
                </div>
              </RequireApproval>
            }
          />
        </Routes>
      </Router>
    </WalletViewModelProvider>
  );
}

export default App;