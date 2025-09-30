import { SessionViewModel } from '../domain/viewmodel/SessionViewModel';
import { UserRepositoryImpl } from '../data/repositoriesImpl/UserRepositoryImpl';
import { WalletRepositoryImpl } from '../data/repositoriesImpl/WalletRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/viewmodel/RegisterViewModel';
import { LoginViewModel } from '../domain/viewmodel/LoginViewModel';
import { GetSessionApprovalStatusUseCase } from '../domain/usecases/GetSessionApprovalStatusUseCase';
import { TransactionRepositoryImpl } from '../data/repositoriesImpl/TransactionRepositoryImpl';
import { GetTransactionHistoryUseCase } from '../domain/usecases/GetTransactionUseCase';
import { SendEthUseCase } from '../domain/usecases/SendEthUseCase';
import { ExchangeRateRepositoryImpl } from '../data/repositoriesImpl/ExchangeRateRepositoryImpl';
import { GetExchangeRatesUseCase } from '../domain/usecases/GetExchangeRatesUseCase';
import { EmployeeRepository } from '../domain/repositories/EmployeeRepository';
import { EmployeeRepositoryImpl } from '../data/repositoriesImpl/EmployeeRepositoryImpl';
import { AddEmployeeUseCase } from '../domain/usecases/AddEmployeeUseCase';
import { GetEmployeesByManagerUseCase } from '../domain/usecases/GetEmployeesByManagerUseCase';
import { RemoveEmployeeFromTeamUseCase } from '../domain/usecases/RemoveEmployeeFromTeamUseCase';
import { EmployeeViewModel } from '../domain/viewmodel/EmployeeViewModel';
import { ReportRepository } from '../domain/repositories/ReportRepository';
import { ReportRepositoryImpl } from '../data/repositoriesImpl/ReportRepositoryImpl';
import {
  GenerateBalanceSheetUseCase,
  ExportBalanceSheetExcelUseCase,
  ExportBalanceSheetPdfUseCase,
  ListBalanceSheetsUseCase,
  GenerateCashFlowUseCase,
  ExportCashFlowExcelUseCase,
  ExportCashFlowPdfUseCase,
  ListCashFlowStatementsUseCase,
  GenerateTaxReportUseCase,
  ListTaxReportsUseCase,
  GenerateTaxAnalysisDailyUseCase,
  GenerateTaxAnalysisWeeklyUseCase,
  GenerateTaxAnalysisMonthlyUseCase,
  GenerateTaxAnalysisYearlyUseCase,
  GenerateTaxAnalysisCustomUseCase
} from '../domain/usecases/ReportUseCases';
import { Container } from 'lucide-react';
import { SessionRepositoryImpl } from '../data/repositoriesImpl/SessionRepositoryImpl';
import { PayslipRepository } from '../domain/repositories/PayslipRepository';
import { LogoutUseCase } from '../domain/usecases/LogOutUseCase';
import { ReconnectWalletUseCase } from '../domain/usecases/ReconnectWalletUseCase';
import { GetWalletBalanceUseCase } from '../domain/usecases/GetWalletBalanceUseCase';
import { ConnectWalletUseCase } from '../domain/usecases/ConnectWalletUseCase';
import { ListSessionsUseCase } from '../domain/usecases/ListSessionsUseCase';
import { RevokeOtherSessionsUseCase } from '../domain/usecases/RevokeOtherSessionsUseCase';
import { RevokeSessionUseCase } from '../domain/usecases/RevokeSessionUseCase';
import { TransferMainDeviceUseCase } from '../domain/usecases/TransferMainDeviceUseCase';
import { ApproveSessionUseCase } from '../domain/usecases/ApproveSessionUseCase';
import { GetUserPayslipsUseCase } from '../domain/usecases/GetUserPayslipsUseCase';
import { WalletViewModel } from '../domain/viewmodel/WalletViewModal';
import { PayslipRepositoryImpl } from '../data/repositoriesImpl/PayslipRepositoryImpl';
import { BusinessDocumentRepository } from '../domain/repositories/BusinessDocumentRepository';
import { BusinessDocumentRepositoryImpl } from '../data/repositoriesImpl/BusinessDocumentRepositoryImpl';
import { UploadBusinessDocumentsUseCase } from '../domain/usecases/UploadBusinessDocumentsUseCase';
import { BusinessDocumentViewModel } from '../domain/viewmodel/BusinessDocumentViewModel';

import { InvoiceRepository } from '../domain/repositories/InvoiceRepository';
import { InvoiceRepositoryImpl } from '../data/repositoriesImpl/InvoiceRepositoryImpl';
import { GetInvoicesUseCase } from '../domain/usecases/GetInvoicesUseCase';
import { InvoiceViewModel } from '../domain/viewmodel/InvoiceViewModel';



