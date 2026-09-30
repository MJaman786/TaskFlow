import axios from "axios";
import { HEADER_WITH_JSON, HEADER_WITH_TOKEN } from "./Headers";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import showToast from "./ShowToast";
import type { ApiResponse, MakeRequestTypes } from "../../types/MakeRequest/index";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:9000";

export default async function makeRequest<T>({
    pathname,
    method = 'GET',
    token = true,
    params,
    values,
    showMessage = false,
    show_error_message = false,
    isFormData = false,
    isNewPath = false

}: MakeRequestTypes): Promise<ApiResponse<T> | undefined> {

    try {

        // 🔥 get token from authstore
        // const GetToken = useAuthStore.getState().token;
        const TOKEN = useAuthStore.getState().token // ✅ correct

        // 🔥 note:
        // 1. for GET and DELETE body data is not required in request.
        // 2. for POST PUT PATCH body data is required in request.
        const isData = method === 'GET' || method === 'DELETE' ? {} : { ...values }

        const response = await axios<ApiResponse<T>>({
            method: method,
            url: `${API_BASE_URL}${pathname}`,
            params: { ...params },
            headers: {
                "ngrok-skip-browser-warning": "true",
                ...(token && HEADER_WITH_TOKEN(TOKEN)),
                ...(!isFormData && HEADER_WITH_JSON())
            },
            data: isData,
            withCredentials: true
        })

        // console.log("res : ",response?.data)

        // show message
        if (showMessage) {
            console.log(response.data);

            if (response.data.success === true) {
                showToast({ msg: response.data.message, type: 'success' })
            }
            if (response.data.success === false) {
                showToast({ msg: response.data.message, type: 'error' })
            }
        }

        return { ...response.data }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const data = error.response.data as ApiResponse<any>;
            const statusCode = error.response.status;
            if (statusCode === 401 && token) {
                showToast({ msg: "Your session has expired. Please log in again.", type: 'error' });
                useAuthStore.getState().logout();
                window.location.href = "/login";
                return { ...data };
            }

            if (show_error_message || showMessage) {
                showToast({ msg: data.message, type: 'error' });
            }

            return { ...data }; // return the { success: false, ... } object
        }
        // Network error / no response
        showToast({ msg: 'Network error, please try again.', type: 'error' });
        return undefined;
    }
}

