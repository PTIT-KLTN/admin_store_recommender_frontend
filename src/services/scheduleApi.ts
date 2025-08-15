// src/api/scheduleApi.ts

const BASE_URL = process.env.REACT_APP_BASE_API || '';

function getHeaders(isJson: boolean = true): HeadersInit {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('access_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface SchedulePayload {
  name: string;
  chains: ('BHX' | 'WM')[];
  scheduleType: 'daily' | 'hourly' | 'weekly';
  dayOfWeek: number | null;
  hour: number | null;
  minute: number | null;
  concurrency: number;
}

export interface Schedule {
  _id: string;
  chains: string[];
  crawl_all_stores: boolean;
  created_at: string;
  is_active: boolean;
  name: string;
  parameters: Record<string, any>;
  schedule_config: {
    day_of_week: number | null;
    hour: number | null;
    minute: number;
  };
  schedule_id: string;
  schedule_type: string;
  updated_at: string;
  user_id: string;
}

// Tạo mới schedule
export async function createSchedule(payload: SchedulePayload): Promise<Schedule> {
  const res = await fetch(`${BASE_URL}/schedule/crawl/schedule`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Tạo lịch thất bại');
  const json = await res.json();
  return json.data as Schedule;
}

// Lấy danh sách schedules
export async function getSchedules(): Promise<Schedule[]> {
  const res = await fetch(`${BASE_URL}/schedule/schedules`, {
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error('Lấy danh sách thất bại');
  const json = await res.json();
  return (json.data?.schedules ?? []) as Schedule[];
}

// Chạy ngay một schedule
export async function runSchedule(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/schedule/schedules/${id}/run`, {
    method: 'POST',
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error('Chạy lịch thất bại');
}

// Inactivate (xóa) schedule
export async function deleteSchedule(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/schedule/schedule/${id}`, {
    method: 'DELETE',
    headers: getHeaders(false),
  });
  if (!res.ok) throw new Error('Inactive lịch thất bại');
}
