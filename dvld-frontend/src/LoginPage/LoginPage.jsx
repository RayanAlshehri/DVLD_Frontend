import NavBar from "../NavBar/NavBar";
import Login from "../Login/Login"
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useEffect } from "react";


function LoginPage() {
    const navigate = useNavigate();
    const {setUser} = useUser();

    useEffect(() => {
        setUser(null);
    }, [])

    const handleLogin = () => {
        navigate("/app");
    }

    
    return (
        <>
            <NavBar showNavLinks={false}/>
            <Login onLogin={handleLogin}/>       
        </>
    )
}

export default LoginPage;