export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;
  sessionRepository: SessionRepositoryImpl;
  transactionRepository: TransactionRepositoryImpl;
  exchangeRateRepository: ExchangeRateRepositoryImpl;
  employeeRepository: EmployeeRepository;
  reportRepository: ReportRepository;
  payslipRepository: PayslipRepository;
  businessDocumentRepository: BusinessDocumentRepository;
  invoiceRepository: InvoiceRepository;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  uploadBusinessDocumentsUseCase: UploadBusinessDocumentsUseCase;
  getInvoicesUseCase: GetInvoicesUseCase;

  connectWalletUseCase: ConnectWalletUseCase;
  reconnectWalletUseCase: ReconnectWalletUseCase;
  getWalletBalanceUseCase: GetWalletBalanceUseCase;
  sendEthUseCase: SendEthUseCase;
  getExchangeRatesUseCase: GetExchangeRatesUseCase;
  addEmployeeUseCase: AddEmployeeUseCase;
  getEmployeesByManagerUseCase: GetEmployeesByManagerUseCase;
  removeEmployeeFromTeamUseCase: RemoveEmployeeFromTeamUseCase;

  // Report Use Cases
  generateBalanceSheetUseCase: GenerateBalanceSheetUseCase;
  exportBalanceSheetExcelUseCase: ExportBalanceSheetExcelUseCase;
  exportBalanceSheetPdfUseCase: ExportBalanceSheetPdfUseCase;
  listBalanceSheetsUseCase: ListBalanceSheetsUseCase;
  generateCashFlowUseCase: GenerateCashFlowUseCase;
  exportCashFlowExcelUseCase: ExportCashFlowExcelUseCase;
  exportCashFlowPdfUseCase: ExportCashFlowPdfUseCase;
  listCashFlowStatementsUseCase: ListCashFlowStatementsUseCase;
  generateTaxReportUseCase: GenerateTaxReportUseCase;
  listTaxReportsUseCase: ListTaxReportsUseCase;
  generateTaxAnalysisDailyUseCase: GenerateTaxAnalysisDailyUseCase;
  generateTaxAnalysisWeeklyUseCase: GenerateTaxAnalysisWeeklyUseCase;
  generateTaxAnalysisMonthlyUseCase: GenerateTaxAnalysisMonthlyUseCase;
  generateTaxAnalysisYearlyUseCase: GenerateTaxAnalysisYearlyUseCase;
  generateTaxAnalysisCustomUseCase: GenerateTaxAnalysisCustomUseCase;

  listSessionsUseCase: ListSessionsUseCase;
  revokeSessionUseCase: RevokeSessionUseCase;
  revokeOtherSessionsUseCase: RevokeOtherSessionsUseCase;
  approveSessionUseCase: ApproveSessionUseCase;
  transferMainDeviceUseCase: TransferMainDeviceUseCase;
  getSessionApprovalStatusUseCase: GetSessionApprovalStatusUseCase;
  getTransactionHistoryUseCase: GetTransactionHistoryUseCase;
  getUserPayslipsUseCase: GetUserPayslipsUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
  walletViewModel: () => WalletViewModel;
  sessionViewModel: () => SessionViewModel;
  employeeViewModel: () => EmployeeViewModel;
  businessDocumentViewModel: () => BusinessDocumentViewModel;
  invoiceViewModel: () => InvoiceViewModel;

}
// ======= Create repository instances =======
const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();
const sessionRepository = new SessionRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const exchangeRateRepository = new ExchangeRateRepositoryImpl();
const employeeRepository = new EmployeeRepositoryImpl();
const reportRepository = new ReportRepositoryImpl();
const payslipRepository = new PayslipRepositoryImpl();
const businessDocumentRepository = new BusinessDocumentRepositoryImpl();
const invoiceRepository = new InvoiceRepositoryImpl();

// ======= Create use case instances =======
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const logoutUseCase = new LogoutUseCase(userRepository);
const uploadBusinessDocumentsUseCase = new UploadBusinessDocumentsUseCase(businessDocumentRepository);
const getInvoicesUseCase = new GetInvoicesUseCase(invoiceRepository);

const connectWalletUseCase = new ConnectWalletUseCase(walletRepository);
const reconnectWalletUseCase = new ReconnectWalletUseCase(walletRepository);
const getWalletBalanceUseCase = new GetWalletBalanceUseCase(walletRepository);
const sendEthUseCase = new SendEthUseCase(walletRepository);
const getExchangeRatesUseCase = new GetExchangeRatesUseCase(exchangeRateRepository);
const addEmployeeUseCase = new AddEmployeeUseCase(employeeRepository);
const getEmployeesByManagerUseCase = new GetEmployeesByManagerUseCase(employeeRepository);
const removeEmployeeFromTeamUseCase = new RemoveEmployeeFromTeamUseCase(employeeRepository);

