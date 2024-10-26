import Modal from 'react-modal';
import MessageBox from '../MessageBox/MessageBox';
import useMessageBox from '../Global/MessageBox';
import { PulseLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { getService, updateService } from '../APIRequests/ServicesRequests';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './UpdateService.module.css'

function UpdateService({serviceId, onServiceUpdate, onRequestClose}) {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getServiceInfo() {
            try {
                const response = await getService(serviceId);
                setService(response.data);
            }
            catch(error) {
                console.log(error);
                showMessageBox("Error in fetching service", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getServiceInfo();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setService((prevService) => ({
            ...prevService,
            [name]: value,
        }));
    };

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />;
        }

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                await updateService(serviceId, service);
                showMessageBox("Service updated successfully", "success");
                onServiceUpdate();
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to update service", "error");               
            }
        }

        if (service) {
            return (
                <>
                    <h1>Update Service</h1>

                    <form action="submit" onSubmit={handleSubmit}>
                        <label>Service Name:</label>
                        <br />
                        <input type="text" name="serviceName" value={service.serviceName} onChange={handleInputChange} required />

                        <br />

                        <label>Fee:</label>
                        <br />
                        <input type="number" name="fee" value={service.fee} onChange={handleInputChange} required />
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
            className={`modal ${styles["update-service-modal"]}`}
            overlayClassName="modal-overlay"
        >
            {renderContent()}

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {!loading && !service && !messageBoxVisible && onRequestClose()}
        </Modal>
    )
}

export default UpdateService;