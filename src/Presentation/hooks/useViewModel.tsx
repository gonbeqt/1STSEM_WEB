import { useRef } from 'react';
import { container } from '../../di/container';
import { RegisterViewModel } from '../../domain/models/RegisterViewModel';
import { LoginViewModel } from '../../domain/models/LoginViewModel';
import { SessionViewModel } from '../../domain/models/SessionViewModel';

export function useViewModel<T>(ViewModelClass: new (...args: any[]) => T): T {
  const viewModelRef = useRef<T>();
  
  if (!viewModelRef.current) {
    if (ViewModelClass === RegisterViewModel) {
      viewModelRef.current = container.registerViewModel() as T;
    } else if (ViewModelClass === LoginViewModel) {
      viewModelRef.current = container.loginViewModel() as T;
    } else if (ViewModelClass === SessionViewModel) {
      viewModelRef.current = container.sessionViewModel() as T;
    }
  }
  
  return viewModelRef.current!;
}