// ======= Create report use case instances =======
const generateBalanceSheetUseCase = new GenerateBalanceSheetUseCase(reportRepository);
const exportBalanceSheetExcelUseCase = new ExportBalanceSheetExcelUseCase(reportRepository);
const exportBalanceSheetPdfUseCase = new ExportBalanceSheetPdfUseCase(reportRepository);
const listBalanceSheetsUseCase = new ListBalanceSheetsUseCase(reportRepository);
const generateCashFlowUseCase = new GenerateCashFlowUseCase(reportRepository);
const exportCashFlowExcelUseCase = new ExportCashFlowExcelUseCase(reportRepository);
const exportCashFlowPdfUseCase = new ExportCashFlowPdfUseCase(reportRepository);
const listCashFlowStatementsUseCase = new ListCashFlowStatementsUseCase(reportRepository);
const generateTaxReportUseCase = new GenerateTaxReportUseCase(reportRepository);
const listTaxReportsUseCase = new ListTaxReportsUseCase(reportRepository);
const generateTaxAnalysisDailyUseCase = new GenerateTaxAnalysisDailyUseCase(reportRepository);
const generateTaxAnalysisWeeklyUseCase = new GenerateTaxAnalysisWeeklyUseCase(reportRepository);
const generateTaxAnalysisMonthlyUseCase = new GenerateTaxAnalysisMonthlyUseCase(reportRepository);
const generateTaxAnalysisYearlyUseCase = new GenerateTaxAnalysisYearlyUseCase(reportRepository);
const generateTaxAnalysisCustomUseCase = new GenerateTaxAnalysisCustomUseCase(reportRepository);

const listSessionsUseCase = new ListSessionsUseCase(sessionRepository);
const revokeSessionUseCase = new RevokeSessionUseCase(sessionRepository);
const revokeOtherSessionsUseCase = new RevokeOtherSessionsUseCase(sessionRepository);
const approveSessionUseCase = new ApproveSessionUseCase(sessionRepository);
const transferMainDeviceUseCase = new TransferMainDeviceUseCase(sessionRepository);
const getSessionApprovalStatusUseCase = new GetSessionApprovalStatusUseCase(sessionRepository);

const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);
const getUserPayslipsUseCase = new GetUserPayslipsUseCase(payslipRepository);

// ======= Container =======
export const container: Container = {
  userRepository,
  walletRepository,
  sessionRepository,
  transactionRepository,
  exchangeRateRepository,
  employeeRepository,
  reportRepository,
  payslipRepository,
  businessDocumentRepository,
  invoiceRepository,

  registerUseCase,
  loginUseCase,
  logoutUseCase,
  uploadBusinessDocumentsUseCase,
  getInvoicesUseCase,

  connectWalletUseCase,
  reconnectWalletUseCase,
  getWalletBalanceUseCase,
  sendEthUseCase,
  getExchangeRatesUseCase,
  addEmployeeUseCase,
  getEmployeesByManagerUseCase,
  removeEmployeeFromTeamUseCase,

  // Report Use Cases
  generateBalanceSheetUseCase,
  exportBalanceSheetExcelUseCase,
  exportBalanceSheetPdfUseCase,
  listBalanceSheetsUseCase,
  generateCashFlowUseCase,
  exportCashFlowExcelUseCase,
  exportCashFlowPdfUseCase,
  listCashFlowStatementsUseCase,
  generateTaxReportUseCase,
  listTaxReportsUseCase,
  generateTaxAnalysisDailyUseCase,
  generateTaxAnalysisWeeklyUseCase,
  generateTaxAnalysisMonthlyUseCase,
  generateTaxAnalysisYearlyUseCase,
  generateTaxAnalysisCustomUseCase,

  listSessionsUseCase,
  revokeSessionUseCase,
  revokeOtherSessionsUseCase,
  approveSessionUseCase,
  transferMainDeviceUseCase,
  getSessionApprovalStatusUseCase,
  getTransactionHistoryUseCase,
  getUserPayslipsUseCase,

  registerViewModel: () => new RegisterViewModel(registerUseCase),
  loginViewModel: () => {
    return new LoginViewModel(loginUseCase, logoutUseCase, () => container.walletViewModel());
  },
  walletViewModel: () => new WalletViewModel(
    connectWalletUseCase,
    reconnectWalletUseCase,
    getWalletBalanceUseCase,
    sendEthUseCase,
    getExchangeRatesUseCase
  ),
  sessionViewModel: () => new SessionViewModel(
    listSessionsUseCase,
    revokeSessionUseCase,
    revokeOtherSessionsUseCase,
    approveSessionUseCase,
    transferMainDeviceUseCase
  ),
  employeeViewModel: () => new EmployeeViewModel(
    addEmployeeUseCase,
    getEmployeesByManagerUseCase,
    removeEmployeeFromTeamUseCase
  ),
  businessDocumentViewModel: () => new BusinessDocumentViewModel(
    uploadBusinessDocumentsUseCase
  ),
  invoiceViewModel: () => new InvoiceViewModel(getInvoicesUseCase)
};