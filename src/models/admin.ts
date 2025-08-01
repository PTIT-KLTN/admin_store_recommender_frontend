export interface Admin {
    username: string;
    fullname: string;
    id: string;
    is_enabled: boolean;
    role: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    admin: Admin;
    message: string;
}