export interface Account {
  id: string;
  username: string;
  fullname: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}
