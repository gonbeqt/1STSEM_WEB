import React, { useState } from 'react';
import { ChevronLeft, TrendingUp } from 'lucide-react';
import './GeneralReports.css';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ExpenseItem {
    category: string;
    amount: number;
    color: string;
}

interface ChartData {
    month: string;
    income: number;
    expenses: number;
}

interface CashFlowData {
    month: string;
    value: number;
}

const GeneralReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');
    const navigate = useNavigate();
    const expenseData: ExpenseItem[] = [
        { category: 'Payroll', amount: 34000, color: '#6366f1' },
        { category: 'Rent', amount: 8000, color: '#8b5cf6' },
        { category: 'Marketing', amount: 5000, color: '#06b6d4' },
        { category: 'Utilities', amount: 2400, color: '#10b981' },
        { category: 'Software', amount: 1800, color: '#f59e0b' },
        { category: 'Other', amount: 1500, color: '#ef4444' }
    ];

    const chartData: ChartData[] = [
        { month: 'Jan', income: 45000, expenses: 38000 },
        { month: 'Feb', income: 52000, expenses: 41000 },
        { month: 'Mar', income: 48000, expenses: 39000 },
        { month: 'Apr', income: 55000, expenses: 42000 },
        { month: 'May', income: 58000, expenses: 44000 },
        { month: 'Jun', income: 62000, expenses: 46000 },
        { month: 'Jul', income: 59000, expenses: 43000 },
        { month: 'Aug', income: 61000, expenses: 45000 },
        { month: 'Sep', income: 57000, expenses: 40000 },
        { month: 'Oct', income: 63000, expenses: 47000 },
        { month: 'Nov', income: 60000, expenses: 45000 },
        { month: 'Dec', income: 65000, expenses: 48000 },
    ];

    const cashFlowData: CashFlowData[] = [
        { month: 'Jan', value: 7000 },
        { month: 'Feb', value: 11000 },
        { month: 'Mar', value: 9000 },
        { month: 'Apr', value: 13000 },
        { month: 'May', value: 14000 },
        { month: 'Jun', value: 16000 },
        { month: 'Jul', value: 16000 },
        { month: 'Aug', value: 16000 },
    ];

    const maxIncome = Math.max(...chartData.map(d => d.income));
    const maxCashFlow = Math.max(...cashFlowData.map(d => d.value));
    return (
        <div className="dashboard">

            <div className="header4">
                <button className="back-button" onClick={() => navigate(-1)} type="button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1>General Reports</h1>

            </div>




            <div className="tab-container">
                <button
                    className={`tab ${activeTab === 'monthly' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`tab ${activeTab === 'annual' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('annual')}
                >
                    Annual
                </button>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h3 className="metric-label">Total Income</h3>
                    <p className="metric-value">$58,100</p>
                </div>
                <div className="metric-card">
                    <h3 className="metric-label">Total Expenses</h3>
                    <p className="metric-value text-red">$42,000</p>
                </div>
            </div>

            <div className="income-expenses-section">
                <div className="section-header">
                    <h3 className="section-title">Income vs Expenses</h3>
                    <div className="trend-indicator">
                        <span className="trend-text">Net Cash Flow</span>
                        <span className="trend-value">+$2,800</span>
                        <TrendingUp size={16} className="trend-icon" />
                    </div>
                </div>

                <div className="chart-container">
                    <div className="chart-content">
    

                        <div className="bar-chart" style={{ backgroundColor: '#2a2a3e', width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="income" fill="#82ca9d" name="Income" />
                                    <Bar dataKey="expenses" fill="#8884d8" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </div>
            </div>

            <div className="cash-flow-section">
                <h3 className="section-title">Cash Flow Trend</h3>
                <div className="line-chart">
                    <svg viewBox="0 0 450 180" className="line-chart-svg">
                        <defs>
                            <linearGradient id="cashFlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0 }} />
                            </linearGradient>
                        </defs>

                        {/* Y-axis labels */}
                        {[0, 5000, 10000, 15000].map((value, i) => (
                            <text
                                key={i}
                                x="30"
                                y={150 - (value / maxCashFlow) * 100}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fill="#9ca3af"
                                fontSize="10"
                            >
                                ${value / 1000}k
                            </text>
                        ))}

                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                            <line
                                key={i}
                                x1="40"
                                y1={30 + i * 25}
                                x2="380"
                                y2={30 + i * 25}
                                stroke="#374151"
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                        ))}

                        {/* Cash flow area */}
                        <path
                            d={`M 40 ${150 - (cashFlowData[0].value / maxCashFlow) * 100} ${cashFlowData.map((point, i) =>
                                `L ${40 + (i * 50)} ${150 - (point.value / maxCashFlow) * 100}`
                            ).join(' ')} L ${40 + (cashFlowData.length - 1) * 50} 150 L 40 150 Z`}
                            fill="url(#cashFlowGradient)"
                        />

                        {/* Cash flow line */}
                        <path
                            d={`M 40 ${150 - (cashFlowData[0].value / maxCashFlow) * 100} ${cashFlowData.map((point, i) =>
                                `L ${40 + (i * 50)} ${150 - (point.value / maxCashFlow) * 100}`
                            ).join(' ')}`}
                            stroke="#06b6d4"
                            strokeWidth="2"
                            fill="none"
                        />

                        {/* Data points */}
                        {cashFlowData.map((point, i) => (
                            <circle
                                key={i}
                                cx={40 + i * 50}
                                cy={150 - (point.value / maxCashFlow) * 100}
                                r="3"
                                fill="#06b6d4"
                            />
                        ))}

                        {/* X-axis labels */}
                        {cashFlowData.map((point, i) => (
                            <text
                                key={i}
                                x={40 + i * 50}
                                y="165"
                                textAnchor="middle"
                                fill="#9ca3af"
                                fontSize="10"
                            >
                                {point.month}
                            </text>
                        ))}
                    </svg>
                </div>
            </div>

            <div className="expenses-section">
                <h3 className="section-title">Expense Breakdown</h3>
                <div className="expense-list">
                    {expenseData.map((expense, index) => (
                        <div key={expense.category} className="expense-item">
                            <div className="expense-info">
                                <div
                                    className="expense-color"
                                    style={{ backgroundColor: expense.color }}
                                ></div>
                                <span className="expense-category">{expense.category}</span>
                            </div>
                            <span className="expense-amount">${expense.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GeneralReports;