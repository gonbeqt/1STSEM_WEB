export class SendSupportMessageUseCase {
  private repository: any;

  constructor(repository: any) {
    this.repository = repository;
  }

  async execute(payload: { subject?: string; message: string; category?: string; priority?: string; attachments?: File | Blob | string | FileList | Array<File | Blob | string> }) {
    if (!payload || !payload.message) {
      throw new Error('Message is required');
    }

    const result = await this.repository.sendSupportMessage(payload);
    return result;
  }
}

export default SendSupportMessageUseCase;
