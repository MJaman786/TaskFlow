import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import AdminLayoutWrapper from "./AdminLayout";
import UserLayoutWrapper from "./UserLayout";

interface Props {
    activePage: string;
}

export default function DynamicRoleLayout({ activePage }: Props) {
    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "ADMIN") {
        return <AdminLayoutWrapper activePage={activePage} />;
    }

    return <UserLayoutWrapper activePage={activePage} />;
}