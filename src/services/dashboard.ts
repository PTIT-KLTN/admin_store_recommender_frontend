const BASE_URL = process.env.REACT_APP_BASE_API || '';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export interface Summary {
  users_total: number;
  users_new_7d: number;
  dishes_total: number;
  ingredients_total: number;
  crawls_failed: number;
}

export interface TrendItem {
  week_start: string;
  count: number;
}

export interface RecentItem {
  _id: string;
  vietnamese_name?: string;
  status?: string;
}

export interface CrawlItem {
  _id: string;
  status: string;
  result?: {
    status: string;
    store_name?: string;
  };
}

export async function fetchSummary(): Promise<Summary> {
  const res = await fetch(`${BASE_URL}/report/summary`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to load summary');
  return res.json();
}


export async function fetchUserTrend(weeks = 4): Promise<TrendItem[]> {
  const res = await fetch(
    `${BASE_URL}/report/users/trend?interval=weekly&weeks=${weeks}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error('Failed to load trend data');
  return res.json();
}


export async function fetchRecentDishes(limit = 5): Promise<RecentItem[]> {
  const res = await fetch(
    `${BASE_URL}/report/recent?type=dishes&limit=${limit}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error('Failed to load recent dishes');
  return res.json();
}


export async function fetchRecentCrawls(limit = 5): Promise<RecentItem[]> {
  const res = await fetch(
    `${BASE_URL}/report/recent?type=crawls&limit=${limit}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error('Failed to load recent crawls');
  return res.json();
}
