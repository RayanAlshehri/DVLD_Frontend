import { useEffect, useState } from "react";
import {useUser} from '../UserContext.jsx'
import styles from './NavBar.module.css'
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import UpperMenuSubMenu from "../UpperMenuSubMenu/UpperMenuSubMenu.jsx";

function NavBar({showNavLinks}) {
    const [activeItem, setActiveItem] = useState("");
    const [applicationsSubMenuVisible, setApplicationsSubMenuVisible] = useState(false);
    const {user} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const applicationsMenuItems = [{text: "New", subItems: [{text: "Driving License", subItems: [{text: "Local License", subItems: [], onClick: handleLocalLicenseMenuItemClick}]}]}, 
    {text: "Manage Applications", subItems: [], onClick: handleManageApplicationsClick}]

    useEffect(() => {
        if (location.pathname.includes("persons"))
            setActiveItem("Persons");
        else if (location.pathname.includes("users"))
            setActiveItem("Users");
        else
            setActiveItem("");
        
    }, [location])
    

    const handleItemClick = (item) => {
        setActiveItem(item);

        switch (item) {
            case "Persons":
                navigate("/app/persons");
                break;

            case "Users":
                navigate("/app/users");
                break;
        }
    }

    function handleLocalLicenseMenuItemClick() {
        navigate("/app/local-license-application");
    }

    function handleManageApplicationsClick() {      
        navigate("/app/manage-application");
    }

    return (
        <div>
            <nav className={styles.mainMenu}>
                <h1>DVLD</h1>
                {showNavLinks && (
                    <>
                        <ul>
                            <li onMouseOver={() => setApplicationsSubMenuVisible(true)} onMouseLeave={() => setApplicationsSubMenuVisible(false)}>
                                Applications
                                {applicationsSubMenuVisible && 
                                <UpperMenuSubMenu 
                                menuItems={applicationsMenuItems} />}
                            </li>
                            
                            <li className={activeItem == "Manage" ? styles.activeMainMenuItem : ""} onClick={() => handleItemClick("Manage")}>
                                Manage</li>
                            <li className={activeItem == "Drivers" ? styles.activeMainMenuItem : ""} onClick={() => handleItemClick("Drivers")}>
                                Drivers</li>
                            <li className={activeItem == "Persons" ? styles.activeMainMenuItem : ""} onClick={() => handleItemClick("Persons")}>
                                Persons</li>
                            <li className={activeItem == "Users" ? styles.activeMainMenuItem : ""} onClick={() => handleItemClick("Users")}>
                                Users</li>
                        </ul>
                        <p>Welcome {user.person.firstName}</p>
                    </>
                )}
            </nav>
            <div className="page-content-container ">
                <Outlet />
            </div>
        </div>
    );
}

export default NavBar;
