import { ApiService } from './ApiService';

const baseURL = process.env.REACT_APP_API_BASE_URL || '';
export const apiService = new ApiService(baseURL);
export default apiService;
