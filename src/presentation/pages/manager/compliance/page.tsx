import React, { useState } from 'react';
import { container } from '../../../../di/container';
import { BusinessDocument } from '../../../../domain/entities/BusinessDocumentEntities';
import './compliance.css';

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
            const response = await businessDocumentViewModel.uploadBusinessDocuments(documents);
            setMessage(response.message || 'Documents uploaded successfully!');
            // Clear form
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
        <div className="compliance-container">
            <h1>Upload Business Documents</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="businessName">Business Name:</label>
                    <input
                        type="text"
                        id="businessName"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="businessType">Business Type:</label>
                    <input
                        type="text"
                        id="businessType"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="businessRegistrationNumber">Business Registration Number:</label>
                    <input
                        type="text"
                        id="businessRegistrationNumber"
                        value={businessRegistrationNumber}
                        onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="businessAddress">Business Address:</label>
                    <input
                        type="text"
                        id="businessAddress"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="businessPhone">Business Phone Number:</label>
                    <input
                        type="text"
                        id="businessPhone"
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="businessEmail">Business Email Address:</label>
                    <input
                        type="email"
                        id="businessEmail"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dtiDocument">DTI Business Registration Document (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="dtiDocument"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setDtiDocument(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="form2303">BIR Form 2303 (PDF, JPG, JPEG, PNG, DOC, DOCX - Max 10MB):</label>
                    <input
                        type="file"
                        id="form2303"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setForm2303(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="managerId">Manager's Government ID (PDF, JPG, JPEG, PNG - Max 10MB):</label>
                    <input
                        type="file"
                        id="managerId"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setManagerId(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                </div>
                <button type="submit">Upload Documents</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CompliancePage;