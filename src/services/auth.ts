import {Admin, LoginResponse} from '../models/models';
const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse(res: Response) {
    const json = await res.json();
    if (!res.ok) throw new Error('Server not responding');
    return json;
}

/**
 * Sends login request and returns tokens + admin info
 */
export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/admin_auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token }),
    });
    return handleResponse(res);
}