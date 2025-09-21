import { WalletViewModel } from '../domain/viewmodel/WalletViewModal';
import { LogoutUseCase } from '../domain/usecases/LogOutUseCase';
import { ConnectWalletUseCase } from '../domain/usecases/ConnectWalletUseCase';
import { ReconnectWalletUseCase } from '../domain/usecases/ReconnectWalletUseCase';
import { GetWalletBalanceUseCase } from '../domain/usecases/GetWalletBalanceUseCase';
import { SessionRepositoryImpl } from '../data/repositoriesImpl/SessionRepositoryImpl';
import { ListSessionsUseCase } from '../domain/usecases/ListSessionsUseCase';
import { RevokeSessionUseCase } from '../domain/usecases/RevokeSessionUseCase';
import { RevokeOtherSessionsUseCase } from '../domain/usecases/RevokeOtherSessionsUseCase';
import { ApproveSessionUseCase } from '../domain/usecases/ApproveSessionUseCase';
import { TransferMainDeviceUseCase } from '../domain/usecases/TransferMainDeviceUseCase';
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

export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;
  sessionRepository: SessionRepositoryImpl;
  transactionRepository: TransactionRepositoryImpl;
  exchangeRateRepository: ExchangeRateRepositoryImpl;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;

  connectWalletUseCase: ConnectWalletUseCase;
  reconnectWalletUseCase: ReconnectWalletUseCase;
  getWalletBalanceUseCase: GetWalletBalanceUseCase;
  sendEthUseCase: SendEthUseCase;
  getExchangeRatesUseCase: GetExchangeRatesUseCase;

  listSessionsUseCase: ListSessionsUseCase;
  revokeSessionUseCase: RevokeSessionUseCase;
  revokeOtherSessionsUseCase: RevokeOtherSessionsUseCase;
  approveSessionUseCase: ApproveSessionUseCase;
  transferMainDeviceUseCase: TransferMainDeviceUseCase;
  getSessionApprovalStatusUseCase: GetSessionApprovalStatusUseCase;
  getTransactionHistoryUseCase: GetTransactionHistoryUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
  walletViewModel: () => WalletViewModel;
  sessionViewModel: () => SessionViewModel;
};

// ======= Create repository instances =======
const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();
const sessionRepository = new SessionRepositoryImpl();
const transactionRepository = new TransactionRepositoryImpl();
const exchangeRateRepository = new ExchangeRateRepositoryImpl();

// ======= Create use case instances =======
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const logoutUseCase = new LogoutUseCase(userRepository);

const connectWalletUseCase = new ConnectWalletUseCase(walletRepository);
const reconnectWalletUseCase = new ReconnectWalletUseCase(walletRepository);
const getWalletBalanceUseCase = new GetWalletBalanceUseCase(walletRepository);
const sendEthUseCase = new SendEthUseCase(walletRepository);
const getExchangeRatesUseCase = new GetExchangeRatesUseCase(exchangeRateRepository);

const listSessionsUseCase = new ListSessionsUseCase(sessionRepository);
const revokeSessionUseCase = new RevokeSessionUseCase(sessionRepository);
const revokeOtherSessionsUseCase = new RevokeOtherSessionsUseCase(sessionRepository);
const approveSessionUseCase = new ApproveSessionUseCase(sessionRepository);
const transferMainDeviceUseCase = new TransferMainDeviceUseCase(sessionRepository);
const getSessionApprovalStatusUseCase = new GetSessionApprovalStatusUseCase(sessionRepository);

const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);

// ======= Container =======
export const container: Container = {
  userRepository,
  walletRepository,
  sessionRepository,
  transactionRepository,
  exchangeRateRepository,

  registerUseCase,
  loginUseCase,
  logoutUseCase,

  connectWalletUseCase,
  reconnectWalletUseCase,
  getWalletBalanceUseCase,
  sendEthUseCase,
  getExchangeRatesUseCase,

  listSessionsUseCase,
  revokeSessionUseCase,
  revokeOtherSessionsUseCase,
  approveSessionUseCase,
  transferMainDeviceUseCase,
  getSessionApprovalStatusUseCase,
  getTransactionHistoryUseCase,

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
  )
};
