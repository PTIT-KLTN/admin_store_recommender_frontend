import axios from 'axios';
import {Store} from '../models/store'

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = 'true'
  }
  return config;
});

const BASE_URL = process.env.REACT_APP_BASE_API || '';

/** Tham số tạo crawl */
export type CrawlParams = {
  chain: string;
  storeId: string;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  concurrency: number;
};

/** Định nghĩa raw task trả về từ backend */
interface TaskRaw {
  task_id: string;
  store_id: string;
  chain: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  parameters: any;
  result: {
    status: string;
    [key: string]: any;
  };
}

/** Kiểu Task dùng trong UI */
export interface Task {
  id: string;
  store_id: string;
  chain: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

/** Lấy danh sách tasks của user */
export const getTasks = async (limit = 100, skip = 0): Promise<Task[]> => {
  const { data } = await axios.get<{
    message: string;
    data: { tasks: TaskRaw[]; total: number; limit: number; skip: number };
  }>(`${BASE_URL}/crawling/tasks`, {
    params: { limit, skip },
  });
  return data.data.tasks.map(t => ({
    id: t.task_id,
    store_id: t.store_id,
    chain: t.chain,
    status: t.status,
    created_at: t.created_at,
  }));
};

/** Bắt đầu crawl store (không chờ hoàn thành) */
export const startCrawl = async (params: CrawlParams): Promise<string> => {
  const { data } = await axios.post<{ message: string; data: { task_id: string } }>(
    `${BASE_URL}/crawling/crawl/store`,
    {
      storeId: params.storeId,
      chain: params.chain,
      provinceId: params.provinceId,
      districtId: params.districtId,
      wardId: params.wardId,
      concurrency: params.concurrency,
    }
  );
  return data.data.task_id;
};

/** Kiểm tra status của một task */
export const getTaskDetail = async (taskId: string): Promise<TaskRaw> => {
  const { data } = await axios.get<{ message: string; data: TaskRaw }>(
    `${BASE_URL}/crawling/task/${taskId}/status`
  );
  return data.data;
};

/** Ping service xem có online không */
export const pingService = async (): Promise<boolean> => {
  try {
    const { data } = await axios.get<{
      message: string;
      data: { action: string; status: string; message: string };
    }>(`${BASE_URL}/crawling/ping`);
    return data.data.status === 'success';
  } catch {
    return false;
  }
};

export const getStores = async (chain: string): Promise<Store[]> => {
  const { data } = await axios.get<{
    message: string;
    stores: Store[];
  }>(`${BASE_URL}/stores`, {
    params: { chain, pageSize : 1000 },
  });
  return data.stores;
};
