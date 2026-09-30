export interface MakeRequestTypes {
    pathname: string;
    isNewPath?: boolean;
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    values?: any;
    params?: Record<string, any>;
    showMessage?: boolean;
    show_error_message?: boolean;
    token?: boolean;
    isFormData?: boolean;
}

export interface ApiResponse<T> {
    success: boolean,
    statusCode: number,
    message: string,
    data: T,
    timestamp: string,
    pagination?: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    },
    summary?: any
}
