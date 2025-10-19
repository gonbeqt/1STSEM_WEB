import { BusinessDocumentRepository } from '../repositories/BusinessDocumentRepository';

export class GetUserBusinessDocumentsUseCase {
  constructor(private readonly repository: BusinessDocumentRepository) {}

  async execute(): Promise<any> {
    return this.repository.getUserDocuments();
  }
}
