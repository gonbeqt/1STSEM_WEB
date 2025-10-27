import React, { useState, useCallback, ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { container } from '../../../../../../di/container';
import jsPDF from 'jspdf';
import { FileText, UploadCloud, X, AlertCircle, Download } from 'lucide-react';

interface AuditContractModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuditContractModal: React.FC<AuditContractModalProps> = ({ isOpen, onClose }) => {
    const auditViewModel = container.auditContractViewModel();

    const [uploadResponse, setUploadResponse] = useState<any>(null);
    const [auditResponse, setAuditResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contractName, setContractName] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const getUniqueVulnerabilities = (vulnerabilities: any[]) => {
        if (!vulnerabilities || vulnerabilities.length === 0) return [];

        const seen = new Set();
        const uniqueVulns = vulnerabilities.filter((vuln, index) => {
            const key = JSON.stringify({
                title: vuln.title?.trim() || '',
                severity: vuln.severity?.trim().toUpperCase() || '',
                description: vuln.description?.trim() || ''
            });

            if (seen.has(key)) {

                return false;
            }

            seen.add(key);
            return true;
        });

        const sorted = uniqueVulns.sort((a, b) => {
            const severityOrder: { [key: string]: number } = {
                'CRITICAL': 0,
                'HIGH': 1,
                'MEDIUM': 2,
                'LOW': 3,
                'INFO': 4
            };
            const aSeverityKey = (a.severity || '').toUpperCase();
            const bSeverityKey = (b.severity || '').toUpperCase();
            const aSeverity = severityOrder[aSeverityKey] !== undefined ? severityOrder[aSeverityKey] : 5;
            const bSeverity = severityOrder[bSeverityKey] !== undefined ? severityOrder[bSeverityKey] : 5;

            if (aSeverity === bSeverity) {
                return (a.title || '').localeCompare(b.title || '');
            }

            return aSeverity - bSeverity;
        });

        return sorted;
    };

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
            setIsLoading(true);
            try {

                const uploadRes = await auditViewModel.uploadFile(selectedFile);

                setUploadResponse(uploadRes);
                if (uploadRes?.success && uploadRes.contract_data) {

                    const auditRes = await auditViewModel.auditContract({
                        contract_code: uploadRes.contract_data.contract_code,
                        contract_name: contractName,
                        upload_method: "file",
                        filename: selectedFile.name,
                        file_size: selectedFile.size
                    });

                    setAuditResponse(auditRes);
                    if (auditRes.success) {
                        setCurrentStep(3);
                    } else {
                        setCurrentStep(1);
                    }
                } else {
                    setCurrentStep(1);
                }
            } catch (error) {                setCurrentStep(1);
            } finally {
                setIsLoading(false);
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

    const handleDownloadPdf = () => {
        if (!auditResponse?.audit) return;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const lineHeight = 6;
        let yPosition = margin;

        const checkPageBreak = (requiredHeight: number) => {
            if (yPosition + requiredHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
            }
        };

        const addWrappedText = (text: string, x: number, fontSize: number = 10, maxWidth?: number) => {
            pdf.setFontSize(fontSize);
            const width = maxWidth || pageWidth - 2 * margin;
            const textLines = pdf.splitTextToSize(text, width);

            textLines.forEach((line: string) => {
                checkPageBreak(lineHeight);
                pdf.text(line, x, yPosition);
                yPosition += lineHeight;
            });
            return yPosition;
        };

        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Smart Contract Audit Report', margin, yPosition);
        yPosition += 15;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Status: ${auditResponse.audit.status}`, pageWidth - margin - 40, yPosition - 10);

        checkPageBreak(30);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Overview', margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        const overviewData = [
            ['Contract Name:', auditResponse.audit.contract_name || 'N/A'],
            ['Risk Level:', auditResponse.audit.risk_level || 'N/A'],
            ['Vulnerabilities Found:', auditResponse.audit.vulnerabilities_found?.toString() || '0'],
            ['Completed On:', auditResponse.audit.completed_at
                ? new Date(auditResponse.audit.completed_at).toLocaleString()
                : 'N/A']
        ];

        overviewData.forEach(([label, value]) => {
            checkPageBreak(lineHeight);
            pdf.setFont('helvetica', 'bold');
            pdf.text(label, margin, yPosition);
            pdf.setFont('helvetica', 'normal');
            pdf.text(value, margin + 50, yPosition);
            yPosition += lineHeight;
        });

        yPosition += 10;

        checkPageBreak(20);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Vulnerabilities Summary', margin, yPosition);
        yPosition += 10;

        if (auditResponse.vulnerabilities && auditResponse.vulnerabilities.length > 0) {
            const uniqueVulnerabilities = getUniqueVulnerabilities(auditResponse.vulnerabilities);

            uniqueVulnerabilities.forEach((vuln, index) => {
                checkPageBreak(lineHeight * 2);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${index + 1}. ${vuln.title}`, margin, yPosition);
                pdf.setFont('helvetica', 'normal');

                const severityText = `[${vuln.severity.toUpperCase()}]`;
                const severityWidth = pdf.getTextWidth(severityText);
                pdf.text(severityText, pageWidth - margin - severityWidth, yPosition);
                yPosition += lineHeight + 2;
            });
        } else {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('No major vulnerabilities found.', margin, yPosition);
            yPosition += lineHeight;
        }

        yPosition += 10;

        checkPageBreak(20);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Assessment', margin, yPosition);
        yPosition += 15;

        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('AI Analysis Overview', margin, yPosition);
        yPosition += 8;

        const aiAnalysis = auditResponse.audit.ai_analysis || 'No AI analysis provided.';
        addWrappedText(aiAnalysis, margin, 10);
        yPosition += 10;

        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Gas Optimization Insights', margin, yPosition);
        yPosition += 8;

        const gasOptimization = auditResponse.audit.gas_optimization || 'No gas optimization insights.';
        addWrappedText(gasOptimization, margin, 10);
        yPosition += 10;

        checkPageBreak(15);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommendations', margin, yPosition);
        yPosition += 8;

        const recommendations = auditResponse.audit.recommendations || 'No specific recommendations.';
        addWrappedText(recommendations, margin, 10);

        const totalPages = pdf.internal.pages.length - 1; // Subtract 1 because first element is metadata
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth - margin,
                pageHeight - 10,
                { align: 'right' }
            );
            pdf.text(
                `Generated on ${new Date().toLocaleString()}`,
                margin,
                pageHeight - 10
            );
        }

        const fileName = `${auditResponse.audit.contract_name || 'audit'}-report.pdf`;
        pdf.save(fileName);
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
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all min-h-[200px] flex flex-col justify-center items-center ${isDragOver ? 'border-purple-600 bg-purple-50 transform scale-105' :
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
                            <div className="mb-8" role="status" aria-live="polite" aria-busy={isLoading}>
                                <div className="w-10 h-10  border-4 border-gray-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
                                <span className="sr-only">Analyzing contract…</span>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${auditResponse?.audit?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                                        <span className={`font-semibold text-sm ${auditResponse?.audit?.risk_level?.toLowerCase() === 'critical' ? 'text-red-600' :
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
                                        {getUniqueVulnerabilities(auditResponse.vulnerabilities).slice(0, 3).map((vuln, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                                                <span className="font-medium text-gray-600 text-sm">{vuln.title}</span>
                                                <span className={`font-semibold text-sm ${vuln.severity.toLowerCase() === 'critical' ? 'text-red-600' :
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
                                <div className={`w-10 h-10 rounded-full border-3 flex items-center justify-center font-semibold text-sm mt-[10%] transition-all duration-300 ${currentStep >= step
                                        ? currentStep > step
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-gray-200 text-gray-600 border-gray-200'
                                    }`}>
                                    {currentStep > step ? '✓' : step}
                                </div>
                                <span className={`text-xs font-medium whitespace-nowrap leading-tight ${currentStep >= step
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
                            className={`mb-6 inline-flex items-center justify-center gap-2 px-5 py-2 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all min-h-[40px] whitespace-nowrap bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5 active:translate-y-0 ${(currentStep === 1 && (!selectedFile || !contractName)) || isLoading ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''
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