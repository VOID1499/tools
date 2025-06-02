export interface PostgrestResponse<T> {
  data: T[] | null;
  error: PostgrestError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

export interface PostgrestError {
  message: string;
  details: string | null;
  hint: string | null;
  code: string | null;
}