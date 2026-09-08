export interface ApiResponse<T> {
  message: string;
  result: boolean;
  data: T;
}
