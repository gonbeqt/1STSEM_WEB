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


    // Memoize view model to keep a stable reference across renders
    const [businessDocumentViewModel] = useState(() => container.businessDocumentViewModel());
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
    }, []);

    // Load compliance status on component mount
    useEffect(() => {
        // Load user documents to show current status
        loadUserDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <div className="max-w-6xl mx-auto my-8 px-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Compliance & Business Documents</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Status Card */}
                        <div className="col-span-1">
                            <div className="sticky top-8 bg-white border border-gray-100 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-3">Document Status</h3>

                                {!userDocuments ? (
                                    <p className="text-sm text-gray-500">No documents found. Upload required documents to proceed.</p>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Uploaded</span>
                                            <span className="text-sm font-medium text-gray-900">{userDocuments.documents?.length || 0}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Submission</span>
                                            <span className={`text-sm font-medium ${userDocuments.documents_submitted ? 'text-yellow-600' : 'text-gray-700'}`}>
                                                {userDocuments.documents_submitted ? 'Submitted' : 'Not Submitted'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Approval</span>
                                            <span className={`text-sm font-medium ${userDocuments.admin_approval_status === 'approved' ? 'text-green-600' : userDocuments.admin_approval_status === 'rejected' ? 'text-red-600' : 'text-gray-700'}`}>
                                                {userDocuments.admin_approval_status || 'pending'}
                                            </span>
                                        </div>

                                        {userDocuments.submitted_at && (
                                            <div className="text-sm text-gray-500">Submitted: {new Date(userDocuments.submitted_at).toLocaleString()}</div>
                                        )}

                                        {userDocuments.admin_approval_status === 'approved' && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded text-green-800 text-sm">
                                                ✅ Your business documents are approved. Uploading is disabled.
                                            </div>
                                        )}

                                        {/* Action */}
                                        {userDocuments.documents && userDocuments.documents.length > 0 && !userDocuments.documents_submitted && (
                                            <button
                                                onClick={handleSubmitForApproval}
                                                disabled={isLoading}
                                                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-60"
                                            >
                                                {isLoading ? 'Submitting...' : 'Submit for Approval'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Uploaded documents list */}
                            <div className="mt-4 bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h4>
                                {userDocuments && userDocuments.documents && userDocuments.documents.length > 0 ? (
                                    <ul className="space-y-2">
                                        {userDocuments.documents.map((doc: any, idx: number) => (
                                            <li key={idx} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-600">DOC</div>
                                                    <div>
                                                        <div className="text-sm font-medium">{doc.name || doc.document_type || `Document ${idx + 1}`}</div>
                                                        <div className="text-xs text-gray-500">{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : 'Uploaded'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-gray-700">{doc.status || 'pending'}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">No uploaded documents yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Right: Upload Form */}
                        <div className="col-span-2">
                            <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-2">Upload Business Documents</h2>
                                <p className="text-sm text-gray-500 mb-4">Upload the required documents below. Each file must be under 10MB.</p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded text-red-700">{error} <button onClick={clearError} className="ml-3 text-sm underline">Dismiss</button></div>
                                )}
                                {successMessage && (
                                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded text-green-700">{successMessage} <button onClick={clearSuccessMessage} className="ml-3 text-sm underline">Dismiss</button></div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessType} onChange={(e) => setBusinessType(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} type="email" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <input className="w-full p-3 border border-gray-200 rounded" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
                                        </div>
                                    </div>

                                    {/* File Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <label className="block p-3 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50">
                                            <div className="text-sm font-medium text-gray-700">DTI Business Registration</div>
                                            <div className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, DOC (Max 10MB)</div>
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="sr-only" id="dtiDocument" onChange={(e) => setDtiDocument(e.target.files ? e.target.files[0] : null)} />
                                            {dtiDocument && <div className="mt-2 text-xs text-gray-600">Selected: {dtiDocument.name}</div>}
                                        </label>

                                        <label className="block p-3 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50">
                                            <div className="text-sm font-medium text-gray-700">BIR Form 2303</div>
                                            <div className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, DOC (Max 10MB)</div>
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="sr-only" id="form2303" onChange={(e) => setForm2303(e.target.files ? e.target.files[0] : null)} />
                                            {form2303 && <div className="mt-2 text-xs text-gray-600">Selected: {form2303.name}</div>}
                                        </label>

                                        <label className="block p-3 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50">
                                            <div className="text-sm font-medium text-gray-700">Manager ID</div>
                                            <div className="text-xs text-gray-500 mt-2">PDF, JPG, PNG, DOC (Max 10MB)</div>
                                            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="sr-only" id="managerId" onChange={(e) => setManagerId(e.target.files ? e.target.files[0] : null)} />
                                            {managerId && <div className="mt-2 text-xs text-gray-600">Selected: {managerId.name}</div>}
                                        </label>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4">
                                        <button type="submit" disabled={isLoading || (userDocuments && userDocuments.admin_approval_status === 'approved')} className="inline-flex items-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50">
                                            {isLoading ? 'Uploading...' : 'Upload Documents'}
                                        </button>

                                        <button type="button" onClick={() => { setBusinessName(''); setBusinessType(''); setBusinessRegistrationNumber(''); setBusinessAddress(''); setBusinessPhone(''); setBusinessEmail(''); setDtiDocument(null); setForm2303(null); setManagerId(null); }} className="py-2 px-4 border rounded-md bg-white hover:bg-gray-50">Clear</button>

                                        {userDocuments && userDocuments.admin_approval_status === 'approved' && (
                                            <div className="ml-auto text-sm text-green-700 font-medium">Approved ✓</div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            );
});

export default CompliancePage;
