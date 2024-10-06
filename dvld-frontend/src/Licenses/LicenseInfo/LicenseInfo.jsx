import { useEffect, useState } from "react";
import { getLicenseByLicenseId } from "../../APIRequests/LicensesRequests";
import { formatDateToDMY } from "../../Global/Util";
import { PulseLoader } from 'react-spinners';
import styles from "./LicenseInfo.module.css";

function LicenseInfo({licenseId, onFetchError}) {
    const [loading, setLoading] = useState(true);
    const [license, setLicense] = useState(null);

    useEffect(() => {
        async function getLicense() {
            try {
                const response = await getLicenseByLicenseId(licenseId);
                setLicense(response.data);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        getLicense();
    }, [])

    function renderContent() {
        const emptyState = (
            <>
                <div className={styles["left-p"]}>
                    <p><b>License ID:</b></p>
                    <p><b>Driver ID:</b></p>
                    <p><b>National Number:</b></p>
                    <p><b>Full Name:</b></p>
                    <p><b>Date of Birth:</b></p>
                    <p><b>Gender:</b></p>
                </div>
                <div className={styles["right-p"]}>
                    <p><b>License Class:</b></p>
                    <p><b>Issue Reason:</b></p>
                    <p><b>Issue Date:</b></p>
                    <p><b>Expiry Date:</b></p>
                    <p><b>Status:</b></p>
                    <p><b>Constraints:</b></p>
                </div>
            </>
        )

        if (!licenseId)
            return emptyState;


        if (loading)
            return <PulseLoader color='#87cefa' />;


        if (license) {
            return (
                <>
                    <div className={styles["left-p"]}>
                        <p><b>License ID: </b>{license.id}</p>
                        <p><b>Driver ID: </b>{license.driver.id}</p>
                        <p><b>Driver ID: </b>{license.driver.person.nationalNumber}</p>
                        <p><b>Full Name: </b>{license.driver.person.fullName}</p>
                        <p><b>Date of Birth: </b>{formatDateToDMY(license.driver.person.dateOfBirth)}</p>
                        <p><b>Gender: </b>{license.driver.person.gender == 'M' ? "Male" : "Female"}</p>
                    </div>
                    <div className={styles["right-p"]}>
                        <p><b>License Class: </b>{license.classInfo.name}</p>
                        <p><b>Issue Reason: </b>{license.issueReasonString}</p>
                        <p><b>Issue Date: </b>{formatDateToDMY(license.issueDate)}</p>
                        <p><b>Expiry Date: </b>{formatDateToDMY(license.expiryDate)}</p>
                        <p><b>Status: </b>{license.licenseStatusString}</p>
                        <p><b>Constraints: </b>{license.constraintsString}</p>
                    </div>
                </>
            )
        }

        return emptyState;
    }

    return (
        <div className={styles["license-info-container"]}>
            {renderContent()}
            {licenseId && !loading && !license && onFetchError?.()}
        </div>
    )
}

export default LicenseInfo;