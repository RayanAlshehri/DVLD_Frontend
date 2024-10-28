import Modal from 'react-modal';
import MessageBox from '../MessageBox/MessageBox';
import useMessageBox from '../Global/MessageBox';
import { PulseLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import styles from './UpdateLicenseClass.module.css'
import { getLicenseClass, updateLicenseClass } from '../APIRequests/LicenseClassesRequests';

function UpdateLicenseClass({licenseClassId, onLicenseClassUpdate, onRequestClose}) {
    const [licenseClass, setLicenseClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getLicenseClassInfo() {
            try {
                const response = await getLicenseClass(licenseClassId);
                setLicenseClass(response.data);
            }
            catch(error) {
                console.log(error);
                showMessageBox("Error in fetching license class", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getLicenseClassInfo();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLicenseClass((prevService) => ({
            ...prevService,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateLicenseClass(licenseClassId, licenseClass);
            showMessageBox("License class updated successfully", "success");
            onLicenseClassUpdate?.();
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to update license class", "error");               
        }
    }


    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />;
        }

       
        if (licenseClass) {
            return (
                <>
                    <h1>Update License Class</h1>

                    <form action="submit" onSubmit={handleSubmit}>
                        <label>Class Name:</label>
                        <br />
                        <input type="text" name="name" value={licenseClass.name} onChange={handleInputChange} required />

                        <br />

                        <label>Description:</label>
                        <br />
                        <input type="text" name="description" value={licenseClass.description} onChange={handleInputChange} required />

                        <br />

                        <label>Minimum Age:</label>
                        <br />
                        <input type="number" name="minimumAge" value={licenseClass.minimumAge} onChange={handleInputChange} required />
                        <br />

                        <label>Validity Length:</label>
                        <br />
                        <input type="number" name="validityLength" value={licenseClass.validityLength} onChange={handleInputChange} required />
                        <br />

                        <label>Fee:</label>
                        <br />
                        <input type="number" name="fee" value={licenseClass.fee} onChange={handleInputChange} required />
                        <br />

                        <div className={styles["buttons-container"]}>
                            <button type="button" onClick={onRequestClose} className="modal-button">
                                <FontAwesomeIcon icon={faCircleXmark} className={`icon ${styles['close-icon']}`} />
                                Close
                            </button>
                            <button type="submit" className={`modal-button ${styles['save-button']}`}>
                                <FontAwesomeIcon icon={faFloppyDisk} className={`icon ${styles['save-icon']}`} />
                                Save
                            </button>
                        </div>
                    </form>
                </>
            )
        }
    }

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => onRequestClose()}
            className={`modal ${styles["update-license-class-modal"]}`}
            overlayClassName="modal-overlay"
        >
            {renderContent()}

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {!loading && !licenseClass && !messageBoxVisible && onRequestClose()}
        </Modal>
    )
}

export default UpdateLicenseClass;