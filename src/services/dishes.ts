import { Dish } from '../models/dish';
import { NewDishPayload } from '../models/dish';

const BASE_URL = process.env.REACT_APP_BASE_API || '';

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Fetch error');
  return json as T;
}

export async function getDishes(): Promise<Dish[]> {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${BASE_URL}/admin/dishes`,
    {
      method: "GET",
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    }
  );
  const data = await handleResponse<{ dishes: Dish[] }>(res);
  return data.dishes;
}

export async function createDish(
  payload: NewDishPayload
): Promise<Dish> {
  
  // Lấy token đã lưu trong localStorage
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token, please login first.');

  const res = await fetch(`${BASE_URL}/admin/dishes`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  // Giả sử API trả về { dish: Dish }
  const data = await handleResponse<{ dish: Dish }>(res);
  return data.dish;
}

export async function updateDish(
  id: string,
  payload: NewDishPayload
): Promise<Dish> {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No access token, please login first.');

  const res = await fetch(`${BASE_URL}/admin/dishes/${id}`, {
    method: 'PUT',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  // Giả sử API trả về { dish: Dish }
  const data = await handleResponse<{ dish: Dish }>(res);
  return data.dish;
}

export async function deleteDish(id: string): Promise<void> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/admin/dishes/${id}`, {
    method: 'DELETE',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Xóa món thất bại');
  }
}