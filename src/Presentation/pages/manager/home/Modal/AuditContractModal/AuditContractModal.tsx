import React, { useState, useCallback, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import './AuditContractModal.css';
import { useAuditContractViewModel } from '../../../../../../domain/viewmodel/AuditContractViewModel';
import { FileText, UploadCloud, X, AlertCircle, Loader2 } from 'lucide-react';

interface AuditContractModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuditContractModal: React.FC<AuditContractModalProps> = ({ isOpen, onClose }) => {
    const {
        uploadResponse,
        auditResponse,
        isLoading,
        uploadFile,
        auditContract,
        setUploadResponse,
        setAuditResponse
    } = useAuditContractViewModel();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contractName, setContractName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setUploadResponse(null);
            setAuditResponse(null);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
            setUploadResponse(null);
            setAuditResponse(null);
        }
    }, [setUploadResponse, setAuditResponse]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleNext = async () => {
        if (currentStep === 1 && selectedFile) {
            setCurrentStep(2); // Move to AI analysis step
            const uploadRes = await uploadFile(selectedFile);
            if (uploadRes?.success && uploadRes.contract_data) {
                const auditRes = await auditContract({
                    contract_code: uploadRes.contract_data.contract_code,
                    contract_name: contractName,
                    upload_method: "file",
                    filename: selectedFile.name,
                    file_size: selectedFile.size
                });
                if(auditRes.success){
                    setCurrentStep(3); // Move to Audit Result step
                } else {
                    setAuditResponse(auditRes); // Set error for display
                    setCurrentStep(1); // Go back to show error
                }
            } else {
                setUploadResponse(uploadRes); // Set error for display
                setCurrentStep(1); // Go back to show error
            }
        } else if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleClose = () => {
        setSelectedFile(null);
        setContractName('');
        setUploadResponse(null);
        setAuditResponse(null);
        setCurrentStep(1);
        onClose();
    }

    if (!isOpen) {
        return null;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-section">
                        <div className="input-group">
                            <label htmlFor="contractName" className="input-label">Contract Name</label>
                            <input 
                                type="text" 
                                id="contractName" 
                                className="modern-input" 
                                value={contractName} 
                                onChange={(e) => setContractName(e.target.value)} 
                                placeholder="e.g., MyERC20Token"
                            />
                        </div>
                        <div className="upload-section">
                            <label className="input-label">Upload Contract File</label>
                            <div
                                className={`upload-zone ${isDragOver ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="file-input"
                                    onChange={handleFileChange}
                                    accept=".sol,.solidity"
                                />
                                {!selectedFile ? (
                                    <div className="upload-content">
                                        <div className="upload-icon"><UploadCloud size={32} /></div>
                                        <h4>Drag & Drop or Click to Upload</h4>
                                        <p>Solidity (.sol) files, max 1MB</p>
                                    </div>
                                ) : (
                                    <div className="file-selected">
                                        <div className="file-icon"><FileText size={24} /></div>
                                        <div className="file-details">
                                            <h4>{selectedFile.name}</h4>
                                            <p>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="analysis-step">
                        <div className="analysis-loader">
                            <div className="spinner"></div>
                        </div>
                        <div className="analysis-container">
                            <h3>Analyzing Contract with AI</h3>
                            <p>Please wait while our advanced AI performs a comprehensive security audit on your Solidity contract.</p>
                            <div className="analysis-progress">
                                <div className={`progress-item ${isLoading ? 'active' : ''}`}>
                                    <div className="progress-dot"></div>
                                    <span>Scanning for common vulnerabilities...</span>
                                </div>
                                <div className={`progress-item ${isLoading ? 'active' : ''}`}>
                                    <div className="progress-dot"></div>
                                    <span>Performing static code analysis...</span>
                                </div>
                                <div className={`progress-item ${isLoading ? 'active' : ''}`}>
                                    <div className="progress-dot"></div>
                                    <span>Generating risk assessment...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="results-step">
                        <div className="step-header">
                            <h3>Audit Results</h3>
                            <span className={`status-badge ${auditResponse?.audit?.status === 'COMPLETED' ? 'success' : ''}`}>
                                {auditResponse?.audit?.status}
                            </span>
                        </div>
                        <div className="results-grid">
                            <div className="result-card">
                                <h4>Overview</h4>
                                <div className="info-item"><span className="label">Contract Name:</span> <span className="value">{auditResponse?.audit?.contract_name}</span></div>
                                <div className="info-item"><span className="label">Risk Level:</span> <span className={`value risk-${auditResponse?.audit?.risk_level?.toLowerCase()}`}>{auditResponse?.audit?.risk_level}</span></div>
                                <div className="info-item"><span className="label">Vulnerabilities Found:</span> <span className="value">{auditResponse?.audit?.vulnerabilities_found}</span></div>
                                <div className="info-item"><span className="label">Completed On:</span> <span className="value">{auditResponse?.audit?.completed_at ? new Date(auditResponse.audit.completed_at).toLocaleString() : 'N/A'}</span></div>
                            </div>
                            <div className="result-card">
                                <h4>Vulnerabilities Summary</h4>
                                {auditResponse?.vulnerabilities && auditResponse.vulnerabilities.length > 0 ? (
                                    auditResponse.vulnerabilities.slice(0, 3).map((vuln, index) => (
                                        <div key={index} className="info-item">
                                            <span className="label">{vuln.title}</span>
                                            <span className={`value severity-${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No major vulnerabilities found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="assessment-step">
                        <div className="step-header">
                            <h3>Detailed Assessment</h3>
                        </div>
                        <div className="result-card">
                            <h4>AI Analysis Overview</h4>
                            <p>{auditResponse?.audit?.ai_analysis || 'No AI analysis provided.'}</p>
                        </div>
                        <div className="result-card">
                            <h4>Gas Optimization Insights</h4>
                            <p>{auditResponse?.audit?.gas_optimization || 'No gas optimization insights.'}</p>
                        </div>
                        <div className="result-card">
                            <h4>Recommendations</h4>
                            <pre>{auditResponse?.audit?.recommendations || 'No specific recommendations.'}</pre>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null; // Should not happen if index.html is correct

    return ReactDOM.createPortal(
        <div className="audit-contract-modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="header-content">
                        <h1>Audit Solidity Contract</h1>
                        <p className="header-subtitle">Secure your smart contracts with AI-powered analysis.</p>
                    </div>
                    <button className="close-button" onClick={handleClose}><X size={20} /></button>
                </div>

                <div className="progress-bar">
                    <div className="progress-steps">
                        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                            <div className="step-indicator">1</div>
                            <span className="step-title">Contract Set up</span>
                        </div>
                        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                            <div className="step-indicator">2</div>
                            <span className="step-title">AI Analysis</span>
                        </div>
                        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                            <div className="step-indicator">3</div>
                            <span className="step-title">Audit Result</span>
                        </div>
                        <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
                            <div className="step-indicator">4</div>
                            <span className="step-title">Assessment</span>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                   
                    {(auditResponse && !auditResponse.success && currentStep === 1) && (
                        <div className="error-message">
                            <AlertCircle size={20} className="error-icon" />
                            <div className="error-content">
                                <h4>Audit Failed</h4>
                                <p>{auditResponse.error}</p>
                            </div>
                        </div>
                    )}
                    {renderStepContent()}
                     {(uploadResponse && !uploadResponse.success && currentStep === 1) && (
                        <div className="error-message">
                            <AlertCircle size={20} className="error-icon" />
                            <div className="error-content">
                                <h4>Upload Failed</h4>
                                <p>{uploadResponse.error}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <div className="button-group">
                        {currentStep > 1 && currentStep < 4 && <button onClick={handleBack} className="btn btn-secondary">Back</button>}
                        {currentStep < 4 && <button onClick={handleNext} className="btn btn-primary" disabled={(currentStep === 1 && (!selectedFile || !contractName)) || isLoading}>
                            {isLoading ? (
                                <><Loader2 size={16} className="btn-spinner" /> Analyzing...</>
                            ) : (
                                currentStep === 1 ? 'Start Analysis' : 'Next'
                            )}
                        </button>}
                        {currentStep === 4 && <button onClick={handleClose} className="btn btn-primary">Finish</button>}
                    </div>
                </div>
                
            </div>
        </div>,
        modalRoot
    );
};

export default AuditContractModal;