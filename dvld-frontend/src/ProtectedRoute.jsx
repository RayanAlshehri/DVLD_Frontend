import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "./UserContext";

function ProtectedRoute() {
    const {user} = useUser();

    return user ? <Outlet /> : <Navigate to="/"/>;
}

export default ProtectedRoute;