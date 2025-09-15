import { UserRepositoryImpl } from '../domain/repositoriesImpl/UserRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/models/RegisterViewModel';
import { LoginViewModel } from '../domain/models/LoginViewModel';
import { WalletRepositoryImpl } from '../domain/repositoriesImpl/WalletRepositoryImpl';
import { WalletViewModel } from '../domain/models/WalletViewModal';
import { LogoutUseCase } from '../domain/usecases/LogOutUseCase';
import { ConnectWalletUseCase } from '../domain/usecases/ConnectWalletUseCase';
import { ReconnectWalletUseCase } from '../domain/usecases/ReconnectWalletUseCase';
import { GetWalletBalanceUseCase } from '../domain/usecases/GetWalletBalanceUseCase';


export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  logoutUseCase: LogoutUseCase;

  connectWalletUseCase: ConnectWalletUseCase;
  reconnectWalletUseCase: ReconnectWalletUseCase;
  getWalletBalanceUseCase: GetWalletBalanceUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
  walletViewModel: () => WalletViewModel;
}

// Create instances
const userRepository = new UserRepositoryImpl();
const walletRepository = new WalletRepositoryImpl();

export const container: Container = {
  userRepository,
  walletRepository,

  registerUseCase: new RegisterUseCase(userRepository),
  loginUseCase: new LoginUseCase(userRepository),
  logoutUseCase: new LogoutUseCase(userRepository),
  connectWalletUseCase: new ConnectWalletUseCase(walletRepository),
  reconnectWalletUseCase: new ReconnectWalletUseCase(walletRepository),
  getWalletBalanceUseCase: new GetWalletBalanceUseCase(walletRepository),
 
  registerViewModel: () => new RegisterViewModel(new RegisterUseCase(userRepository)),
  loginViewModel: () => new LoginViewModel(
    new LoginUseCase(userRepository),
    new LogoutUseCase(userRepository)
  ),
  walletViewModel: () => new WalletViewModel(
    new ConnectWalletUseCase(walletRepository),
    new ReconnectWalletUseCase(walletRepository),
    new GetWalletBalanceUseCase(walletRepository)
  )
};