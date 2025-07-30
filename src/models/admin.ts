export interface Admin {
    email: string;
    fullname: string;
    id: string;
    is_enabled: boolean;
    role: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    admin: Admin;
    message: string;
}