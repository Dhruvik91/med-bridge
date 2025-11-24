export interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string | null;
    statusCode: number;
    isError: boolean;
}