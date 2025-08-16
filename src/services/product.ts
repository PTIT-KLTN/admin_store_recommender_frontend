// src/services/products.ts
const BASE_URL = process.env.REACT_APP_BASE_API || '';

// Xử lý response chung
async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Fetch error');
  return json as T;
}

// Tạo headers mặc định, bao gồm Content-Type và Authorization (nếu có token)
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Định nghĩa kiểu dữ liệu trả về API
export interface Product {
  _id: string;
  category: string;
  chain: string;
  crawled_at: string;
  date_begin: string;
  date_end: string;
  discount_percent: number;
  image: string;
  name: string;
  name_en: string;
  net_unit_value: number;
  price: number;
  promotion: string;
  sku: number;
  store_id: number;
  sys_price: number;
  token_ngrams: string[];
  unit: string;
  url: string;
}

export interface Pagination {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_elements: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface Category {
  category: string;
  collection: string;
  product_count: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total_categories: number;
  total_products: number;
  store_id: string;
}

export interface PriceStats {
  min_price: number;
  max_price: number;
  avg_price: number;
}

export interface CategoryStat {
  category: string;
  product_count: number;
  price_stats: PriceStats;
}

export interface StatsResponse {
  store_info: {
    store_id: string;
    store_name: string;
    chain: string;
    location: string;
  };
  categories: CategoryStat[];
  price_range: PriceStats;
  total_products: number;
  total_categories: number;
}

// Gọi API lấy products
export async function getStoreProducts(
  store_id: string,
  params: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
  }
): Promise<ProductsResponse> {
  const url = new URL(`${BASE_URL}/products/store/${store_id}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<ProductsResponse>(res);
}

// Gọi API lấy categories
export async function getStoreCategories(
  store_id: string
): Promise<CategoriesResponse> {
  const res = await fetch(
    `${BASE_URL}/products/store/${store_id}/categories`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  return handleResponse<CategoriesResponse>(res);
}

// Gọi API lấy stats
export async function getStoreStats(
  store_id: string
): Promise<StatsResponse> {
  const res = await fetch(
    `${BASE_URL}/products/store/${store_id}/stats`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  return handleResponse<StatsResponse>(res);
}
