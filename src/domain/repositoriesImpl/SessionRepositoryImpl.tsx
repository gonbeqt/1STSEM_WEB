import { request } from "http";
import { SessionRepository } from "../../data/repositories/SessionRepository";
import { Session } from "../entities/SessionEntities";

export class SessionRepositoryImpl implements SessionRepository {
      private readonly API_URL = 'http://localhost:8000/api';

    async listSessions(): Promise<Session[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`${this.API_URL}/auth/sessions/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to fetch sessions:', response.status, response.statusText, errorBody);
            throw new Error(`Failed to fetch sessions: ${response.statusText}`);
        }
        const data = await response.json();
        return data.sessions;
    }

    async revokeSession(sid: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`${this.API_URL}/auth/sessions/revoke/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sid })
            
        });
        console.log('Revoke Session Response Status:', response);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to revoke session:', response.status, response.statusText, errorBody);
            throw new Error(`Failed to revoke session: ${response.statusText}`);
        }
    }

    async revokeOtherSessions(): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`${this.API_URL}/auth/sessions/revoke-others/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to revoke other sessions:', response.status, response.statusText, errorBody);
            throw new Error(`Failed to revoke other sessions: ${response.statusText}`);
        }
    }

    async approveSession(sid: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`${this.API_URL}/auth/sessions/approve/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session_id: sid })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to approve session:', response.status, response.statusText, errorBody);
            throw new Error(`Failed to approve session: ${response.statusText}`);
        }
    }

    async transferMainDevice(sid: string): Promise<void> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }

        const response = await fetch(`${this.API_URL}/auth/sessions/transfer-main/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ session_id: sid })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to transfer main device privileges:', response.status, response.statusText, errorBody);
            throw new Error(`Failed to transfer main device privileges: ${response.statusText}`);
        }
    }
}
