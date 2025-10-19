import { BusinessDocumentRepository } from '../repositories/BusinessDocumentRepository';

export class SubmitBusinessDocumentsForApprovalUseCase {
  constructor(private readonly repository: BusinessDocumentRepository) {}

  async execute(): Promise<any> {
    return this.repository.submitDocumentsForApproval();
  }
}
