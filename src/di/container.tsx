import { UserRepositoryImpl } from '../domain/repositoriesImpl/UserRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/models/RegisterViewModel';
import { LoginViewModel } from '../domain/models/LoginViewModel';
import { WalletRepositoryImpl } from '../domain/repositoriesImpl/WalletRepositoryImpl';
import { ConnectWalletUseCase } from '../domain/usecases/ConnectWalletUseCase';
import { GetWalletsUseCase } from '../domain/usecases/GetWalletUseCase';
import { DisconnectWalletUseCase } from '../domain/usecases/DisconnectWalletUseCase';
import { WalletViewModel } from '../domain/models/WalletViewModal';

export interface Container {
  userRepository: UserRepositoryImpl;
  walletRepository: WalletRepositoryImpl;

  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  connectWalletUseCase: ConnectWalletUseCase;
  getWalletsUseCase: GetWalletsUseCase;
  disconnectWalletUseCase: DisconnectWalletUseCase;

  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
    walletViewModel: () => WalletViewModel;

  
}

export const container: Container = {
  userRepository: new UserRepositoryImpl(),
  walletRepository: new WalletRepositoryImpl(),

  registerUseCase: new RegisterUseCase(new UserRepositoryImpl()),
  loginUseCase: new LoginUseCase(new UserRepositoryImpl()),
   connectWalletUseCase: new ConnectWalletUseCase(new WalletRepositoryImpl()),
  getWalletsUseCase: new GetWalletsUseCase(new WalletRepositoryImpl()),
  disconnectWalletUseCase: new DisconnectWalletUseCase(new WalletRepositoryImpl()),

  registerViewModel: () => new RegisterViewModel(new RegisterUseCase(new UserRepositoryImpl())),
  loginViewModel: () => new LoginViewModel(new LoginUseCase(new UserRepositoryImpl())),
  walletViewModel: () => new WalletViewModel(
    new ConnectWalletUseCase(new WalletRepositoryImpl()),
    new GetWalletsUseCase(new WalletRepositoryImpl()),
    new DisconnectWalletUseCase(new WalletRepositoryImpl())
  )
};
