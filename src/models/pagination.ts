export interface Pagination {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;      
  totalElements: number;   
  totalPages: number;     
}

