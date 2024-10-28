import Modal from 'react-modal';
import MessageBox from '../MessageBox/MessageBox';
import useMessageBox from '../Global/MessageBox';
import { PulseLoader } from 'react-spinners';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import styles from './UpdateTestType.module.css'
import { getTestType, updateTestType } from '../APIRequests/TestTypesRequests';

function UpdateTestType({testTypeId, onTestTypeUpdate, onRequestClose}) {
    const [testType, setTestType] = useState(null);
    const [loading, setLoading] = useState(true);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getTestTypeInfo() {
            try {
                const response = await getTestType(testTypeId);
                setTestType(response.data);
            }
            catch(error) {
                console.log(error);
                showMessageBox("Error in fetching test type", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getTestTypeInfo();
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTestType((prevService) => ({
            ...prevService,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateTestType(testTypeId, testType);
            showMessageBox("Test type updated successfully", "success");
            onTestTypeUpdate?.();
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to update test type", "error");               
        }
    }


    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />;
        }

       
        if (testType) {
            return (
                <>
                    <h1>Update Test Type</h1>

                    <form action="submit" onSubmit={handleSubmit}>
                        <label>Test Name:</label>
                        <br />
                        <input type="text" name="testName" value={testType.testName} onChange={handleInputChange} required />

                        <br />

                        <label>Fee:</label>
                        <br />
                        <input type="number" name="fee" value={testType.fee} onChange={handleInputChange} required />
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
            className={`modal ${styles["update-test-type-modal"]}`}
            overlayClassName="modal-overlay"
        >
            {renderContent()}

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {!loading && !testType && !messageBoxVisible && onRequestClose()}
        </Modal>
    )
}

export default UpdateTestType;