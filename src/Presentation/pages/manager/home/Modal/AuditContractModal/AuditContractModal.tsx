// src/Presentation/pages/manager/home/Modal/AuditContractModal/AuditContractModal.tsx
import React, { useState, useCallback, ChangeEvent } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import { useAuditContractViewModel } from '../../../../../../domain/viewmodel/AuditContractViewModel';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText, UploadCloud, X, AlertCircle, Loader2, Download } from 'lucide-react';

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
            setCurrentStep(2);
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
                    setCurrentStep(3);
                } else {
                    setAuditResponse(auditRes);
                    setCurrentStep(1);
                }
            } else {
                setUploadResponse(uploadRes);
                setCurrentStep(1);
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

    const renderPdfContent = () => (
        <div>
            <div className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Audit Results</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        auditResponse?.audit?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {auditResponse?.audit?.status}
                    </span>
                </div>
                <div className="grid gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                        <h4 className="text-base font-semibold mb-4 text-gray-900">Overview</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                <span className="font-medium text-gray-600 text-sm">Contract Name:</span>
                                <span className="font-semibold text-gray-900 text-sm">{auditResponse?.audit?.contract_name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                <span className="font-medium text-gray-600 text-sm">Risk Level:</span>
                                <span className={`font-semibold text-sm ${
                                    auditResponse?.audit?.risk_level?.toLowerCase() === 'critical' ? 'text-red-600' :
                                    auditResponse?.audit?.risk_level?.toLowerCase() === 'high' ? 'text-orange-600' :
                                    auditResponse?.audit?.risk_level?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                    {auditResponse?.audit?.risk_level}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                <span className="font-medium text-gray-600 text-sm">Vulnerabilities Found:</span>
                                <span className="font-semibold text-gray-900 text-sm">{auditResponse?.audit?.vulnerabilities_found}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="font-medium text-gray-600 text-sm">Completed On:</span>
                                <span className="font-semibold text-gray-900 text-sm">
                                    {auditResponse?.audit?.completed_at ? new Date(auditResponse.audit.completed_at).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                        <h4 className="text-base font-semibold mb-4 text-gray-900">Vulnerabilities Summary</h4>
                        {auditResponse?.vulnerabilities && auditResponse.vulnerabilities.length > 0 ? (
                            <div className="space-y-2">
                                {auditResponse.vulnerabilities.map((vuln, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-medium text-gray-600 text-sm">{vuln.title}</span>
                                        <span className={`font-semibold text-sm ${
                                            vuln.severity.toLowerCase() === 'critical' ? 'text-red-600' :
                                            vuln.severity.toLowerCase() === 'high' ? 'text-orange-600' :
                                            vuln.severity.toLowerCase() === 'medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {vuln.severity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">No major vulnerabilities found.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Detailed Assessment</h3>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                    <h4 className="text-base font-semibold mb-4 text-gray-900">AI Analysis Overview</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{auditResponse?.audit?.ai_analysis || 'No AI analysis provided.'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                    <h4 className="text-base font-semibold mb-4 text-gray-900">Gas Optimization Insights</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{auditResponse?.audit?.gas_optimization || 'No gas optimization insights.'}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                    <h4 className="text-base font-semibold mb-4 text-gray-900">Recommendations</h4>
                    <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md whitespace-pre-wrap break-words">
                        {auditResponse?.audit?.recommendations || 'No specific recommendations.'}
                    </pre>
                </div>
            </div>
        </div>
    );

    const handleDownloadPdf = () => {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        const root = createRoot(tempDiv);
        root.render(renderPdfContent());

        setTimeout(() => {
            html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: true
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;

                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                pdf.save('audit-report.pdf');
                root.unmount();
                document.body.removeChild(tempDiv);
            });
        }, 100);
    };

    if (!isOpen) {
        return null;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="contractName" className="text-sm font-semibold text-gray-700">Contract Name</label>
                            <input 
                                type="text" 
                                id="contractName" 
                                className="p-3 border border-gray-300 rounded-lg text-sm transition-all bg-white text-gray-900 focus:outline-none focus:border-purple-600 focus:shadow-lg"
                                value={contractName} 
                                onChange={(e) => setContractName(e.target.value)} 
                                placeholder="e.g., MyERC20Token"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Upload Contract File</label>
                            <div
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all min-h-[200px] flex flex-col justify-center items-center ${
                                    isDragOver ? 'border-purple-600 bg-purple-50 transform scale-105' : 
                                    selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-purple-600 hover:bg-gray-100'
                                }`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => document.getElementById('fileInput')?.click()}
                            >
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".sol,.solidity"
                                />
                                {!selectedFile ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                                            <UploadCloud size={32} />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 m-0">Drag & Drop or Click to Upload</h4>
                                        <p className="text-sm text-gray-600 m-0">Solidity (.sol) files, max 1MB</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg w-full">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900 m-0 mb-1">{selectedFile.name}</h4>
                                            <p className="text-xs text-gray-600 m-0">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="max-w-md">
                            <div className="mb-8">
                                <div className="w-15 h-15 border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 m-0">Analyzing Contract with AI</h3>
                                <p className="text-sm text-gray-600 mb-8 m-0 leading-relaxed">
                                    Please wait while our advanced AI performs a comprehensive security audit on your Solidity contract.
                                </p>
                                <div className="flex flex-col gap-3 text-left">
                                    <div className={`flex items-center gap-3 py-2 transition-opacity ${isLoading ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                        <span className={`text-sm ${isLoading ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            Scanning for common vulnerabilities...
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-3 py-2 transition-opacity ${isLoading ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                        <span className={`text-sm ${isLoading ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            Performing static code analysis...
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-3 py-2 transition-opacity ${isLoading ? 'opacity-100' : 'opacity-40'}`}>
                                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                        <span className={`text-sm ${isLoading ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                            Generating risk assessment...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900">Audit Results</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                auditResponse?.audit?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {auditResponse?.audit?.status}
                            </span>
                        </div>
                        <div className="grid gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                                <h4 className="text-base font-semibold mb-4 text-gray-900">Overview</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-medium text-gray-600 text-sm">Contract Name:</span>
                                        <span className="font-semibold text-gray-900 text-sm">{auditResponse?.audit?.contract_name}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-medium text-gray-600 text-sm">Risk Level:</span>
                                        <span className={`font-semibold text-sm ${
                                            auditResponse?.audit?.risk_level?.toLowerCase() === 'critical' ? 'text-red-600' :
                                            auditResponse?.audit?.risk_level?.toLowerCase() === 'high' ? 'text-orange-600' :
                                            auditResponse?.audit?.risk_level?.toLowerCase() === 'medium' ? 'text-yellow-600' :
                                            'text-green-600'
                                        }`}>
                                            {auditResponse?.audit?.risk_level}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-medium text-gray-600 text-sm">Vulnerabilities Found:</span>
                                        <span className="font-semibold text-gray-900 text-sm">{auditResponse?.audit?.vulnerabilities_found}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-600 text-sm">Completed On:</span>
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {auditResponse?.audit?.completed_at ? new Date(auditResponse.audit.completed_at).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                                <h4 className="text-base font-semibold mb-4 text-gray-900">Vulnerabilities Summary</h4>
                                {auditResponse?.vulnerabilities && auditResponse.vulnerabilities.length > 0 ? (
                                    <div className="space-y-2">
                                        {auditResponse.vulnerabilities.slice(0, 3).map((vuln, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                <span className="font-medium text-gray-600 text-sm">{vuln.title}</span>
                                                <span className={`font-semibold text-sm ${
                                                    vuln.severity.toLowerCase() === 'critical' ? 'text-red-600' :
                                                    vuln.severity.toLowerCase() === 'high' ? 'text-orange-600' :
                                                    vuln.severity.toLowerCase() === 'medium' ? 'text-yellow-600' :
                                                    'text-green-600'
                                                }`}>
                                                    {vuln.severity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">No major vulnerabilities found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-900">Detailed Assessment</h3>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                            <h4 className="text-base font-semibold mb-4 text-gray-900">AI Analysis Overview</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{auditResponse?.audit?.ai_analysis || 'No AI analysis provided.'}</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                            <h4 className="text-base font-semibold mb-4 text-gray-900">Gas Optimization Insights</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{auditResponse?.audit?.gas_optimization || 'No gas optimization insights.'}</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-gray-900">
                            <h4 className="text-base font-semibold mb-4 text-gray-900">Recommendations</h4>
                            <pre className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md whitespace-pre-wrap break-words">
                                {auditResponse?.audit?.recommendations || 'No specific recommendations.'}
                            </pre>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 scale-in-95 duration-300">
                <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white p-6 relative flex flex-col">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-1 tracking-tight text-white">Audit Solidity Contract</h1>
                        <p className="text-sm opacity-90 font-normal text-white">Secure your smart contracts with AI-powered analysis.</p>
                    </div>
                    <button 
                        className="absolute top-4 right-4 bg-white bg-opacity-20 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-white transition-all hover:bg-white hover:bg-opacity-30" 
                        onClick={handleClose}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-white p-5 border-b border-gray-200 relative ml-[7%]">
                    <div className="flex justify-between items-start relative">
                        <div className="absolute top-8 left-15 right-15 h-0.5 bg-gray-200 z-10">
                            <div 
                                className="h-full bg-purple-600 transition-all duration-500 rounded-sm"
                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                            ></div>
                        </div>
                        
                        {[1, 2, 3, 4].map((step, index) => (
                            <div key={step} className="flex flex-col items-center gap-2 relative z-20 bg-white px-2 flex-1 text-center">
                                <div className={`w-10 h-10 rounded-full border-3 flex items-center justify-center font-semibold text-sm mt-[10%] transition-all duration-300 ${
                                    currentStep >= step 
                                        ? currentStep > step 
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-gray-200 text-gray-600 border-gray-200'
                                }`}>
                                    {currentStep > step ? '✓' : step}
                                </div>
                                <span className={`text-xs font-medium whitespace-nowrap leading-tight ${
                                    currentStep >= step 
                                        ? currentStep > step
                                            ? 'text-green-500'
                                            : 'text-purple-600 font-semibold'
                                        : 'text-gray-600'
                                }`}>
                                    {step === 1 ? 'Contract Set up' : 
                                     step === 2 ? 'AI Analysis' : 
                                     step === 3 ? 'Audit Result' : 
                                     'Assessment'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-white min-h-[300px]">
                    {(auditResponse && !auditResponse.success && currentStep === 1) && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold mb-1 m-0">Audit Failed</h4>
                                <p className="text-sm opacity-80 m-0">{auditResponse.error}</p>
                            </div>
                        </div>
                    )}
                    {renderStepContent()}
                    {(uploadResponse && !uploadResponse.success && currentStep === 1) && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold mb-1 m-0">Upload Failed</h4>
                                <p className="text-sm opacity-80 m-0">{uploadResponse.error}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
                    {currentStep > 1 && currentStep < 4 && (
                        <button 
                            onClick={handleBack} 
                            className="inline-flex items-center justify-center gap-2 px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all min-h-[40px] whitespace-nowrap bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5"
                        >
                            Back
                        </button>
                    )}
                    {currentStep < 4 && (
                        <button 
                            onClick={handleNext} 
                            className={`inline-flex items-center justify-center gap-2 px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all min-h-[40px] whitespace-nowrap bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 ${
                                (currentStep === 1 && (!selectedFile || !contractName)) || isLoading ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''
                            }`}
                            disabled={(currentStep === 1 && (!selectedFile || !contractName)) || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
                                    Analyzing...
                                </>
                            ) : (
                                currentStep === 1 ? 'Start Analysis' : 'Next'
                            )}
                        </button>
                    )}
                    {currentStep === 4 && (
                        <>
                            <button 
                                onClick={handleDownloadPdf} 
                                className="inline-flex items-center justify-center gap-2 px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all min-h-[40px] whitespace-nowrap bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5"
                            >
                                <Download size={16} />
                                Download PDF
                            </button>
                            <button 
                                onClick={handleClose} 
                                className="inline-flex items-center justify-center gap-2 px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all min-h-[40px] whitespace-nowrap bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Finish
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        modalRoot
    );
};

export default AuditContractModal;