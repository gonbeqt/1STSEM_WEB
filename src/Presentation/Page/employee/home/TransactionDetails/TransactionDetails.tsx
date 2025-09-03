import React from 'react';
import { ChevronLeft, Calendar, CheckCircle, Wallet, Copy } from 'lucide-react';
import './TransactionDetails.css';
import { useNavigate } from 'react-router-dom';

interface TransactionDetailProps {
    onBack?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailProps> = () => {
    const navigate = useNavigate()
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };


    return (
        <div className="transaction-details-container">
            {/* Header */}
            <div className="transaction-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="page-title">Transaction Details</h1>
                <div className="header-spacer"></div>
            </div>

            {/* Transaction Summary Card */}
            <div className="transaction-summary-card">
                <div className="transaction-amount">0.45 ETH</div>
                <div className="transaction-usd-value">$850.00 USD</div>
                <div className="transaction-description">May 2023 Salary Payment</div>
                <div className="transaction-status-badge confirmed">
                    <CheckCircle size={14} />
                    Confirmed
                </div>
            </div>

            {/* Transaction Details Card */}
            <div className="transaction-details-card">
                <h2 className="card-title">Transaction Details</h2>

                <div className="detail-row">
                    <div className="detail-label">
                        <Calendar size={18} className="detail-icon purple" />
                        Date
                    </div>
                    <div className="detail-value">May 31, 2023</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">
                        <div className="status-circle green"></div>
                        Status
                    </div>
                    <div className="detail-value status-paid">
                        <CheckCircle size={16} />
                        Paid
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">
                        <Wallet size={18} className="detail-icon purple" />
                        From
                    </div>
                    <div className="detail-value address">
                        <span>0xABC...123</span>
                        <button className="copy-btn" onClick={() => handleCopy('0xABC...123')}>
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="detail-row">
                    <div className="detail-label">
                        <Wallet size={18} className="detail-icon purple" />
                        To
                    </div>
                    <div className="detail-value address">
                        <span>0xDEF...456</span>
                        <button className="copy-btn" onClick={() => handleCopy('0xDEF...456')}>
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="detail-separator"></div>

                <div className="detail-row">
                    <div className="detail-label-simple">Transaction Fee</div>
                    <div className="detail-value">0.001 ETH</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label-simple">Block Number</div>
                    <div className="detail-value">14356789</div>
                </div>

                <div className="detail-row">
                    <div className="detail-label-simple">Transaction Hash</div>
                    <div className="detail-value address">
                        <span>0xDEF...456</span>
                        <button className="copy-btn" onClick={() => handleCopy('0xDEF...456')}>
                            <Copy size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;