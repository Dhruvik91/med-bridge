export interface ApiResponse<T> {
    data: T;
    message: string[];
    error: string | null;
    statusCode: number;
    isError: boolean;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}