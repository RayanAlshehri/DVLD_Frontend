import { useEffect, useState } from "react";
import { getApplicationByLocalLicesneApplicationId, issueLicense } from "../../../APIRequests/LocalLicenseApplicationsRequests";
import { PulseLoader } from 'react-spinners';
import MessageBox from '../../../MessageBox/MessageBox';
import useMessageBox from '../../../Global/MessageBox';
import { formatDateToDMYHM } from "../../../Global/Util";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import {useUser} from '../../../UserContext';
import styles from './IssueLicense.module.css';
import { getLicenseByApplicationId } from "../../../APIRequests/LicensesRequests";
import LicenseInfoModal from "../../../Licenses/LicenseInfoModal/LicenseInfoModal";


function IssueLicense({localLicenseApplicationId}) {
    const constraintsCheckedInitialValues = {
        autoCars: false,
        prostheticLimb: false,
        visionLenses: false,
        dayHours: false,
        handicapedCars: false,
    }

    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);
    const [constraintsChecked, setConstraintsChecked] = useState(constraintsCheckedInitialValues);
    const [issuedLicenseId, setIssuedLicenseId] = useState(0);
    const [licenseInfoVisible, setLicenseInfoVisible] = useState(false);
    const [paidLicenseClassFee, setPaidLicenseClassFee] = useState("");
    const {user} = useUser();
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    console.log(paidLicenseClassFee);

    useEffect(() => {
        async function getApplication() {
            try {
                const applicationResponse = await getApplicationByLocalLicesneApplicationId(localLicenseApplicationId);
                setApplication(applicationResponse.data);

                if (applicationResponse.data.status != 2)
                    return;

                const licenseResponse = await getLicenseByApplicationId(applicationResponse.data.applicationID);

                setIssuedLicenseId(licenseResponse.data.id);
                setPaidLicenseClassFee(licenseResponse.data.paidFee);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Error in fetching date", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getApplication();
    }, [])

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />
        }

        if (application) {
            return (
                <>
                    <div className={styles["left-p"]}>
                        <p><b>Application Number: </b>{application.localLicenseApplicationID}</p>
                        <p><b>Applicant National Number: </b>{application.applicantPerson.nationalNumber}</p>
                        <p><b>Applicant Full Name: </b>{application.applicantPerson.fullName}</p>
                    </div>
                    <div className={styles["right-p"]}>
                        <p><b>License Class: </b>{application.licenseClassInfo.name}</p>
                        <p><b>Paid Fee: </b>{application.paidFee}</p>
                        <p><b>Application Date: </b>{formatDateToDMYHM(application.applicationDate)}</p>
                    </div>
                </>
            )
        }
    }

    const handleConstraintCheckChange = (e) => {
        setConstraintsChecked(prev => ({...prev, 
            [e.target.id]: e.target.checked}))
    }

    function calculateConstraints() {
        let constraints = 0;

        if (constraintsChecked.autoCars)
            constraints += 1;

        if (constraintsChecked.prostheticLimb)
            constraints += 2;

        if (constraintsChecked.visionLenses)
            constraints += 4;

        if (constraintsChecked.dayHours)
            constraints += 8;

        if (constraintsChecked.handicapedCars)
            constraints += 16;

        return constraints;
    }

    const handleIssueLicenseClick = async () => {
        const licenseInfo = {
            applicationID: application.applicationID,
            constraints: calculateConstraints(),
            createdByUserID: user.id
        }

        try {
            const response = await issueLicense(licenseInfo);
            showMessageBox("License issued successfully", "success");
            setIssuedLicenseId(response.data);
        } 
        catch (error) {
            showMessageBox("Failed to issue license", "error");
            console.log(error);
        }
    }

    const handleViewIssuedLicenseClick = (e) => {
        e.preventDefault();
        setLicenseInfoVisible(true);
    }

    return (
        <div className={styles["issue-license-container"]}>
            <h2>Application Summary:</h2>
            <div className={styles["application-sum-container"]}>
                {renderContent()}
            </div>
            {application && (
                <>
                    {issuedLicenseId == 0 &&
                        <>
                            <h2>Constraints:</h2>

                            <div className={styles["constraints-container"]}>
                                <input type="checkbox" id="autoCars" checked={constraintsChecked.autoCars} onChange={handleConstraintCheckChange} />
                                <label htmlFor="autoCars">Auto Cars</label>

                                <input type="checkbox" id="prostheticLimb" checked={constraintsChecked.prostheticLimb} onChange={handleConstraintCheckChange} />
                                <label htmlFor="prostheticLimb">Prosthetic Limb</label>

                                <input type="checkbox" id="visionLenses" checked={constraintsChecked.visionLenses} onChange={handleConstraintCheckChange} />
                                <label htmlFor="visionLenses">Vision Lenses</label>

                                <input type="checkbox" id="dayHours" checked={constraintsChecked.dayHours} onChange={handleConstraintCheckChange} />
                                <label htmlFor="dayHours">Day Hours</label>

                                <input type="checkbox" id="handicapedCars" checked={constraintsChecked.handicapedCars} onChange={handleConstraintCheckChange} />
                                <label htmlFor="handicapedCars">Handicaped Cars</label>
                            </div>
                        </>
                    }

                    {issuedLicenseId == 0
                        ? <p className={styles["license-class-fee"]}><b>License Class Fee: </b>{application.licenseClassInfo.fee}</p>
                        : <p className={styles["license-class-fee"]}><b>Paid License Class Fee: </b>{paidLicenseClassFee}</p>
                    }


                    {issuedLicenseId == 0 &&
                        <button onClick={handleIssueLicenseClick} className={`main-page-button ${styles["issue-license-button"]}`}>
                            <FontAwesomeIcon icon={faIdCard} className={styles["button-icon"]} />
                            Issue License
                        </button>
                    }           

                    <a href="javascript:void(0)" onClick={handleViewIssuedLicenseClick} className={issuedLicenseId == 0 ? styles["disabled-link"] : styles["enabled-link"]}>View Issued License</a>
                </>
            )}

            {licenseInfoVisible && <LicenseInfoModal licenseId={issuedLicenseId} onRequestClose={() => setLicenseInfoVisible(false)} />}

            {messageBoxVisible && (
                <MessageBox
                    message={messageBoxMessage.current}
                    messageType={messageBoxType.current}
                    onClose={handleMessageBoxClose}
                />
            )}
        </div>
    )
}

export default IssueLicense;