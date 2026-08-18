export interface BaseResponse<T> {
  data: T;
}

export interface PaginationMetadata {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  metadata: PaginationMetadata;
}
