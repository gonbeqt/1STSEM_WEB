
export interface BusinessDocument {
    business_name: string;
    business_type: string;
    business_registration_number: string;
    business_address?: string;
    business_phone?: string;
    business_email?: string;
    dti_document: File;
    form_2303: File;
    manager_id: File;
}
