import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/Auth/useAuthStore";

export default function ProtectedRoutes() {
    const { isLoggedIn } = useAuthStore();
    return isLoggedIn ? <Outlet /> : <Navigate to={'/'} />
}
