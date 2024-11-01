import { useEffect, useState, useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import { useNavigate } from "react-router-dom";
import Table from '../Table/Table';
import styles from './Dashboard.module.css'
import {getTotalNumberOfPersons} from '../APIRequests/PersonsRequests'
import {getTotalNumberOfUsers} from '../APIRequests/UsersRequests'
import { getTotalNumberOfLocalLicenseApplications } from '../APIRequests/Applications';
import { getLicenseClassesView } from '../APIRequests/LicenseClassesRequests';
import useMessageBox from "../Global/MessageBox";
import MessageBox from "../MessageBox/MessageBox";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [totalNumberOfPersons, setTotalNumberOfPersons] = useState(-1);
    const [totalNumberOfUsers, setTotalNumberOfUsers] = useState(-1);
    const [totalNumberOfLocalLicenseApplications, setTotalNumberOfLocalLicenseApplications] = useState(-1);
    const [licenseClasses, setLicenseClassesView] = useState(null);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const navigate = useNavigate();

    useEffect(() => {
        async function getData() {
            try {
                const personsResponse = await getTotalNumberOfPersons();
                const usersResponse = await getTotalNumberOfUsers();
                const applicationsResponse = await getTotalNumberOfLocalLicenseApplications();
                const licenseClassesResponse = await getLicenseClassesView();

                setTotalNumberOfPersons(personsResponse.data);
                setTotalNumberOfUsers(usersResponse.data)
                setTotalNumberOfLocalLicenseApplications(applicationsResponse.data);
                setLicenseClassesView(licenseClassesResponse.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch data", "error");
            }
            finally {
                setLoading(false);
            }                    
        }

        getData();
    }, [])

        
    const columns = useMemo(
        () => [
    
            {
                Header: 'Class Name',
                accessor: 'className',
            },
            {
                Header: 'Fee',
                accessor: 'fee',
            },
            {
                Header: 'Number Of First Time Issues',
                accessor: 'numberOfFirstTimeIssues',
            },
            {
                Header: 'Total Fees Collected',
                accessor: 'totalFeesCollected',
            },
        ],
        []
    );

    function renderTableContent() {
        if (loading)
            return <PulseLoader color='#87cefa' />;

         if (licenseClasses)
            return <Table columns={columns} tableData={licenseClasses} />; 

        return <></>;
    }

    return (
        <div className={styles["dashboard-container"]}>
            <div className={styles["grids-container"]}>
                <div onClick={totalNumberOfPersons != -1 ? () => navigate("/app/persons"): null} className={styles["grid"]}>
                    {loading ? <PulseLoader color='#87cefa' />
                        :
                        totalNumberOfPersons != -1 &&
                        <>
                            <p>Total Persons</p>
                            <p>{totalNumberOfPersons}</p>
                        </>
                    }
                </div>
                <div onClick={totalNumberOfUsers != -1 ? () => navigate("/app/users"): null} className={styles["grid"]}>
                    {loading ? <PulseLoader color='#87cefa' />
                        :
                        totalNumberOfUsers != -1 &&
                        <>
                            <p>Total Users</p>
                            <p>{totalNumberOfUsers}</p>
                        </>
                    }

                </div>
                <div onClick={totalNumberOfLocalLicenseApplications != -1 ? () => navigate("/app/applications/manage-application"): null} className={`${styles["grid"]} ${styles["last-grid"]}`}>
                    {loading ? <PulseLoader color='#87cefa' />
                        :
                        totalNumberOfLocalLicenseApplications != -1 &&
                        <>
                            <p>Total Local License Applications</p>
                            <p>{totalNumberOfLocalLicenseApplications}</p>
                        </>
                    }
                </div>
            </div>

            <div   className={`table-container ${styles["license-classes-table-container"]} ${loading ? "table-container-loading" : ""}`}>
                {renderTableContent()}

            </div>

            
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </div>
    )
}

export default Dashboard;