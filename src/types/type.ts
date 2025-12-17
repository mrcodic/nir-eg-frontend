export interface ApiResponse<T> {
  status_code: number;
  status: boolean;
  data: T;
  message: string;
}
