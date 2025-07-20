import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import SideNavbar from './Components/SideNavbar';
import Home from './Page/home/page';
import Login from './Page/login/page';
import Register from './Page/register/page';
import Payroll from './Page/payroll/page';
import Invoice from './Page/invoice/page';
import Reports from './Page/reports/page';
import Support from './Page/support/page';
import Settings from './Page/settings/page';
import './index.css';

const AppContent = () => {
  const location = useLocation();
  const showTopNavbar = !['/home', '/payroll', '/invoice', '/reports', '/support', '/settings'].includes(location.pathname);
  const showSideNavbar = ['/home', '/payroll', '/invoice', '/reports', '/support', '/settings'].includes(location.pathname);

  return (
    <div className="app-container">
      {showTopNavbar && <Navbar />}
      <div className="dashboard-layout"> {}
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

