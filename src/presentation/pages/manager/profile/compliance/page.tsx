import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { container } from '../../../../../di/container';
import { BusinessDocument } from '../../../../../domain/entities/BusinessDocumentEntities';
// Note: Using container directly instead of hook for simplicity

const CompliancePage: React.FC = observer(() => {
    // Business document form state
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [dtiDocument, setDtiDocument] = useState<File | null>(null);
    const [form2303, setForm2303] = useState<File | null>(null);
    const [managerId, setManagerId] = useState<File | null>(null);


    const businessDocumentViewModel = container.businessDocumentViewModel();
    const {
        isLoading,
        error,
        successMessage,
        clearError,
        clearSuccessMessage
    } = businessDocumentViewModel;

    // State for user documents
    const [userDocuments, setUserDocuments] = useState<any>(null);

    const loadUserDocuments = useCallback(async () => {
        try {
            const result = await businessDocumentViewModel.getUserDocuments();
            setUserDocuments(result);
        } catch (error) {
            console.error('Error loading user documents:', error);
        }
    }, [businessDocumentViewModel]);

    // Load compliance status on component mount
    useEffect(() => {
        // Load user documents to show current status
        loadUserDocuments();
    }, [loadUserDocuments]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!dtiDocument || !form2303 || !managerId) {
            return;
        }

        const documents: BusinessDocument = {
            business_name: businessName,
            business_type: businessType,
            business_registration_number: businessRegistrationNumber,
            business_address: businessAddress,
            business_phone: businessPhone,
            business_email: businessEmail,
            dti_document: dtiDocument!,
            form_2303: form2303!,
            manager_id: managerId!,
        };

        try {
            await businessDocumentViewModel.uploadBusinessDocuments(documents);
            // Clear form on success
            setBusinessName('');
            setBusinessType('');
            setBusinessRegistrationNumber('');
            setBusinessAddress('');
            setBusinessPhone('');
            setBusinessEmail('');
            setDtiDocument(null);
            setForm2303(null);
            setManagerId(null);
            // Reload user documents to show updated status
            await loadUserDocuments();
        } catch (error: any) {
            console.error('Error uploading documents:', error);
            // Error will be displayed through the view model's error state
        }
    };


    const handleSubmitForApproval = async () => {
        try {
            await businessDocumentViewModel.submitDocumentsForApproval();
            // Reload user documents to show updated status
            await loadUserDocuments();
        } catch (error: any) {
            console.error('Error submitting documents for approval:', error);
            // Error will be displayed through the view model's error state
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-8 bg-gray-50 rounded-lg shadow-sm">
            <h1 className="text-2xl text-gray-800 text-center mb-6">Compliance & Business Documents</h1>
            
            {/* Document Status Display */}
            {userDocuments && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Document Status</h3>
                    <p><strong>Documents Uploaded:</strong> {userDocuments.documents?.length || 0}</p>
                    <p><strong>Submission Status:</strong> {userDocuments.documents_submitted ? 'Submitted' : 'Not Submitted'}</p>
                    <p><strong>Approval Status:</strong> {userDocuments.admin_approval_status || 'pending'}</p>
                    {userDocuments.submitted_at && (
                        <p><strong>Submitted:</strong> {new Date(userDocuments.submitted_at).toLocaleDateString()}</p>
                    )}
                    {userDocuments.admin_approval_status === 'approved' && (
                        <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded text-green-800">
                            ✅ Your business documents have been approved. You cannot upload additional documents.
                        </div>
                    )}
                </div>
            )}

            {/* Error and Success Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <p>{error}</p>
                    <button onClick={clearError} className="mt-2 text-red-600 underline">Dismiss</button>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <p>{successMessage}</p>
                    <button onClick={clearSuccessMessage} className="mt-2 text-green-600 underline">Dismiss</button>
                </div>
            )}


            {/* Submit Documents for Approval */}
            {userDocuments && userDocuments.documents && userDocuments.documents.length > 0 && !userDocuments.documents_submitted && (
                <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Submit Documents for Approval</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        You have uploaded {userDocuments.documents.length} document(s). Submit them for admin approval.
                    </p>
                    <button
                        onClick={handleSubmitForApproval}
                        disabled={isLoading}
                        className="bg-yellow-600 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-yellow-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                </div>
            )}

            {/* Original Business Documents Form */}
            <div className="p-6 bg-white rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold mb-4">Upload Business Documents</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Upload all required business documents. Each document will be uploaded individually to the compliance system.
                </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="businessName" className="block mb-2 text-gray-600 font-bold">Business Name:</label>
                    <input
                        type="text"
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessType" className="block mb-2 text-gray-600 font-bold">Business Type:</label>
                    <input
                        type="text"
                        id="businessType"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessRegistrationNumber" className="block mb-2 text-gray-600 font-bold">Business Registration Number:</label>
                    <input
                        type="text"
                        id="businessRegistrationNumber"
                        value={businessRegistrationNumber}
                        onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessAddress" className="block mb-2 text-gray-600 font-bold">Business Address:</label>
                    <input
                        type="text"
                        id="businessAddress"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessPhone" className="block mb-2 text-gray-600 font-bold">Business Phone Number:</label>
                    <input
                        type="text"
                        id="businessPhone"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessEmail" className="block mb-2 text-gray-600 font-bold">Business Email Address:</label>
                    <input
                        type="email"
                        id="businessEmail"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dtiDocument" className="block mb-2 text-gray-600 font-bold">DTI Business Registration Document (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="dtiDocument"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setDtiDocument(e.target.files ? e.target.files[0] : null)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="form2303" className="block mb-2 text-gray-600 font-bold">BIR Form 2303 (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="form2303"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setForm2303(e.target.files ? e.target.files[0] : null)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-base"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="managerId" className="block mb-2 text-gray-600 font-bold">Manager's Government ID (PDF, JPG, JPEG, PNG - Max 10MB):</label>
                    <input
                        type="file"
                        id="managerId"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setManagerId(e.target.files ? e.target.files[0] : null)}
                        required
                        className="w-full p-2 border border-gray-300 rounded text-base"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full p-4 bg-blue-600 text-white border-none rounded text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? 'Uploading Documents...' : 'Upload All Business Documents'}
                </button>
            </form>
            </div>
        </div>
    );
});

export default CompliancePage;