import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { dispatchAppToast } from '../../presentation/components/Toast/ToastProvider';

export class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken') || localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => {
                const msg = (response.data && (response.data.message || response.data.msg)) as string | undefined;
                if (msg) {
                    dispatchAppToast({ type: 'success', description: msg });
                }
                return response;
            },
            (error) => {
                const data = error?.response?.data;
                const backendMsg = (data && (data.error || data.message || data.msg)) as string | undefined;
                const description = backendMsg || error.message || 'Request failed';
                dispatchAppToast({ type: 'error', description });
                return Promise.reject(error);
            }
        );
    }

    async get<T>(path: string): Promise<T> {
        const response: AxiosResponse<T> = await this.api.get(path);
        return response.data;
    }

    async post<T>(path: string, payload: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post(path, payload, config);
        return response.data;
    }

    async put<T>(path: string, payload: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.put(path, payload, config);
        return response.data;
    }

    async delete<T>(path: string, payload?: any, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.delete(path, { ...(config || {}), data: payload });
        return response.data;
    }

    async postForm<T>(path: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post(path, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            ...(config || {}),
        });
        return response.data;
    }
}
