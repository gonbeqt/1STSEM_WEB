export interface LoginRequest {
  username: string;
  password: string;
  device_name?: string;
  device_id?: string;
}