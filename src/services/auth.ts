import { fetcher } from '../utils/fetcher';
import { Admin, LoginResponse } from '../models/admin';
const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse(res: Response) {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Server hiện không phản hồi. Vui lòng thử lại sau.');
    return json;
}

/**
 * Sends login request and returns tokens + admin info
 */
export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetcher(`${BASE_URL}/admin_auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token }),
    });
    return handleResponse(res);
}

async function fetchWithToken(input: RequestInfo, init: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(input, { ...init, headers });
}

export async function updateAdminProfile(
    id: string,
    data: { username?: string; fullname?: string }
): Promise<Admin> {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/admin/admins/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    const json = await handleResponse(res) as { admin: any; message: string };
    const a = json.admin;
    return {
        id: a.id,
        username: a.username,
        fullname: a.fullname,
        role: a.role,
        is_enabled: a.is_enabled,
    };
}