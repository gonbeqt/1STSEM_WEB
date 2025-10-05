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
import { DisconnectWalletUseCase } from '../domain/usecases/DisconnectWalletUseCase';
import { ConvertCryptoToFiatUseCase } from '../domain/usecases/ConvertCryptoToFiatUseCase';
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
import { SessionRepositoryImpl } from '../data/repositoriesImpl/SessionRepositoryImpl';
import { PayslipRepository } from '../domain/repositories/PayslipRepository';
import { CreatePayslipUseCase } from '../domain/usecases/CreatePayslipUseCase';
import { CreatePayrollEntryUseCase } from '../domain/usecases/CreatePayrollEntryUseCase';
import { ProcessPayrollPaymentUseCase } from '../domain/usecases/ProcessPayrollPaymentUseCase';
import { GetEmployeePayrollDetailsUseCase } from '../domain/usecases/GetEmployeePayrollDetailsUseCase';
import { CreateRecurringPaymentUseCase } from '../domain/usecases/CreateRecurringPaymentUseCase';
import { GetPaymentScheduleUseCase } from '../domain/usecases/GetPaymentScheduleUseCase';
import { PayslipViewModel } from '../domain/viewmodel/PayslipViewModel';
import { PayrollViewModel } from '../domain/viewmodel/PayrollViewModel';
import { AddressBookRepositoryImpl } from '../data/repositoriesImpl/AddressBookRepositoryImpl';
import {
  UpsertAddressBookEntryUseCase,
  ResolveAddressNameUseCase,
  ListAddressBookUseCase,
  DeleteAddressBookEntryUseCase
} from '../domain/usecases/AddressBookUseCases';
import { AddressBookViewModel } from '../domain/viewmodel/AddressBookViewModel';
import { LogoutUseCase } from '../domain/usecases/LogOutUseCase';
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

// Audit Contract imports
import { ContractRepository } from '../domain/repositories/ContractRepository';
import { ContractRepositoryImpl } from '../data/repositoriesImpl/ContractRepositoryImpl';
import { UploadContractUseCase } from '../domain/usecases/UploadContractUseCase';
import { AuditContractUseCase } from '../domain/usecases/AuditContractUseCase';
import { ListAuditsUseCase } from '../domain/usecases/ListAuditsUseCase';
import { GetAuditDetailsUseCase } from '../domain/usecases/GetAuditDetailsUseCase';
import { GetAuditStatisticsUseCase } from '../domain/usecases/GetAuditStatisticsUseCase';
import { AuditContractViewModel } from '../domain/viewmodel/AuditContractViewModel';
import { EmailVerificationRepositoryImpl } from '../data/repositoriesImpl/EmailVerificationRepositoryImpl';
import { VerifyEmailUseCase } from '../domain/usecases/VerifyEmailUseCase';
import { ResendVerificationUseCase } from '../domain/usecases/ResendVerificationUseCase';
import { EmailVerificationViewModel } from '../domain/viewmodel/EmailVerificationViewModel';



