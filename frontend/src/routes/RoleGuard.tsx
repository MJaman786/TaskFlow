import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/Auth/useAuthStore"

interface Prop {
    allowedRoles: string[]
}

export default function RoleGuard({ allowedRoles }: Prop) {

    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />
}
