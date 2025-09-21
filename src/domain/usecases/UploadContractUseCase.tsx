import { ContractRepositoryImpl } from "../../data/repositoriesImpl/ContractRepositoryImpl";
import { UploadContractResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";
import { isAxiosError } from 'axios';

export class UploadContractUseCase {
    private contractRepository: ContractRepository;

    constructor() {
        this.contractRepository = new ContractRepositoryImpl();
    }

    async execute(file: File): Promise<UploadContractResponse> {
        // Optional: client-side validation can be kept for better UX
        const validationError = this.validateFile(file);
        if (validationError) {
            return { success: false, error: validationError };
        }

        try {
            return await this.contractRepository.uploadContract(file);
        } catch (error: any) {
            if (isAxiosError(error) && error.response && error.response.data) {
                // Check if the backend error message is directly in error.response.data.error
                if (error.response.data.error) {
                    return { success: false, error: error.response.data.error };
                }
                // Fallback to a generic message if the specific error field is missing but it's an API error
                return { success: false, error: error.response.data.message || "An API error occurred." };
            }
            // For non-Axios errors or network errors
            return { success: false, error: error.message || "An unexpected error occurred during file upload." };
        }
    }

    private validateFile(file: File): string | null {
        if (!file) {
            return "No contract file provided. Please upload a Solidity file.";
        }

        const validExtensions = ['.sol', '.solidity'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            return `Invalid file extension '${fileExtension}'. Only ${validExtensions.join(', ')} files are allowed.`;
        }

        const maxSize = 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            return `File size (${file.size} bytes) exceeds 1MB limit (${maxSize} bytes).`;
        }

        return null;
    }
}
