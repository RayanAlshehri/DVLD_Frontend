import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getApplicationByLocalLicesneApplicationId } from '../../APIRequests/LocalLicenseApplicationsRequests';
import {getTestType} from '../../APIRequests/TestTypesRequests';
import {getService} from '../../APIRequests/ServicesRequests'
import { enServices, enTestTypes } from '../../Global/GlobalVariables';
import { PulseLoader } from 'react-spinners';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import styles from './BookAppointment.module.css';
import { addNewAppointment, bookRetake } from '../../APIRequests/TestsAppointmentsRequests';
import {useUser} from '../../UserContext';

function BookAppointment({localLicenseApplicationId ,testType, isRetake, onAppointmentBooked, onRequestClose}) {
    const [application, setApplication] = useState(null);
    const [fee, setFee] = useState(0);
    const [appointmentDate, setAppointmentDate] = useState(dayjs());
    const [fetchErrorOccured, setFetchErrorOccured] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const {user} = useUser();

    useEffect(() => {
        async function getApplication() {
            try {
            const response = await getApplicationByLocalLicesneApplicationId(localLicenseApplicationId);
            setApplication(response.data);
            }
            catch (error) {
                console.log(error);
                setFetchErrorOccured(true);
                showMessageBox("Failed to fetch application", "error");
            }
        }

        async function getTestTypeFee() {
            try {
                setFee((await getTestType(testType)).data.fee);
            }
            catch (error) {
                console.log(error);
                setFetchErrorOccured(true);
                showMessageBox("Failed to fetch data", "error");
            }
        }

        async function getRetakeTestFee() {
            try {
                setFee((await getService(enServices.retakeTest)).data.fee);
            }
            catch (error) {
                console.log(error);
                setFetchErrorOccured(true);
                showMessageBox("Failed to fetch data", "error");
            }
        }

        getApplication();

        if (isRetake)
            getRetakeTestFee();
        else
            getTestTypeFee();
    }, [])

    function getTestTypeText() {
        switch (testType) {
            case enTestTypes.medical:
                return "Medical";

            case enTestTypes.theory:
                return "Theory";

            case enTestTypes.practical:
                return "Practical";
        }
    }

    function renderContent() {
        if (!application || !fee) {
            return <PulseLoader color='#87cefa' />;
        }

        return (
            <>
                <h1>Book Appointment</h1>

                <p><b>Test:</b> {getTestTypeText()}</p>
                {isRetake ? <p className={styles["fee"]}><b>Retake test fee:</b> {fee}</p> : <p className={styles["fee"]}><b>Fee:</b> {fee}</p>}
            </>
        )
    }

    const handleSaveClick = async () => {
        const appointment = {
            testTypeID: testType,
            personID: application.applicantPerson.id,
            localLicenseApplicationID: localLicenseApplicationId,
            paidFee: fee,
            testDate: appointmentDate.format('YYYY-MM-DDTHH:mm:ss'),
            createdByUserID: user.id,
        }

        try {
            let appointmentId = 0;

            if (!isRetake)
                appointmentId = (await addNewAppointment(appointment)).data;
            else
                appointmentId = (await bookRetake(appointment)).data;

                showMessageBox("Appointment booked successfully", "success");
                onAppointmentBooked?.();
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to book appointment", "error");
        }
    }
    
    return (
        <Modal
        isOpen={true} 
        className={`modal ${styles["book-appointment-modal"]}`}
        onRequestClose={() => onRequestClose?.()}
        overlayClassName="modal-overlay"
        >
            {renderContent()}

            <label htmlFor="appointmentDate">Appointment Date:</label>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker defaultValue={appointmentDate} disablePast onChange={(dateTime) => setAppointmentDate(dateTime)}  className={styles["date-time-picker"]}/>
            </LocalizationProvider>

            <br />

            <div className={styles['buttons-container']}>
                <button type="button" onClick={() => onRequestClose?.()} className="modal-button">
                    <FontAwesomeIcon icon={faCircleXmark} className={`icon ${styles['close-icon']}`} />
                    Close
                </button>
                <button type="submit" onClick={() => handleSaveClick()} className={`modal-button ${styles['save-button']}`}>
                    <FontAwesomeIcon icon={faFloppyDisk} className={`icon ${styles['save-icon']}`} />
                    Save
                </button>
            </div>
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {fetchErrorOccured && !messageBoxVisible && onRequestClose?.()}
        </Modal>
    )
}

export default BookAppointment;