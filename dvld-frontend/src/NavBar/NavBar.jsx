import { useEffect, useState } from "react";
import {useUser} from '../UserContext.jsx'
import styles from './NavBar.module.css'
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import UpperMenuSubMenu from "../UpperMenuSubMenu/UpperMenuSubMenu.jsx";

function NavBar({showNavLinks}) {
    const [activeItem, setActiveItem] = useState("");
    const [applicationsSubMenuVisible, setApplicationsSubMenuVisible] = useState(false);
    const [manageSubMenuVisible, setManageSubMenuVisible] = useState(false);
    const {user} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const applicationsMenuItems = [{text: "New", subItems: [{text: "Driving License", subItems: [{text: "Local License", subItems: [], onClick: handleLocalLicenseMenuItemClick}]}, 
    {text: "Renew License", subItems: [], onClick: () => navigate("/app/applications/renew")}]}, 
    {text: "Manage Applications", subItems: [], onClick: handleManageApplicationsClick}]
    const manageMenuItems = [{text: "Services", subItems: [], onClick: () => navigate("/app/manage/services")},
    {text: "Test Types", subItems: [], onClick: () => navigate("/app/manage/test-types")}, {text: "License Classes", subItems: [], onClick: () => navigate("/app/manage/license-classes")}]

    useEffect(() => {
        if (location.pathname.includes("dashboard"))
            setActiveItem("Dashboard");
        else if (location.pathname.includes("persons"))
            setActiveItem("Persons");
        else if (location.pathname.includes("users"))
            setActiveItem("Users");
        else if (location.pathname.includes("applications"))
            setActiveItem("Applications");
        else if (location.pathname.includes("manage"))
            setActiveItem("Manage");
        else
            setActiveItem("");
        
    }, [location])
    

    function handleLocalLicenseMenuItemClick() {
        navigate("/app/applications/local-license-application");
    }

    function handleManageApplicationsClick() {   
        navigate("/app/applications/manage-application");
    }

    return (
        <div>
            <nav className={styles.mainMenu}>
                <h1>DVLD</h1>
                {showNavLinks && (
                    <>
                        <ul>
                            <li onClick={() => navigate("/app/dashboard")} className={activeItem == "Dashboard" ? styles.activeMainMenuItem : ""} >
                                Dashboard</li>
                            <li onMouseOver={() => setApplicationsSubMenuVisible(true)} onMouseLeave={() => setApplicationsSubMenuVisible(false)} className={activeItem == "Applications" ? styles.activeMainMenuItem : ""}>
                                Applications
                                {applicationsSubMenuVisible &&
                                    <UpperMenuSubMenu
                                        menuItems={applicationsMenuItems} />}
                            </li>

                            <li onMouseOver={() => setManageSubMenuVisible(true)} onMouseLeave={() => setManageSubMenuVisible(false)} className={activeItem == "Manage" ? styles.activeMainMenuItem : ""} >
                                Manage
                                {manageSubMenuVisible &&
                                    <UpperMenuSubMenu
                                        menuItems={manageMenuItems} />}
                            </li>
                            <li className={activeItem == "Drivers" ? styles.activeMainMenuItem : ""} >
                                Drivers</li>
                            <li className={activeItem == "Persons" ? styles.activeMainMenuItem : ""} onClick={() => navigate("/app/persons")}>
                                Persons</li>
                            <li className={activeItem == "Users" ? styles.activeMainMenuItem : ""} onClick={() => navigate("/app/users")}>
                                Users</li>
                        </ul>
                        <p>Welcome {user.person.firstName}</p>
                    </>
                )}
            </nav>
            <div className="page-content-container">
                <Outlet />
            </div>
        </div>
    );
}

export default NavBar;
