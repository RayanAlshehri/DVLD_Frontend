import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { getAppointment } from '../../APIRequests/TestsAppointmentsRequests';
import { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import { useUser } from '../../UserContext';
import styles from './TakeTest.module.css';
import { addNewTest } from '../../APIRequests/TakenTestsRequests';

function TakeTest({appointmentId, onTestTaken, onRequestClose}) {
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [notes, setNotes] = useState("");
    const [result, setResult] = useState(true);
    const { user } = useUser();
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getTestAppointment() {
            try {
                const response = await getAppointment(appointmentId);
                setAppointment(response.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch appointment", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getTestAppointment();

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const test = {
            appointmentID: appointmentId,
            result: result,
            notes: notes,
            createdByUserID: user.id
        }

        try {
            await addNewTest(test);
            showMessageBox("Test saved successfully", "success");
            onTestTaken?.();
        }
        catch(error) {
            showMessageBox("Failed to save test", "error");
            console.log(error);
        }
    }

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />
        }

        if (appointment) {
            return (
                <>
                    <p><b>Test: </b>{appointment.testTypeInfo.testName}</p>

                    <form onSubmit={handleSubmit}>
                        <div className={styles["radio-container"]}>
                            <label>Pass</label>
                            <input type="radio" name="Result" id="radioPass" onChange={() => setResult(true)} required />

                            <label>Fail</label>
                            <input type="radio" name="Result" id="radioFail" onChange={() => setResult(false)} required />
                        </div>

                        <label>Notes:</label>
                        <br />
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>

                        <br />

                        <div className={styles['buttons-container']}>
                            <button type="button" onClick={() => onRequestClose()} className="modal-button">
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
            onRequestClose={onRequestClose}
            className={`modal ${styles["take-test-modal"]}`}
            overlayClassName="modal-overlay"
        >
            <h1>Take Test</h1>

            {renderContent()}
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {!loading && !appointment && !messageBoxVisible && onRequestClose?.()}
        </Modal>
    )
}

export default TakeTest;