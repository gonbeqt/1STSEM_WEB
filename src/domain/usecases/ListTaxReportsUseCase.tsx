import { ReportRepository } from '../repositories/ReportRepository';

export class ListTaxReportsUseCase {
  constructor(private repository: ReportRepository) {}

  async execute() {
    return this.repository.listTaxReports();
  }
}
