export interface Ingredient {
  category: string;
  image: string;
  ingredient_name: string;
  net_unit_value: number;
  unit: string;
  vietnamese_name: string;
}

export interface Dish {
  _id: string;
  dish: string;
  image?: string;
  ingredients?: Ingredient[];
  vietnamese_name: string;
}

export interface Pagination {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface Admin {
    email: string;
    fullname: string;
    id: string;
    is_enabled: boolean;
    role: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    admin: Admin;
    message: string;
}
