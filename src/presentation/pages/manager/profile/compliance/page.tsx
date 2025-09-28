import React, { useState } from 'react';
import { container } from '../../../../../di/container';
import { BusinessDocument } from '../../../../../domain/entities/BusinessDocumentEntities';

const CompliancePage: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [businessPhone, setBusinessPhone] = useState('');
    const [businessEmail, setBusinessEmail] = useState('');
    const [dtiDocument, setDtiDocument] = useState<File | null>(null);
    const [form2303, setForm2303] = useState<File | null>(null);
    const [managerId, setManagerId] = useState<File | null>(null);
    const [message, setMessage] = useState('');

    const businessDocumentViewModel = container.businessDocumentViewModel();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!dtiDocument || !form2303 || !managerId) {
            setMessage('Please upload all required documents.');
            return;
        }

        const documents: BusinessDocument = {
            business_name: businessName,
            business_type: businessType,
            business_registration_number: businessRegistrationNumber,
            business_address: businessAddress,
            business_phone: businessPhone,
            business_email: businessEmail,
            dti_document: dtiDocument,
            form_2303: form2303,
            manager_id: managerId,
        };

        try {
            await businessDocumentViewModel.uploadBusinessDocuments(documents);
            setMessage('Documents uploaded successfully!');
            setBusinessName('');
            setBusinessType('');
            setBusinessRegistrationNumber('');
            setBusinessAddress('');
            setBusinessPhone('');
            setBusinessEmail('');
            setDtiDocument(null);
            setForm2303(null);
            setManagerId(null);
        } catch (error: any) {
            setMessage(`Error uploading documents: ${error.message}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-8 p-8 bg-gray-50 rounded-lg shadow-sm">
            <h1 className="text-2xl text-gray-800 text-center mb-6">Upload Business Documents</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="businessName" className="block mb-2 text-gray-600 font-bold">Business Name:</label>
                    <input
                        type="text"
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessType" className="block mb-2 text-gray-600 font-bold">Business Type:</label>
                    <input
                        type="text"
                        id="businessType"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessRegistrationNumber" className="block mb-2 text-gray-600 font-bold">Business Registration Number:</label>
                    <input
                        type="text"
                        id="businessRegistrationNumber"
                        value={businessRegistrationNumber}
                        onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessAddress" className="block mb-2 text-gray-600 font-bold">Business Address:</label>
                    <input
                        type="text"
                        id="businessAddress"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessPhone" className="block mb-2 text-gray-600 font-bold">Business Phone Number:</label>
                    <input
                        type="text"
                        id="businessPhone"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="businessEmail" className="block mb-2 text-gray-600 font-bold">Business Email Address:</label>
                    <input
                        type="email"
                        id="businessEmail"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md box-border"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dtiDocument" className="block mb-2 text-gray-600 font-bold">DTI Business Registration Document (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="dtiDocument"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setDtiDocument(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="form2303" className="block mb-2 text-gray-600 font-bold">BIR Form 2303 (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="form2303"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setForm2303(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="managerId" className="block mb-2 text-gray-600 font-bold">Manager's Government ID (PDF, JPG, JPEG, PNG - Max 10MB):</label>
                    <input
                        type="file"
                        id="managerId"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setManagerId(e.target.files ? e.target.files[0] : null)}
                        className="w-full p-2 border border-gray-300 rounded-md box-border"
                        required
                    />
                </div>
                <button type="submit" className="w-full p-4 bg-blue-500 text-white border-none rounded-md text-lg font-medium cursor-pointer hover:bg-blue-600 transition-colors">Upload Documents</button>
            </form>
            {message && (
                <p className={`text-center mt-4 font-bold ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default CompliancePage;