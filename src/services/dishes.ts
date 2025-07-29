import { Dish } from '../models/models';

const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Fetch error');
  return json as T;
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

export async function getDishes(): Promise<Dish[]> {
  const res = await fetchWithToken(`${BASE_URL}/admin/dishes`);
  const data = await handleResponse<{ dishes: Dish[] }>(res);
  return data.dishes;
}
