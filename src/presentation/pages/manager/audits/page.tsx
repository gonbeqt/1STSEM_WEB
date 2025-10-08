import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../../../components/SideNavbar';
import ManagerNavbar from '../../../components/ManagerNavbar';
import { container } from '../../../../di/container';
import { AuditContractResponse, UploadContractResponse, Vulnerability } from '../../../../domain/entities/ContractEntities';

interface UploadedFile {
    file: File;
    name: string;
    size: string;
}

type AnalysisStage = 'idle' | 'uploading' | 'auditing' | 'complete' | 'failed';

const dedupeVulnerabilities = (vulnerabilities?: Vulnerability[]) => {
    if (!vulnerabilities || vulnerabilities.length === 0) {
        return [];
    }

    const seen = new Set<string>();
    return vulnerabilities.filter((vulnerability) => {
        const key = JSON.stringify({
            title: vulnerability.title?.trim() || '',
            severity: vulnerability.severity?.toString().trim().toUpperCase() || '',
            description: vulnerability.description?.trim() || ''
        });

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
};

const getSeverityBadgeClass = (severity?: string) => {
    const normalized = severity?.toUpperCase();

    switch (normalized) {
        case 'CRITICAL':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'HIGH':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'MEDIUM':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'LOW':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default:
            return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const getRiskBadgeClass = (risk?: string) => {
    const normalized = risk?.toUpperCase();

    switch (normalized) {
        case 'CRITICAL':
            return 'text-red-600';
        case 'HIGH':
            return 'text-orange-600';
        case 'MEDIUM':
            return 'text-yellow-600';
        case 'LOW':
            return 'text-emerald-600';
        default:
            return 'text-gray-600';
    }
};

const AuditSolidityContract: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [contractName, setContractName] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const auditViewModel = useMemo(() => container.auditContractViewModel(), []);

    const [analysisStage, setAnalysisStage] = useState<AnalysisStage>('idle');
    const [completedStageCount, setCompletedStageCount] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [uploadResponse, setUploadResponse] = useState<UploadContractResponse | null>(null);
    const [auditResponse, setAuditResponse] = useState<AuditContractResponse | null>(null);

    const uniqueVulnerabilities = useMemo(
        () => dedupeVulnerabilities(auditResponse?.vulnerabilities),
        [auditResponse]
    );

    const steps = [
        { number: 1, title: 'Contract Set up', active: currentStep === 1 },
        { number: 2, title: 'AI Analysis', active: currentStep === 2 },
        { number: 3, title: 'Audit Result', active: currentStep === 3 },
        { number: 4, title: 'Assessment', active: currentStep === 4 },
    ];

    const analysisLoadingSteps = [
        {
            title: 'Uploading contract file',
            description: 'Preparing your Solidity contract for scanning.'
        },
        {
            title: 'Running AI vulnerability scan',
            description: 'Identifying risky patterns and misconfigurations.'
        },
        {
            title: 'Generating audit report',
            description: 'Summarizing findings and recommended fixes.'
        }
    ];

    const resetAnalysisState = () => {
        setAnalysisStage('idle');
        setCompletedStageCount(0);
        setIsAnalyzing(false);
        setAnalysisError(null);
        setUploadResponse(null);
        setAuditResponse(null);
    };

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
            file.name.toLowerCase().endsWith('.sol') && file.size <= 1024 * 1024 // 1MB limit
        );

        if (validFiles.length === 0) {
            return;
        }

        const primaryFile = validFiles[0];
        const preparedFile: UploadedFile = {
            file: primaryFile,
            name: primaryFile.name,
            size: formatFileSize(primaryFile.size)
        };

        setUploadedFiles([preparedFile]);
        resetAnalysisState();

        if (!contractName.trim()) {
            const suggestedName = primaryFile.name.replace(/\.[^.]+$/, '');
            setContractName(suggestedName);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
        resetAnalysisState();
        setCurrentStep(1);
    };

    const handleStartAnalysis = async () => {
        if (isAnalyzing) {
            return;
        }

        if (!contractName.trim()) {
            alert('Please provide a contract name before starting the analysis.');
            return;
        }

        if (uploadedFiles.length === 0) {
            alert('Please upload a Solidity contract file to analyze.');
            return;
        }

        const activeFile = uploadedFiles[0]?.file;
        if (!activeFile) {
            alert('The selected file could not be read. Please upload it again.');
            return;
        }

        setCurrentStep(2);
        setAnalysisError(null);
        setIsAnalyzing(true);
        setAnalysisStage('uploading');
        setCompletedStageCount(0);
    setUploadResponse(null);
        setAuditResponse(null);

        let completedStages = 0;

        try {
            const uploadRes: UploadContractResponse = await auditViewModel.uploadFile(activeFile);
            setUploadResponse(uploadRes);

            if (!uploadRes.success || !uploadRes.contract_data) {
                throw new Error(uploadRes.error || 'Failed to upload the contract file.');
            }

            completedStages = 1;
            setCompletedStageCount(completedStages);
            setAnalysisStage('auditing');

            const fallbackName = contractName.trim() || uploadRes.contract_data.suggested_name || activeFile.name.replace(/\.[^.]+$/, '');
            const auditRes: AuditContractResponse = await auditViewModel.auditContract({
                contract_code: uploadRes.contract_data.contract_code,
                contract_name: fallbackName,
                upload_method: uploadRes.contract_data.upload_method || 'file',
                filename: uploadRes.contract_data.filename || activeFile.name,
                file_size: uploadRes.contract_data.file_size ?? activeFile.size
            });

            setAuditResponse(auditRes);

            if (!auditRes.success || !auditRes.audit) {
                throw new Error(auditRes.error || 'AI analysis did not return a valid response.');
            }

            completedStages = analysisLoadingSteps.length;
            setCompletedStageCount(completedStages);
            setAnalysisStage('complete');
            setCurrentStep(3);
        } catch (error: any) {
            console.error('Error during AI analysis:', error);
            const message = error instanceof Error ? error.message : 'Failed to complete AI analysis.';
            setAnalysisError(message);
            setAnalysisStage('failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRetryAnalysis = () => {
        setAnalysisStage('idle');
        setCompletedStageCount(0);
        setAnalysisError(null);
        setAuditResponse(null);
        setUploadResponse(null);
        setCurrentStep(1);
    };

    const handleClose = () => {
        resetAnalysisState();
        setUploadedFiles([]);
        setContractName('');
        setCurrentStep(1);
        navigate('/audits');
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNavbar />
            <div className="flex-1 flex flex-col min-h-screen">
                <ManagerNavbar />
                <main className="flex-1 flex justify-center items-start p-0 pt-8 md:p-4 overflow-y-auto">
                    <div className="w-full max-w-lg bg-gradient-to-br from-indigo-500 to-purple-700 rounded-2xl p-8 shadow-2xl text-white relative">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-semibold m-0">Audit Solidity Contract</h1>
                            <button
                                className="bg-transparent border-none text-white text-2xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                onClick={handleClose}
                            >
                                ×
                            </button>
                        </div>

                        <p className="m-0 mb-8 text-base opacity-90">Secure your smart contracts with AI-powered analysis.</p>

                        <div className="flex justify-between items-center mb-12 relative md:flex-row flex-col gap-4">
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex md:flex-col flex-row items-center md:w-auto w-full">
                                    <div className={`w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold mb-2 md:mb-2 md:mr-0 mr-3 border-2 ${step.active ? 'bg-white text-indigo-500 border-white' : currentStep > step.number ? 'bg-green-500 text-white border-transparent' : 'border-transparent'} transition-all duration-300`}>
                                        {currentStep > step.number ? '✓' : step.number}
                                    </div>
                                    <span className={`text-sm text-center ${step.active ? 'opacity-100 font-semibold' : 'opacity-80'} transition-opacity duration-300`}>
                                        {step.title}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div className={`hidden md:block absolute top-5 left-1/2 right-[-50%] h-0.5 ${currentStep > step.number ? 'bg-green-500' : 'bg-white/30'} z-[-1]`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {currentStep === 1 && (
                            <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md">
                                <div className="mb-6">
                                    <label htmlFor="contractName" className="block mb-2 font-semibold text-gray-800">Contract Name</label>
                                    <input
                                        type="text"
                                        id="contractName"
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors"
                                        placeholder="e.g., MyERC20Token"
                                        value={contractName}
                                        onChange={(e) => setContractName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 font-semibold text-gray-800">Upload Contract File</label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="mb-4 text-indigo-500">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                                                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                        <h3 className="m-0 mb-2 text-lg text-gray-800">Drag & Drop or Click to Upload</h3>
                                        <p className="m-0 text-gray-500 text-sm">Solidity (.sol) files, max 1MB</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".sol"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                        <h4 className="m-0 mb-3 text-base text-gray-800">Uploaded Files:</h4>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{file.name}</span>
                                                    <span className="text-sm text-gray-500">{file.size}</span>
                                                </div>
                                                <button
                                                    className="bg-transparent border-none text-red-500 text-lg cursor-pointer w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100/50"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    className="w-full bg-gradient-to-br from-indigo-500 to-purple-700 text-white border-none py-3 rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={handleStartAnalysis}
                                    disabled={isAnalyzing || !contractName.trim() || uploadedFiles.length === 0}
                                >
                                    {isAnalyzing ? 'Preparing...' : 'Start Analysis'}
                                </button>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md">
                                {analysisStage === 'failed' ? (
                                    <div className="flex flex-col items-center text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-3xl font-bold mb-6">
                                            !
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 m-0">AI Analysis Failed</h3>
                                        <p className="text-sm text-gray-600 mb-6 m-0 max-w-sm">
                                            {analysisError || 'Something went wrong while processing your contract. Please review the file and try again.'}
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                                            <button
                                                className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-br from-indigo-500 to-purple-700 text-white border-none shadow-sm hover:shadow-md transition"
                                                onClick={handleRetryAnalysis}
                                            >
                                                Try Again
                                            </button>
                                            <button
                                                className="px-5 py-2 rounded-lg font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                                                onClick={() => setCurrentStep(1)}
                                            >
                                                Back to Setup
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center py-4">
                                        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 m-0">Analyzing Smart Contract</h3>
                                        <p className="text-sm text-gray-600 mb-8 m-0 max-w-md">
                                            AI is scanning your Solidity contract for vulnerabilities, risky patterns, and optimization opportunities.
                                        </p>
                                        <div className="w-full space-y-4 text-left">
                                            {analysisLoadingSteps.map((step, index) => {
                                                const isCompleted = completedStageCount > index;
                                                const isActive = !isCompleted && index === completedStageCount;
                                                const indicatorBase = 'w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold';
                                                const textBase = 'flex-1';
                                                const indicatorClass = isCompleted
                                                    ? 'bg-emerald-100 text-emerald-600 border-emerald-200'
                                                    : isActive
                                                        ? 'bg-indigo-100 text-indigo-600 border-indigo-200 animate-pulse'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200';
                                                const textClass = isCompleted
                                                    ? 'text-gray-900'
                                                    : isActive
                                                        ? 'text-indigo-600'
                                                        : 'text-gray-500';

                                                return (
                                                    <div key={step.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                        <div className={`${indicatorBase} ${indicatorClass}`}>
                                                            {isCompleted ? '✓' : index + 1}
                                                        </div>
                                                        <div className={`${textBase}`}>
                                                            <p className={`m-0 text-sm font-semibold ${textClass}`}>{step.title}</p>
                                                            <p className="m-0 mt-1 text-xs text-gray-500">{step.description}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md text-center">
                                <h3 className="m-0 mb-2 text-xl text-green-500">Analysis Complete!</h3>
                                <p className="m-0 mb-8 text-gray-500">Your smart contract has been successfully analyzed. Review the results below.</p>
                                <div className="bg-gray-100 rounded-lg p-6 mb-8">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-semibold text-gray-800">Contract Name:</span>
                                        <span className="text-gray-500">{contractName}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-semibold text-gray-800">Files Analyzed:</span>
                                        <span className="text-gray-500">{uploadedFiles.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-semibold text-gray-800">Risk Level:</span>
                                        <span className="text-yellow-500 font-semibold">Medium</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <span className="font-semibold text-gray-800">Vulnerabilities Found:</span>
                                        <span className="text-gray-500">3</span>
                                    </div>
                                </div>
                                <button
                                    className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white border-none py-3 px-8 rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
                                    onClick={() => setCurrentStep(4)}
                                >
                                    View Assessment
                                </button>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md text-center">
                                <h3 className="m-0 mb-2 text-xl text-gray-800">Security Assessment</h3>
                                <div className="py-8">
                                    <div className="w-20 h-20 bg-green-500 text-white text-3xl rounded-full flex items-center justify-center mx-auto mb-6">✓</div>
                                    <h4 className="m-0 mb-2 text-xl text-gray-800">Audit Complete</h4>
                                    <p className="m-0 mb-8 text-gray-500">Your smart contract audit has been completed and saved to your dashboard.</p>
                                    <button
                                        className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white border-none py-3 px-8 rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
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
        </div>
    );
};

export default AuditSolidityContract;

