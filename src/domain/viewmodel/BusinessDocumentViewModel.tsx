import { makeAutoObservable } from 'mobx';
import { BusinessDocument } from "../entities/BusinessDocumentEntities";
import { UploadBusinessDocumentsUseCase } from "../usecases/UploadBusinessDocumentsUseCase";
import { GetUserBusinessDocumentsUseCase } from "../usecases/GetUserBusinessDocumentsUseCase";
import { SubmitBusinessDocumentsForApprovalUseCase } from "../usecases/SubmitBusinessDocumentsForApprovalUseCase";

interface BusinessDocumentState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

export class BusinessDocumentViewModel {
    private state: BusinessDocumentState = {
        isLoading: false,
        error: null,
        successMessage: null
    };

    constructor(
        private readonly uploadBusinessDocumentsUseCase: UploadBusinessDocumentsUseCase,
        private readonly getUserBusinessDocumentsUseCase: GetUserBusinessDocumentsUseCase,
        private readonly submitBusinessDocumentsForApprovalUseCase: SubmitBusinessDocumentsForApprovalUseCase
    ) {
        makeAutoObservable(this);
    }

    // Getters

    get isLoading() {
        return this.state.isLoading;
    }

    get error() {
        return this.state.error;
    }

    get successMessage() {
        return this.state.successMessage;
    }

    // Actions
    clearError() {
        this.state.error = null;
    }

    clearSuccessMessage() {
        this.state.successMessage = null;
    }

    clearMessages() {
        this.state.error = null;
        this.state.successMessage = null;
    }

    async uploadBusinessDocuments(documents: BusinessDocument): Promise<any> {
        this.state.isLoading = true;
        this.state.error = null;
        this.state.successMessage = null;

        try {
            const result = await this.uploadBusinessDocumentsUseCase.execute(documents);
            this.state.successMessage = 'Business documents uploaded successfully';
            return result;
        } catch (error: any) {
            this.state.error = error.message || 'Failed to upload business documents';
            throw error;
        } finally {
            this.state.isLoading = false;
        }
    }


    async getUserDocuments(): Promise<any> {
        this.state.isLoading = true;
        this.state.error = null;

        try {
            // Use the existing backend endpoint to get user documents
            const result = await this.getUserBusinessDocumentsUseCase.execute();
            return result;
        } catch (error: any) {
            this.state.error = error.message || 'Failed to get user documents';
            throw error;
        } finally {
            this.state.isLoading = false;
        }
    }

    async submitDocumentsForApproval(): Promise<any> {
        this.state.isLoading = true;
        this.state.error = null;
        this.state.successMessage = null;

        try {
            const result = await this.submitBusinessDocumentsForApprovalUseCase.execute();
            this.state.successMessage = 'Documents submitted for approval successfully';
            return result;
        } catch (error: any) {
            this.state.error = error.message || 'Failed to submit documents for approval';
            throw error;
        } finally {
            this.state.isLoading = false;
        }
    }
}