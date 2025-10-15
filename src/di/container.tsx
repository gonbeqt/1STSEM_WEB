import { UserRepositoryImpl } from '../data/repositoriesImpl/UserRepositoryImpl';
import { WalletRepositoryImpl } from '../data/repositoriesImpl/WalletRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/viewmodel/RegisterViewModel';
import { LoginViewModel } from '../domain/viewmodel/LoginViewModel';
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
import {
  GenerateDailyRiskAnalysisUseCase,
  GenerateWeeklyRiskAnalysisUseCase,
  GenerateMonthlyRiskAnalysisUseCase,
  GenerateQuarterlyRiskAnalysisUseCase,
  GenerateYearlyRiskAnalysisUseCase,
  GetRiskAnalysisHistoryUseCase,
  GetLatestRiskAnalysisUseCase
} from '../domain/usecases/RiskAnalysisUseCases';
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
import { PasswordResetRepositoryImpl } from '../data/repositoriesImpl/PasswordResetRepositoryImpl';
import { RequestPasswordResetUseCase } from '../domain/usecases/RequestPasswordResetUseCase';
import { ResetPasswordUseCase } from '../domain/usecases/ResetPasswordUseCase';
import { PasswordResetViewModel } from '../domain/viewmodel/PasswordResetViewModel';
import { EmployeeHistoryRepository } from '../domain/repositories/EmployeeHistoryRepository';
import { EmployeeHistoryRepositoryImpl } from '../data/repositoriesImpl/EmployeeHistoryRepositoryImpl';
import { GetEmployeeHistoryUseCase, GetEmployeeHistoryUseCaseImpl } from '../domain/usecases/GetEmployeeHistoryUseCase';
import { EmployeeHistoryViewModel } from '../domain/viewmodel/EmployeeHistoryViewModel';
import { RiskAnalysisViewModel } from '../domain/viewmodel/RiskAnalysisViewModel';






export interface Container {
  forgotPasswordViewModel(): any;
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;
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
  passwordResetRepository: PasswordResetRepositoryImpl;
  employeeHistoryRepository: EmployeeHistoryRepository;


  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;
  verifyEmailUseCase: VerifyEmailUseCase;
  resendVerificationUseCase: ResendVerificationUseCase;
  requestPasswordResetUseCase: RequestPasswordResetUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
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
  getEmployeeHistoryUseCase: GetEmployeeHistoryUseCase;
  
  
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
  generateDailyRiskAnalysisUseCase: GenerateDailyRiskAnalysisUseCase;
  generateWeeklyRiskAnalysisUseCase: GenerateWeeklyRiskAnalysisUseCase;
  generateMonthlyRiskAnalysisUseCase: GenerateMonthlyRiskAnalysisUseCase;
  generateQuarterlyRiskAnalysisUseCase: GenerateQuarterlyRiskAnalysisUseCase;
  generateYearlyRiskAnalysisUseCase: GenerateYearlyRiskAnalysisUseCase;
  getRiskAnalysisHistoryUseCase: GetRiskAnalysisHistoryUseCase;
  getLatestRiskAnalysisUseCase: GetLatestRiskAnalysisUseCase;

  getTransactionHistoryUseCase: GetTransactionHistoryUseCase;
  getUserPayslipsUseCase: GetUserPayslipsUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
  walletViewModel: () => WalletViewModel;
  addressBookViewModel: () => AddressBookViewModel;
  employeeViewModel: () => EmployeeViewModel;
  businessDocumentViewModel: () => BusinessDocumentViewModel;
  invoiceViewModel: () => InvoiceViewModel;
  payslipViewModel: () => PayslipViewModel;
  payrollViewModel: () => PayrollViewModel;
  auditContractViewModel: () => AuditContractViewModel;
  emailVerificationViewModel: () => EmailVerificationViewModel;
  passwordResetViewModel: () => PasswordResetViewModel;
  employeeHistoryViewModel: () => EmployeeHistoryViewModel;
  riskAnalysisViewModel: () => RiskAnalysisViewModel;


}


// ======= Create repository instances =======
const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();
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
const passwordResetRepository = new PasswordResetRepositoryImpl();
const employeeHistoryRepository = new EmployeeHistoryRepositoryImpl();

// ======= Create use case instances =======
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const logoutUseCase = new LogoutUseCase(userRepository);
const verifyEmailUseCase = new VerifyEmailUseCase(emailVerificationRepository);
const resendVerificationUseCase = new ResendVerificationUseCase(emailVerificationRepository);
const requestPasswordResetUseCase = new RequestPasswordResetUseCase(passwordResetRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(passwordResetRepository);
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
const getEmployeeHistoryUseCase = new GetEmployeeHistoryUseCaseImpl(employeeHistoryRepository);

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
const generateDailyRiskAnalysisUseCase = new GenerateDailyRiskAnalysisUseCase(reportRepository);
const generateWeeklyRiskAnalysisUseCase = new GenerateWeeklyRiskAnalysisUseCase(reportRepository);
const generateMonthlyRiskAnalysisUseCase = new GenerateMonthlyRiskAnalysisUseCase(reportRepository);
const generateQuarterlyRiskAnalysisUseCase = new GenerateQuarterlyRiskAnalysisUseCase(reportRepository);
const generateYearlyRiskAnalysisUseCase = new GenerateYearlyRiskAnalysisUseCase(reportRepository);
const getRiskAnalysisHistoryUseCase = new GetRiskAnalysisHistoryUseCase(reportRepository);
const getLatestRiskAnalysisUseCase = new GetLatestRiskAnalysisUseCase(reportRepository);

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
  passwordResetRepository,
  employeeHistoryRepository,

  registerUseCase,
  loginUseCase,
  logoutUseCase,
  verifyEmailUseCase,
  resendVerificationUseCase,
  requestPasswordResetUseCase,
  resetPasswordUseCase,
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
  getEmployeeHistoryUseCase,

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
  generateDailyRiskAnalysisUseCase,
  generateWeeklyRiskAnalysisUseCase,
  generateMonthlyRiskAnalysisUseCase,
  generateQuarterlyRiskAnalysisUseCase,
  generateYearlyRiskAnalysisUseCase,
  getRiskAnalysisHistoryUseCase,
  getLatestRiskAnalysisUseCase,

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
  ),
  passwordResetViewModel: () => new PasswordResetViewModel(
    requestPasswordResetUseCase,
    resetPasswordUseCase
  ),
  employeeHistoryViewModel: () => new EmployeeHistoryViewModel(getEmployeeHistoryUseCase),
  riskAnalysisViewModel: () => new RiskAnalysisViewModel(
    generateDailyRiskAnalysisUseCase,
    generateWeeklyRiskAnalysisUseCase,
    generateMonthlyRiskAnalysisUseCase,
    generateQuarterlyRiskAnalysisUseCase,
    generateYearlyRiskAnalysisUseCase,
    getRiskAnalysisHistoryUseCase,
    getLatestRiskAnalysisUseCase
  ),
  forgotPasswordViewModel: function () {
    throw new Error('Function not implemented.');
  },
  

};