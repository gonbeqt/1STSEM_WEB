import React from "react";
import "./Assets.css";

const Assets: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <p className="back-arrow">←</p>
        <h2>Your Assets</h2>
      </header>

      <section className="total-earnings">
        <h3>Total Earnings</h3>
        <p className="earnings-amount">$245,000</p>
      </section>

      {/* Assets Breakdown */}
      <section className="assets-breakdown card">
        <h4>Assets Breakdown</h4>
        <div className="breakdown-item">
          <span>Wallet Balance</span>
          <span>$85,000</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: "80%" }}></div>
        </div>

        <div className="breakdown-item">
          <span>Completed Transactions</span>
          <span>$82,000</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: "70%" }}></div>
        </div>

        <div className="breakdown-item">
          <span>Rewards & Bonuses</span>
          <span>$45,000</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: "50%" }}></div>
        </div>

        <div className="breakdown-item">
          <span>Saved Files & Data</span>
          <span>$30,000</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: "40%" }}></div>
        </div>

        <div className="breakdown-item">
          <span>Referral Credits</span>
          <span>$10,000</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: "20%" }}></div>
        </div>
      </section>

      {/* Assets Growth */}
      <section className="assets-growth card">
        <h4>Assets Growth</h4>
        <p className="growth-value">6-Month Change: <span>+10,000 (+4.3%)</span></p>
        <div className="chart-placeholder">📈 Chart here</div>
      </section>

      {/* Insights */}
      <section className="insights">
        <div className="insight-card green">
          <h5>Wallet Balance Increased</h5>
          <p>Your wallet balance has grown by 2.4% this month.</p>
        </div>

        <div className="insight-card blue">
          <h5>Rewards Growth</h5>
          <p>New rewards and bonuses increased by 2.7% this month.</p>
        </div>

        <div className="insight-card red">
          <h5>Completed Transactions</h5>
          <p>Transactions decreased slightly by 1.3% compared to last month.</p>
        </div>
      </section>
    </div>
  );
};

export default Assets;
