import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../../../components/SideNavbar';
import './audit.css';

interface UploadedFile {
    file: File;
    name: string;
    size: string;
}

const AuditSolidityContract: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [contractName, setContractName] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const steps = [
        { number: 1, title: 'Contract Set up', active: currentStep === 1 },
        { number: 2, title: 'AI Analysis', active: currentStep === 2 },
        { number: 3, title: 'Audit Result', active: currentStep === 3 },
        { number: 4, title: 'Assessment', active: currentStep === 4 },
    ];

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const validFiles = Array.from(files).filter(file => 
            file.name.endsWith('.sol') && file.size <= 1024 * 1024 // 1MB limit
        );

        const newFiles: UploadedFile[] = validFiles.map(file => ({
            file,
            name: file.name,
            size: formatFileSize(file.size)
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleStartAnalysis = async () => {
        if (!contractName.trim() || uploadedFiles.length === 0) {
            alert('Please provide a contract name and upload at least one file.');
            return;
        }

        setIsAnalyzing(true);
        setCurrentStep(2);

        // Simulate analysis process
        setTimeout(() => {
            setCurrentStep(3);
            setIsAnalyzing(false);
        }, 3000);
    };

    const handleClose = () => {
        navigate('/audits');
    };

    return (
        <div className="audit-solidity-page">
            <SideNavbar />
            <main className="audit-solidity-content">
                <div className="audit-container">
                    <div className="audit-header">
                        <h1>Audit Solidity Contract</h1>
                        <button className="close-button" onClick={handleClose}>×</button>
                    </div>
                    
                    <p className="audit-subtitle">Secure your smart contracts with AI-powered analysis.</p>

                    <div className="progress-steps">
                        {steps.map((step, index) => (
                            <div key={step.number} className="step-container">
                                <div className={`step-circle ${step.active ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                                    {currentStep > step.number ? '✓' : step.number}
                                </div>
                                <span className={`step-title ${step.active ? 'active' : ''}`}>
                                    {step.title}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {currentStep === 1 && (
                        <div className="step-content">
                            <div className="form-group">
                                <label htmlFor="contractName" className="form-label">Contract Name</label>
                                <input
                                    type="text"
                                    id="contractName"
                                    className="form-input"
                                    placeholder="e.g., MyERC20Token"
                                    value={contractName}
                                    onChange={(e) => setContractName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Upload Contract File</label>
                                <div 
                                    className={`upload-area ${isDragActive ? 'drag-active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="upload-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                                            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                                            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </div>
                                    <h3>Drag & Drop or Click to Upload</h3>
                                    <p>Solidity (.sol) files, max 1MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".sol"
                                        onChange={handleFileInput}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="uploaded-files">
                                        <h4>Uploaded Files:</h4>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <div className="file-info">
                                                    <span className="file-name">{file.name}</span>
                                                    <span className="file-size">{file.size}</span>
                                                </div>
                                                <button
                                                    className="remove-file"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button 
                                className="start-analysis-btn"
                                onClick={handleStartAnalysis}
                                disabled={!contractName.trim() || uploadedFiles.length === 0}
                            >
                                Start Analysis
                            </button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-content analysis-step">
                            <div className="analysis-loader">
                                <div className="loader-spinner"></div>
                                <h3>Analyzing Smart Contract</h3>
                                <p>AI is examining your contract for potential vulnerabilities...</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step-content results-step">
                            <h3>Analysis Complete!</h3>
                            <p>Your smart contract has been successfully analyzed. Review the results below.</p>
                            <div className="results-summary">
                                <div className="result-item">
                                    <span className="result-label">Contract Name:</span>
                                    <span className="result-value">{contractName}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Files Analyzed:</span>
                                    <span className="result-value">{uploadedFiles.length}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Risk Level:</span>
                                    <span className="result-value risk-medium">Medium</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Vulnerabilities Found:</span>
                                    <span className="result-value">3</span>
                                </div>
                            </div>
                            <button 
                                className="continue-btn"
                                onClick={() => setCurrentStep(4)}
                            >
                                View Assessment
                            </button>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="step-content assessment-step">
                            <h3>Security Assessment</h3>
                            <div className="assessment-complete">
                                <div className="success-icon">✓</div>
                                <h4>Audit Complete</h4>
                                <p>Your smart contract audit has been completed and saved to your dashboard.</p>
                                <button 
                                    className="view-dashboard-btn"
                                    onClick={() => navigate('/audits')}
                                >
                                    View in Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AuditSolidityContract;