export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;
  sessionRepository: SessionRepositoryImpl;
  transactionRepository: TransactionRepositoryImpl;
  exchangeRateRepository: ExchangeRateRepositoryImpl;
  addressBookRepository: AddressBookRepositoryImpl;
  employeeRepository: EmployeeRepository;
  reportRepository: ReportRepository;
  payslipRepository: PayslipRepository;
  businessDocumentRepository: BusinessDocumentRepository;
  invoiceRepository: InvoiceRepository;
  contractRepository: ContractRepository;
  emailVerificationRepository: EmailVerificationRepositoryImpl;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  verifyEmailUseCase: VerifyEmailUseCase;
  resendVerificationUseCase: ResendVerificationUseCase;
  uploadBusinessDocumentsUseCase: UploadBusinessDocumentsUseCase;
  getInvoicesUseCase: GetInvoicesUseCase;

  connectWalletUseCase: ConnectWalletUseCase;
  getWalletBalanceUseCase: GetWalletBalanceUseCase;
  sendEthUseCase: SendEthUseCase;
  getExchangeRatesUseCase: GetExchangeRatesUseCase;
  addEmployeeUseCase: AddEmployeeUseCase;
  getEmployeesByManagerUseCase: GetEmployeesByManagerUseCase;
  removeEmployeeFromTeamUseCase: RemoveEmployeeFromTeamUseCase;
  createPayslipUseCase: CreatePayslipUseCase;
  createPayrollEntryUseCase: CreatePayrollEntryUseCase;
  processPayrollPaymentUseCase: ProcessPayrollPaymentUseCase;
  getEmployeePayrollDetailsUseCase: GetEmployeePayrollDetailsUseCase;
  createRecurringPaymentUseCase: CreateRecurringPaymentUseCase;
  getPaymentScheduleUseCase: GetPaymentScheduleUseCase;
  
  // Audit Contract Use Cases
  uploadContractUseCase: UploadContractUseCase;
  auditContractUseCase: AuditContractUseCase;
  listAuditsUseCase: ListAuditsUseCase;
  getAuditDetailsUseCase: GetAuditDetailsUseCase;
  getAuditStatisticsUseCase: GetAuditStatisticsUseCase;

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
  addressBookViewModel: () => AddressBookViewModel;
  sessionViewModel: () => SessionViewModel;
  employeeViewModel: () => EmployeeViewModel;
  businessDocumentViewModel: () => BusinessDocumentViewModel;
  invoiceViewModel: () => InvoiceViewModel;
  payslipViewModel: () => PayslipViewModel;
  payrollViewModel: () => PayrollViewModel;
  auditContractViewModel: () => AuditContractViewModel;
  emailVerificationViewModel: () => EmailVerificationViewModel;

}
// ======= Create repository instances =======
const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();
const sessionRepository = new SessionRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const exchangeRateRepository = new ExchangeRateRepositoryImpl();
const addressBookRepository = new AddressBookRepositoryImpl();
const employeeRepository = new EmployeeRepositoryImpl();
const reportRepository = new ReportRepositoryImpl();
const payslipRepository = new PayslipRepositoryImpl();
const businessDocumentRepository = new BusinessDocumentRepositoryImpl();
const invoiceRepository = new InvoiceRepositoryImpl();
const contractRepository = new ContractRepositoryImpl();
const emailVerificationRepository = new EmailVerificationRepositoryImpl();

// ======= Create use case instances =======
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const logoutUseCase = new LogoutUseCase(userRepository);
const verifyEmailUseCase = new VerifyEmailUseCase(emailVerificationRepository);
const resendVerificationUseCase = new ResendVerificationUseCase(emailVerificationRepository);
const uploadBusinessDocumentsUseCase = new UploadBusinessDocumentsUseCase(businessDocumentRepository);
const getInvoicesUseCase = new GetInvoicesUseCase(invoiceRepository);

const connectWalletUseCase = new ConnectWalletUseCase(walletRepository);
const getWalletBalanceUseCase = new GetWalletBalanceUseCase(walletRepository);
const sendEthUseCase = new SendEthUseCase(walletRepository);
const disconnectWalletUseCase = new DisconnectWalletUseCase(walletRepository);
const convertCryptoToFiatUseCase = new ConvertCryptoToFiatUseCase(walletRepository);

// Address Book Use Cases
const upsertAddressBookEntryUseCase = new UpsertAddressBookEntryUseCase(addressBookRepository);
const resolveAddressNameUseCase = new ResolveAddressNameUseCase(addressBookRepository);
const listAddressBookUseCase = new ListAddressBookUseCase(addressBookRepository);
const deleteAddressBookEntryUseCase = new DeleteAddressBookEntryUseCase(addressBookRepository);

