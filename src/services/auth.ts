import { fetcher } from '../utils/fetcher';
import { Admin, LoginResponse } from '../models/admin';
const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse(res: Response) {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Server hiện không phản hồi. Vui lòng thử lại sau.');
    return json;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetcher(`${BASE_URL}/admin_auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
         },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(res) as Promise<LoginResponse>;
}

/** Đổi refresh_token lấy access mới */
export async function refreshToken(): Promise<{
    access_token: string;
    refresh_token: string;
}> {
    const token = localStorage.getItem('refresh_token');
    const res = await fetch(`${BASE_URL}/admin_auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
         },
        body: JSON.stringify({ refresh_token: token }),
    });
    return handleResponse(res);
}

export async function updateAdminProfile(
    id: string,
    data: { email?: string; fullname?: string }
): Promise<Admin> {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/admin/admins/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const json = await handleResponse(res) as { admin: any; message: string };
    const a = json.admin;
    return {
        id: a.id,
        email: a.email,
        fullname: a.fullname,
        role: a.role,
        is_enabled: a.is_enabled,
    };
}