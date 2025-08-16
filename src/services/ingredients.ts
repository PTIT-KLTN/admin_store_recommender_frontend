import { IngredientPayload, Ingredient } from "../models/dish";
import { Pagination } from "../models/pagination";

const BASE_URL = process.env.REACT_APP_BASE_API || '';
async function handleResponse<T>(res: Response): Promise<T> {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Fetch error');
    return json;
}

export async function getIngredients(
    page = 0,
    category?: string,
    size?: number,
    search?: string
): Promise<{
    ingredients: Ingredient[];
    pagination: Pagination;
}> {
    const token = localStorage.getItem('access_token');

    // build URL với query category nếu có
    let url = `${BASE_URL}/admin/ingredients?page=${page}`;
    if (size != null) {
        url += `&size=${size}`;
    }

    if (category && category !== 'All') {
        url += `&category=${encodeURIComponent(category)}`;
    }

    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` ,
      'ngrok-skip-browser-warning': 'true'},
    });
    return handleResponse(res);
}


export async function getCategories(): Promise<string[]> {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` ,
        'ngrok-skip-browser-warning': 'true'
      },
    });
    // giả sử API trả về { categories: string[] }
    const json = await handleResponse<{ categories: string[] }>(res);
    return json.categories;
}

export async function createIngredient(data: IngredientPayload): Promise<void> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/admin/ingredients`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  await handleResponse(res);
}

export async function updateIngredient(id: string, data: IngredientPayload): Promise<void> {
  const token = localStorage.getItem('access_token');
  const res = await fetch(`${BASE_URL}/admin/ingredients/${id}`, {
    method: 'PUT',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  await handleResponse(res);
}


export async function deleteIngredient(id: string): Promise<void> {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/admin/ingredients/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true',
          Authorization: `Bearer ${token}` },
    });
    await handleResponse(res);
}