// Address Book ViewModel singleton
const addressBookViewModelInstance = new AddressBookViewModel(
  upsertAddressBookEntryUseCase,
  resolveAddressNameUseCase,
  listAddressBookUseCase,
  deleteAddressBookEntryUseCase
);
const getExchangeRatesUseCase = new GetExchangeRatesUseCase(exchangeRateRepository);
const addEmployeeUseCase = new AddEmployeeUseCase(employeeRepository);
const getEmployeesByManagerUseCase = new GetEmployeesByManagerUseCase(employeeRepository);
const removeEmployeeFromTeamUseCase = new RemoveEmployeeFromTeamUseCase(employeeRepository);
const createPayslipUseCase = new CreatePayslipUseCase(payslipRepository);
const createPayrollEntryUseCase = new CreatePayrollEntryUseCase(payslipRepository);
const processPayrollPaymentUseCase = new ProcessPayrollPaymentUseCase(payslipRepository);
const getEmployeePayrollDetailsUseCase = new GetEmployeePayrollDetailsUseCase(payslipRepository);
const createRecurringPaymentUseCase = new CreateRecurringPaymentUseCase(payslipRepository);
const getPaymentScheduleUseCase = new GetPaymentScheduleUseCase(payslipRepository);

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

// Audit Contract Use Cases
const uploadContractUseCase = new UploadContractUseCase();
const auditContractUseCase = new AuditContractUseCase();
const listAuditsUseCase = new ListAuditsUseCase();
const getAuditDetailsUseCase = new GetAuditDetailsUseCase();
const getAuditStatisticsUseCase = new GetAuditStatisticsUseCase();

// ======= Container =======
export const container: Container = {
  userRepository,
  walletRepository,
  sessionRepository,
  transactionRepository,
  exchangeRateRepository,
  addressBookRepository,
  employeeRepository,
  reportRepository,
  payslipRepository,
  businessDocumentRepository,
  invoiceRepository,
  contractRepository,
  emailVerificationRepository,

  registerUseCase,
  loginUseCase,
  logoutUseCase,
  verifyEmailUseCase,
  resendVerificationUseCase,
  uploadBusinessDocumentsUseCase,
  getInvoicesUseCase,

  connectWalletUseCase,
  getWalletBalanceUseCase,
  sendEthUseCase,
  getExchangeRatesUseCase,
  addEmployeeUseCase,
  getEmployeesByManagerUseCase,
  removeEmployeeFromTeamUseCase,
  createPayslipUseCase,
  createPayrollEntryUseCase,
  processPayrollPaymentUseCase,
  getEmployeePayrollDetailsUseCase,
  createRecurringPaymentUseCase,
  getPaymentScheduleUseCase,
  
  // Audit Contract Use Cases
  uploadContractUseCase,
  auditContractUseCase,
  listAuditsUseCase,
  getAuditDetailsUseCase,
  getAuditStatisticsUseCase,

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
    return new LoginViewModel(loginUseCase, logoutUseCase, () => new WalletViewModel(
      connectWalletUseCase,
      getWalletBalanceUseCase,
      disconnectWalletUseCase,
      convertCryptoToFiatUseCase,
      sendEthUseCase,
      getExchangeRatesUseCase
    ));
  },
  walletViewModel: () => new WalletViewModel(
    connectWalletUseCase,
    getWalletBalanceUseCase,
    disconnectWalletUseCase,
    convertCryptoToFiatUseCase,
    sendEthUseCase,
    getExchangeRatesUseCase
  ),
  addressBookViewModel: () => addressBookViewModelInstance,
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
    uploadBusinessDocumentsUseCase,
    businessDocumentRepository
  ),
  invoiceViewModel: () => new InvoiceViewModel(getInvoicesUseCase),
  payslipViewModel: () => new PayslipViewModel(createPayslipUseCase),
  payrollViewModel: () => new PayrollViewModel(createPayrollEntryUseCase, processPayrollPaymentUseCase),
  auditContractViewModel: () => new AuditContractViewModel(
    uploadContractUseCase,
    auditContractUseCase,
    listAuditsUseCase,
    getAuditDetailsUseCase,
    getAuditStatisticsUseCase
  ),
  emailVerificationViewModel: () => new EmailVerificationViewModel(
    verifyEmailUseCase,
    resendVerificationUseCase
  )
};