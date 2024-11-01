import { getLicenseByLicenseId, renewLicense } from '../../APIRequests/LicensesRequests';
import { PulseLoader } from 'react-spinners';
import FindLicense from '../../Licenses/FindLicense/FindLicense'
import MessageBox from '../../MessageBox/MessageBox'; 
import useMessageBox from '../../Global/MessageBox';
import { useEffect, useRef, useState } from 'react';
import { getService } from '../../APIRequests/ServicesRequests';
import { enServices } from '../../Global/GlobalVariables';
import { useUser } from '../../UserContext';
import LicenseInfoModal from '../../Licenses/LicenseInfoModal/LicenseInfoModal'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './RenewLicense.module.css'

const modes = {
    new: 0,
    renewed: 1
  };

function RenewLicense() {
    const {expiredLicenseId, renewedLicenseId } = useParams();
    const mode = renewedLicenseId ? modes.renewed : modes.new;
    const [loading, setLoading] = useState(true);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [serviceFee, setServiceFee] = useState("");
    const [enableRenew, setEnableRenew] = useState(false);
    const [licenseInfoVisible, setLicenseInfoVisible] = useState(false);
    const [licenseRenewed, setLicenseRenewed] = useState(false);
    const oldLicenseId = useRef(0);
    const newLicenseId = useRef(0);
    const { user } = useUser();
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const navigate = useNavigate();

    useEffect(() => {
        async function getServiceFee() {
            try {
                const response = await getService(enServices.licenseRenewal);
                setServiceFee(response.data.fee);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch service fee", "error");
                setFetchFailed(true);
            }
            finally {
                setLoading(false);
            }
        }

        getServiceFee();
    }, [])

    const handleLicenseFound = async (foundLicenseId) => {
        let license;
        try {
            const response = await getLicenseByLicenseId(foundLicenseId);
            license = response.data;
        }
        catch (error) {
            showMessageBox("Failed to fetch license", "error");
            return;
        }

        if (!license.isActive) {
            showMessageBox("This license is not active", "error");
            return;
        }

        if (new Date(license.expiryDate) > new Date()) {
            showMessageBox("This license is not expired", "error");
            return;
        }

        setEnableRenew(true);
        oldLicenseId.current = license.id;
    }

    const handleRenewClick = async () => {
        try {
            const response = await renewLicense(oldLicenseId.current, user.id);
            showMessageBox("License renewed successfully", "success");
            newLicenseId.current = response.data.id;
            setLicenseRenewed(true);
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to renew license", "error");
        }
    }

    const handleViewNewLicenseClick = (e) => {
        e.preventDefault();
        setLicenseInfoVisible(true);
    }

    if (loading)
        return <PulseLoader color='#87cefa' />;

    return (
        <>
            {licenseRenewed && !messageBoxVisible && navigate(`/app/applications/renew/${oldLicenseId.current}/${newLicenseId.current}`)}

            <h1>Renew License</h1>

            <div>
                <FindLicense findDirectlyLicenseId={mode == modes.renewed ? expiredLicenseId : 0} findEnabled={mode == modes.new} onLicenseFound={mode == modes.new ? (foundLicenseId) => handleLicenseFound(foundLicenseId) : null} />

                <div className={styles["fee-button-container"]}>
                    <label>Fee: {serviceFee}</label>

                    {mode == modes.new
                        ? <button onClick={handleRenewClick} className={`main-page-button  ${styles["renew-button"]}`} disabled={!enableRenew || fetchFailed}>Renew</button>
                        : <button onClick={() => navigate("/app/applications/renew")} className={`main-page-button  ${styles["renew-button"]}`}>Renew Another License</button>}
                    
                    <a href="javascript:void(0)" onClick={handleViewNewLicenseClick} className={mode == modes.new ? styles["disabled-link"] : styles["enabled-link"]}>View New License</a>
                </div>
            </div>

            {licenseInfoVisible && <LicenseInfoModal licenseId={renewedLicenseId} onRequestClose={() => setLicenseInfoVisible(false)} />}
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </>
    )
}

export default RenewLicense;