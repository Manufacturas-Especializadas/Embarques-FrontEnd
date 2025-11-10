import { useAuth } from "../../context/AuthContext";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    fallback?: React.ReactNode;
}

export const RoleGuard = ({
    children,
    allowedRoles,
    fallback = null
}: RoleGuardProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <>{fallback}</>;
    }

    if (!user?.role || !allowedRoles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};