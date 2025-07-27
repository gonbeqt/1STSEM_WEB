import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Presentation/Components/Navbar';
import SideNavbar from './Presentation/Components/SideNavbar';
import Home from './Presentation/Page/home/page';
import Login from './Presentation/Page/login/page';
import Register from './Presentation/Page/register/page';
import Payroll from './Presentation/Page/payroll/page';
import Invoice from './Presentation/Page/invoice/page';
import Reports from './Presentation/Page/reports/page';
import Support from './Presentation/Page/support/page';
import Settings from './Presentation/Page/settings/page';

const AppContent = () => {
  const location = useLocation();
  const showSideNavbar = ['/home', '/payroll', '/invoice', '/reports', '/support', '/settings'].includes(location.pathname);

  return (
    <div className="app-container">
        {showSideNavbar && <SideNavbar />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

