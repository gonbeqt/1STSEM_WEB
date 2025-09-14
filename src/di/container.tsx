import { UserRepositoryImpl } from '../domain/repositoriesImpl/UserRepositoryImpl';
import { RegisterUseCase } from '../domain/usecases/RegisterUseCase';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import { RegisterViewModel } from '../domain/models/RegisterViewModel';
import { LoginViewModel } from '../domain/models/LoginViewModel';

export interface Container {
  userRepository: UserRepositoryImpl;
  registerUseCase: RegisterUseCase;
  loginUseCase: LoginUseCase;
  registerViewModel: () => RegisterViewModel;
  loginViewModel: () => LoginViewModel;
}

export const container: Container = {
  userRepository: new UserRepositoryImpl(),
  registerUseCase: new RegisterUseCase(new UserRepositoryImpl()),
  loginUseCase: new LoginUseCase(new UserRepositoryImpl()),
  registerViewModel: () => new RegisterViewModel(new RegisterUseCase(new UserRepositoryImpl())),
  loginViewModel: () => new LoginViewModel(new LoginUseCase(new UserRepositoryImpl()))
};
