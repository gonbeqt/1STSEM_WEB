import React from 'react';
import './PayrollRecipientModal.css';

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
    <div className="payroll-modal-backdrop">
      <div className="payroll-modal">
        <button className="payroll-modal-close" onClick={onClose}>×</button>
        <h3 className="payroll-modal-title">Select a recipient for crypto payroll automation</h3>
        <div
          className={`payroll-modal-option${selected === 'new' ? ' selected' : ''}`}
          onClick={() => setSelected('new')}
        >
          <span className="payroll-modal-icon">🏦</span>
          <div>
            <div className="payroll-modal-option-title">New Recipient</div>
            <div className="payroll-modal-option-desc">Transfer crypto to recipients outside your contacts</div>
          </div>
        </div>
        <div
          className={`payroll-modal-option${selected === 'people' ? ' selected' : ''}`}
          onClick={() => setSelected('people')}
        >
          <span className="payroll-modal-icon">👥</span>
          <div>
            <div className="payroll-modal-option-title">People</div>
            <div className="payroll-modal-option-desc">Send crypto directly to one of the contacts saved in your list.</div>
          </div>
          {selected === 'people' && <span className="payroll-modal-check">✔</span>}
        </div>
        <button className="payroll-modal-continue" onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
};

export default PayrollRecipientModal;