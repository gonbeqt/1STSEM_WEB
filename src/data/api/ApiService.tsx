import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Optional: Add an interceptor for authentication tokens if needed
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken'); // Assuming token is stored in localStorage
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async get<T>(path: string): Promise<T> {
        const response: AxiosResponse<T> = await this.api.get(path);
        return response.data;
    }

    async post<T>(path: string, payload: any): Promise<T> {
        const response: AxiosResponse<T> = await this.api.post(path, payload);
        return response.data;
    }

    // Add other methods like put, delete if needed
}
