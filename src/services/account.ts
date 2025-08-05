import { Account } from "../models/account";
import { Pagination } from "../models/pagination";

const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Fetch error');
  return json as T;
}

export async function getAccounts(
  page: number,
  size: number,
  search?: string,
  sortField?: string,
  sortAsc?: boolean
): Promise<{ admins: Account[]; pagination: Pagination }> {
  const token = localStorage.getItem('access_token');
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (search) params.append('search', search);
  if (sortField) params.append('sortField', sortField);
  if (sortAsc !== undefined) params.append('sortAsc', sortAsc.toString());

  const res = await fetch(`${BASE_URL}/admin/admins?${params}`, {
    headers: { Authorization: `Bearer ${token}`,
  'ngrok-skip-browser-warning': 'true' }
  });
  return handleResponse<{ admins: Account[]; pagination: Pagination }>(res);
}


export async function createAccount(
  email: string,
  fullname: string
): Promise<Account> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/admin/create-admin-auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'ngrok-skip-browser-warning': 'true',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      email, fullname
    })
  });
  return handleResponse<Account>(res);
}

export async function updateAccount(
  id: string,
  email: string,
  fullname: string
): Promise<Account> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(
    `${BASE_URL}/admin/admins/${id}`,
    {
      method: 'PUT',
      headers: {
        //'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, fullname }),
    }
  );
  return handleResponse<Account>(res);
}

export async function toggleAccountEnabled(id: string, enable: boolean): Promise<void> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/admin/admins/${id}/status`, {
    method: 'PATCH',
    headers: {
      //'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ is_enabled: enable })
  });
  await handleResponse(res);
}
