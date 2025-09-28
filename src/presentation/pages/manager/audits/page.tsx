import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNavbar from '../../../components/SideNavbar';

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
        <div className="flex min-h-screen bg-gray-100">
            <SideNavbar />
            <main className="flex-1 flex justify-center items-start p-0 pt-8 md:p-4">
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
                                    className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'bg-gray-100'} hover:border-indigo-500 hover:bg-indigo-50/50`}
                                    onDragEnter={handleDrag}
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
                            </div>

                            <button 
                                className="w-full bg-gradient-to-br from-indigo-500 to-purple-700 text-white border-none py-3 rounded-lg text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={handleStartAnalysis}
                                disabled={!contractName.trim() || uploadedFiles.length === 0}
                            >
                                Start Analysis
                            </button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="bg-white rounded-xl p-6 text-gray-800 shadow-md text-center">
                            <div className="py-8">
                                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="m-0 mb-2 text-xl text-gray-800">Analyzing Smart Contract</h3>
                                <p className="m-0 text-gray-500">AI is examining your contract for potential vulnerabilities...</p>
                            </div>
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
    );
};

export default AuditSolidityContract;