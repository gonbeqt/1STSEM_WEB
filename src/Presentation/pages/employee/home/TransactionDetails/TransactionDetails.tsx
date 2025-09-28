// src/Presentation/pages/employee/home/TransactionDetails/TransactionDetails.tsx
import React from 'react';
import { ChevronLeft, Calendar, CheckCircle, Wallet, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransactionDetailProps {
    onBack?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailProps> = () => {
    const navigate = useNavigate();
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="w-full mx-auto h-full text-white font-sans p-5 box-border bg-gray-800 animate-[slideIn_0.3s_ease-out]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pt-5">
                <button 
                    className="bg-transparent border-none text-white cursor-pointer p-2 -ml-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-lg font-semibold text-white m-0">Transaction Details</h1>
                <div className="w-10"></div>
            </div>

            {/* Transaction Summary Card */}
            <div className="bg-gray-700 border border-gray-600/60 rounded-2xl px-6 py-8 text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2 tracking-wide">0.45 ETH</div>
                <div className="text-base text-gray-400/80 mb-4 font-medium">$850.00 USD</div>
                <div className="text-sm text-gray-400/90 mb-5">May 2023 Salary Payment</div>
                <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl text-sm font-medium border border-green-500/30">
                    <CheckCircle size={14} />
                    Confirmed
                </div>
            </div>

            {/* Transaction Details Card */}
            <div className="bg-gray-700 border border-gray-600/60 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white m-0 mb-6">Transaction Details</h2>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="flex items-center gap-3 text-sm text-gray-400/90 font-medium">
                        <Calendar size={18} className="text-purple-500" />
                        Date
                    </div>
                    <div className="text-sm text-white font-medium">May 31, 2023</div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="flex items-center gap-3 text-sm text-gray-400/90 font-medium">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Status
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-green-400 font-medium">
                        <CheckCircle size={16} />
                        Paid
                    </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="flex items-center gap-3 text-sm text-gray-400/90 font-medium">
                        <Wallet size={18} className="text-purple-500" />
                        From
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <span>0xABCHAS2HSN123</span>
                        <button 
                            className="bg-purple-500/20 border border-purple-500/30 rounded-md p-1 text-purple-500 cursor-pointer transition-colors duration-200 flex items-center justify-center hover:bg-purple-500/30"
                            onClick={() => handleCopy('0xABCHAS2HSN123')}
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="flex items-center gap-3 text-sm text-gray-400/90 font-medium">
                        <Wallet size={18} className="text-purple-500" />
                        To
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <span>0xDEFHASN456</span>
                        <button 
                            className="bg-purple-500/20 border border-purple-500/30 rounded-md p-1 text-purple-500 cursor-pointer transition-colors duration-200 flex items-center justify-center hover:bg-purple-500/30"
                            onClick={() => handleCopy('0xDEFHASN456')}
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="h-px bg-gray-600/40 my-2"></div>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="text-sm text-gray-400/90 font-medium">Transaction Fee</div>
                    <div className="text-sm text-white font-medium">0.001 ETH</div>
                </div>

                <div className="flex justify-between items-center py-4 border-b border-gray-600/40">
                    <div className="text-sm text-gray-400/90 font-medium">Block Number</div>
                    <div className="text-sm text-white font-medium">14356789</div>
                </div>

                <div className="flex justify-between items-center py-4">
                    <div className="text-sm text-gray-400/90 font-medium">Transaction Hash</div>
                    <div className="flex items-center gap-2 text-sm text-white font-medium">
                        <span>0xDEFHASN456</span>
                        <button 
                            className="bg-purple-500/20 border border-purple-500/30 rounded-md p-1 text-purple-500 cursor-pointer transition-colors duration-200 flex items-center justify-center hover:bg-purple-500/30"
                            onClick={() => handleCopy('0xDEFHASN456')}
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;