import { UploadContractResponse } from "../entities/ContractEntities";
import { ContractRepository } from "../repositories/ContractRepository";
import { isAxiosError } from 'axios';

export class UploadContractUseCase {
    constructor(private readonly contractRepository: ContractRepository) {}

    async execute(file: File): Promise<UploadContractResponse> {
        const validationError = this.validateFile(file);
        if (validationError) {
            return { success: false, error: validationError };
        }

        try {
            return await this.contractRepository.uploadContract(file);
        } catch (error: any) {
            if (isAxiosError(error) && error.response && error.response.data) {
                if (error.response.data.error) {
                    return { success: false, error: error.response.data.error };
                }
                return { success: false, error: error.response.data.message || "An API error occurred." };
            }
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
