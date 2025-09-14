import React, { useState, useEffect } from 'react';
import './AuditContractModal.css';
import { X, Upload, AlertTriangle } from 'lucide-react';

interface AuditIssue {
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Gas';
  title: string;
  description: string;
  recommendation: string;
  codeSnippet?: string;
}

interface AuditContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuditContractModal: React.FC<AuditContractModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'setup' | 'analyzing' | 'results' | 'assessment'>('setup');
  const [contractName, setContractName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [issues, setIssues] = useState<AuditIssue[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunAudit = () => {
    if (!file) return;
    setStep('analyzing');
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep('results');
          setIssues([
            {
              severity: 'Critical',
              title: 'Unprotected Ether Withdrawal',
              description: 'The withdraw function allows anyone to withdraw funds.',
              recommendation: 'Add access control to ensure only owner can withdraw.',
              codeSnippet: 'function withdraw() public { ... }',
            },
            {
              severity: 'High',
              title: 'Integer Overflow',
              description: 'Potential integer overflow in the add function.',
              recommendation: 'Use SafeMath library or checked arithmetic.',
            },
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  // Handle escape + backdrop
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="audit-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="audit-modal-container">
        {/* Header */}
        <div className="audit-modal-header">
          <h2>Smart Audit Contract</h2>
          <button onClick={onClose} className="audit-modal-close">
            <X size={20} />
          </button>
        </div>

        {/* Stepper */}
      <div className="audit-stepper">
  {['Contract Setup', 'AI Analysis', 'Audit Results', 'Assessment'].map((label, index) => {
    const stepIndex = index + 1;
    const isActive =
      (step === 'setup' && stepIndex === 1) ||
      (step === 'analyzing' && stepIndex === 2) ||
      (step === 'results' && stepIndex === 3) ||
      (step === 'assessment' && stepIndex === 4);

    return (
      <div key={label} className="step-wrapper">
        <div className={`step-circle ${isActive ? 'active' : ''}`}>
          {stepIndex}
        </div>
        {index < 3 && <div className={`step-line ${isActive ? 'active' : ''}`} />}
        <div className="step-label">{label}</div>
      </div>
    );
  })}
</div>
        {/* Steps */}
        {step === 'setup' && (
          <div className="audit-setup">
            <label className="audit-form-label">Contract Name</label>
            <input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="audit-form-input"
              placeholder="e.g. PayrollVault.sol"
            />
            <label className="audit-form-label">Upload Solidity File</label>
            <div className="audit-file-upload">
              <input type="file" accept=".sol" onChange={handleFileChange} id="file-upload" hidden />
              <label htmlFor="file-upload" className="audit-upload-button">
                <Upload size={16} /> {file ? file.name : 'Drag & drop your Solidity file here'}
              </label>
            </div>
            <p className="audit-description">
              Get a Smart Contract Audit to identify vulnerabilities, security risks, and optimization opportunities.
            </p>
            <button onClick={handleRunAudit} disabled={!file} className="audit-btn-primary">
              Run Smart Audit
            </button>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="audit-analyzing">
            <div className="audit-spinner" />
            <h3>Analyzing Smart Contract</h3>
            <p>Progress: {progress}%</p>
            <div className="audit-progress-bar">
              <div className="audit-progress" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="audit-results">
            <div className="audit-summary">
              <div className="audit-severity critical">Critical: 1</div>
              <div className="audit-severity high">High: 2</div>
              <div className="audit-severity medium">Medium: 3</div>
              <div className="audit-severity low">Low: 4</div>
              <div className="audit-severity gas">Gas: 5</div>
            </div>
            <h3>Audit Results</h3>
            {issues.map((issue, index) => (
              <div key={index} className={`audit-issue audit-issue-${issue.severity.toLowerCase()}`}>
                <div className="audit-issue-header">
                  <AlertTriangle size={16} />
                  <span>{issue.title}</span>
                </div>
                <p>{issue.description}</p>
                <p><strong>Recommendation:</strong> {issue.recommendation}</p>
                {issue.codeSnippet && <pre>{issue.codeSnippet}</pre>}
              </div>
            ))}
            <button className="audit-btn-primary" onClick={() => setStep('assessment')}>
              View Overall Assessment
            </button>
          </div>
        )}

        {step === 'assessment' && (
          <div className="audit-assessment">
            <h3>Overall Assessment</h3>
            <section className="audit-section risk">
              <h4>Risk Assessment <span className="critical">Critical</span></h4>
              <ul>
                <li>3 vulnerabilities detected</li>
                <li>Unprotected withdraw function</li>
                <li>Integer overflow identified</li>
              </ul>
            </section>
            <section className="audit-section gas">
              <h4>Gas Optimization <span className="moderate">Moderate</span></h4>
              <ul>
                <li>Replace memory with calldata for function params</li>
                <li>Use uint256 instead of smaller ints</li>
                <li>Avoid unnecessary storage reads</li>
                <li>Consider using assembly for loops</li>
              </ul>
            </section>
            <section className="audit-section recommendations">
              <h4>Recommendations</h4>
              <p><strong>Critical Priority:</strong> Add access control for withdraw</p>
              <p><strong>High Priority:</strong> Use SafeMath for arithmetic</p>
              <p><strong>Medium Priority:</strong> Simplify complex functions</p>
              <p><strong>Gas Optimization:</strong> Optimize calldata usage</p>
            </section>
            <div className="audit-actions">
              <button className="audit-btn-secondary" onClick={() => setStep('results')}>Back to Results</button>
              <button className="audit-btn-primary">Download Full Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditContractModal;
