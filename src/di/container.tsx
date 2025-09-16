
import { WalletViewModel } from '../domain/models/WalletViewModal';
import { LogoutUseCase } from '../domain/usecases/LogOutUseCase';
import { ConnectWalletUseCase } from '../domain/usecases/ConnectWalletUseCase';
import { ReconnectWalletUseCase } from '../domain/usecases/ReconnectWalletUseCase';
import { GetWalletBalanceUseCase } from '../domain/usecases/GetWalletBalanceUseCase';
import { SessionRepositoryImpl } from '../domain/repositoriesImpl/SessionRepositoryImpl';
import { ListSessionsUseCase } from '../domain/usecases/ListSessionsUseCase';
import { RevokeSessionUseCase } from '../domain/usecases/RevokeSessionUseCase';
import { RevokeOtherSessionsUseCase } from '../domain/usecases/RevokeOtherSessionsUseCase';
import { ApproveSessionUseCase } from '../domain/usecases/ApproveSessionUseCase';
import { TransferMainDeviceUseCase } from '../domain/usecases/TransferMainDeviceUseCase';
import { SessionViewModel } from '../domain/models/SessionViewModel';
import { UserRepositoryImpl } from '../domain/repositoriesImpl/UserRepositoryImpl';
import { WalletRepositoryImpl } from '../domain/repositoriesImpl/WalletRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/models/RegisterViewModel';
import { LoginViewModel } from '../domain/models/LoginViewModel';
import { GetSessionApprovalStatusUseCase } from '../domain/usecases/GetSessionApprovalStatusUseCase';
import { TransactionRepositoryImpl } from '../domain/repositoriesImpl/TransactionRepositoryImpl';
import { GetTransactionHistoryUseCase } from '../domain/usecases/GetTransactionUseCase';


export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;
  sessionRepository: SessionRepositoryImpl;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;

  connectWalletUseCase: ConnectWalletUseCase;
  reconnectWalletUseCase: ReconnectWalletUseCase;
  getWalletBalanceUseCase: GetWalletBalanceUseCase;
  listSessionsUseCase: ListSessionsUseCase;
  revokeSessionUseCase: RevokeSessionUseCase;
  revokeOtherSessionsUseCase: RevokeOtherSessionsUseCase;
  approveSessionUseCase: ApproveSessionUseCase;
  transferMainDeviceUseCase: TransferMainDeviceUseCase;
  getSessionApprovalStatusUseCase: GetSessionApprovalStatusUseCase;
  transactionRepository: TransactionRepositoryImpl;
  getTransactionHistoryUseCase: GetTransactionHistoryUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
  walletViewModel: () => WalletViewModel;
  sessionViewModel: () => SessionViewModel;
}

// Create instances
const transactionRepository = new TransactionRepositoryImpl();

const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();
const sessionRepository = new SessionRepositoryImpl();

export const container: Container = {
  userRepository,
  walletRepository,
  sessionRepository,
  transactionRepository,
  getTransactionHistoryUseCase: new GetTransactionHistoryUseCase(transactionRepository),
  registerUseCase: new RegisterUseCase(userRepository),
  loginUseCase: new LoginUseCase(userRepository),
  logoutUseCase: new LogoutUseCase(userRepository),
  connectWalletUseCase: new ConnectWalletUseCase(walletRepository),
  reconnectWalletUseCase: new ReconnectWalletUseCase(walletRepository),
  getWalletBalanceUseCase: new GetWalletBalanceUseCase(walletRepository),
  listSessionsUseCase: new ListSessionsUseCase(sessionRepository),
  revokeSessionUseCase: new RevokeSessionUseCase(sessionRepository),
  revokeOtherSessionsUseCase: new RevokeOtherSessionsUseCase(sessionRepository),
  approveSessionUseCase: new ApproveSessionUseCase(sessionRepository),
  transferMainDeviceUseCase: new TransferMainDeviceUseCase(sessionRepository),
  getSessionApprovalStatusUseCase: new GetSessionApprovalStatusUseCase(sessionRepository),
 
  registerViewModel: () => new RegisterViewModel(new RegisterUseCase(userRepository)),
  loginViewModel: () => {
    const walletViewModelInstance = new WalletViewModel(
      new ConnectWalletUseCase(walletRepository),
      new ReconnectWalletUseCase(walletRepository),
      new GetWalletBalanceUseCase(walletRepository)
    );
    return new LoginViewModel(
      new LoginUseCase(userRepository),
      new LogoutUseCase(userRepository),
      walletViewModelInstance
    );
  },
  walletViewModel: () => new WalletViewModel(
    new ConnectWalletUseCase(walletRepository),
    new ReconnectWalletUseCase(walletRepository),
    new GetWalletBalanceUseCase(walletRepository)
  ),
  sessionViewModel: () => new SessionViewModel(
    new ListSessionsUseCase(sessionRepository),
    new RevokeSessionUseCase(sessionRepository),
    new RevokeOtherSessionsUseCase(sessionRepository),
    new ApproveSessionUseCase(sessionRepository),
    new TransferMainDeviceUseCase(sessionRepository)
  )
};

