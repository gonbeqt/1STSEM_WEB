export interface Session {
    sid: string;
    device_name: string;
    device_id: string;
    ip: string;
    user_agent: string;
    created_at: string;
    last_seen: string | null;
    approved: boolean;
    approved_at: string | null;
    revoked_at: string | null;
    is_current: boolean;
    is_main_device: boolean;
}
