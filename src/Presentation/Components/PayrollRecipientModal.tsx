// src/Presentation/Components/PayrollRecipientModal.tsx
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  selected: 'new' | 'people';
  setSelected: (val: 'new' | 'people') => void;
  onContinue: () => void;
}

const PayrollRecipientModal: React.FC<Props> = ({ open, onClose, selected, setSelected, onContinue }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
        <button 
          className="absolute top-2 right-2 text-white bg-transparent border-none text-2xl cursor-pointer hover:opacity-70"
          onClick={onClose}
        >
          ×
        </button>
        
        <h3 className="text-white text-xl font-semibold mb-6 mt-0">
          Select a recipient for crypto payroll automation
        </h3>
        
        <div
          className={`flex items-center p-4 border border-gray-600 rounded-lg mb-4 cursor-pointer transition-colors hover:bg-gray-800 ${
            selected === 'new' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('new')}
        >
          <span className="text-2xl mr-4">🏦</span>
          <div>
            <div className="font-bold text-white">New Recipient</div>
            <div className="text-sm text-gray-400">Transfer crypto to recipients outside your contacts</div>
          </div>
        </div>
        
        <div
          className={`flex items-center p-4 border border-gray-600 rounded-lg mb-4 cursor-pointer transition-colors hover:bg-gray-800 ${
            selected === 'people' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('people')}
        >
          <span className="text-2xl mr-4">👥</span>
          <div>
            <div className="font-bold text-white">People</div>
            <div className="text-sm text-gray-400">Send crypto directly to one of the contacts saved in your list.</div>
          </div>
        </div>
        
        <button 
          className="bg-blue-600 text-white border-none py-3 px-6 rounded-lg cursor-pointer w-full text-base font-medium hover:bg-blue-700 transition-colors"
          onClick={onContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PayrollRecipientModal;