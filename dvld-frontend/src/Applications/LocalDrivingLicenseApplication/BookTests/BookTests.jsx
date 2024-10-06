import { useEffect, useRef, useState } from "react";
import { PulseLoader } from 'react-spinners';
import { getLastAppointment } from "../../../APIRequests/TestsAppointmentsRequests";
import { enTestTypes } from "../../../Global/GlobalVariables";
import styles from './BookTests.module.css';
import BookAppointment from "../../BookAppointment/BookAppointment";
import { getTestByAppointmentID } from "../../../APIRequests/TakenTestsRequests";
import { formatDateToDMYHM } from '../../../Global/Util';
import TakeTest from "../../TakeTest/TakeTest";


function BookTests({localLicenseApplicationId, onAllTestsPassed}) {

    const initialValues = {
        medical: null,
        theory: null,
        practical: null,
    }
    const [appointmentsLoading, setAppointmentsLoading] = useState(true);
    const [takenTestsLoading, setTakenTestsLoading] = useState(true);
    const [appointments, setAppointments] = useState(initialValues);
    const [takenTests, setTakenTests] = useState(initialValues);
    const [bookAppointmentVisible, setBookAppointmentVisible] = useState(false);
    const [testBooked, setTestBooked] = useState(false);
    const [takeTestVisible, setTakeTestVisible] = useState(false);
    const [testTaken, setTestTaken] = useState(false);
    const clickedBtnTestType = useRef(null);
    const clickedBtnAppointmentId = useRef(0);
    const isRetake = useRef(false);

    async function getAppointments() {
        const fetchedAppointments = { ...appointments };

        try {
            let response = await getLastAppointment(localLicenseApplicationId, enTestTypes.medical);
            fetchedAppointments.medical = response.data;

            response = await getLastAppointment(localLicenseApplicationId, enTestTypes.theory);
            fetchedAppointments.theory = response.data;

            response = await getLastAppointment(localLicenseApplicationId, enTestTypes.practical);
            fetchedAppointments.practical = response.data;             
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setAppointments(fetchedAppointments);
            setAppointmentsLoading(false);
            setTestBooked(false);
            setTestTaken(false);
        }
    }

    useEffect(() => {
        getAppointments();
    }, [])

    useEffect(() => {
        if (testBooked || testTaken) {
            getAppointments();        
        }
    },)

    useEffect(() => {
        async function getTakenTests() {
            const fetchedTakenTests = { ...takenTests };

            try {
                if (appointments.medical) {
                    fetchedTakenTests.medical = (await getTestByAppointmentID(appointments.medical.id)).data;
                }

                if (appointments.theory)
                    fetchedTakenTests.theory = (await getTestByAppointmentID(appointments.theory.id)).data;

                if (appointments.practical)
                    fetchedTakenTests.practical = (await getTestByAppointmentID(appointments.practical.id)).data;


            }
            catch (error) {
                console.log(error);
            }
            finally {
                setTakenTests(fetchedTakenTests);
                setTakenTestsLoading(false);
            }
        }

        if (appointments.medical || appointments.theory || appointments.practical)
            getTakenTests();

    }, [appointments.medical, appointments.theory, appointments.practical])


    function renderAppointmentInfo(appointment, testType) {

        if (appointmentsLoading && takenTestsLoading)
            return <PulseLoader color='#87cefa' />;

        if (!appointment) {
            switch (testType) {
                case enTestTypes.medical:
                    isRetake.current = false;
                    return (
                        <>
                            <p>No test booked or taken</p>
                            <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.medical }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                        </>
                    )

                case enTestTypes.theory:
                    if (!appointments.medical || !appointments.medical.isTaken || !takenTests.medical || !takenTests.medical.result)
                        return (
                            <>
                                <p>No test booked or taken</p>
                            </>
                        )
                    else
                        isRetake.current = false;
                    return (
                        <>
                            <p>No test booked or taken</p>
                            <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.theory }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                        </>
                    )
                case enTestTypes.practical:
                    if (!appointments.theory || !appointments.theory.isTaken || !takenTests.theory || !takenTests.theory.result)
                        return (
                            <>
                                <p>No test booked or taken</p>
                            </>
                        )
                    else
                        isRetake.current = false;

                    return (
                        <>
                            <p>No test booked or taken</p>
                            <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.practical }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                        </>
                    )
            }

        }

        if (!appointment.isTaken) {
            return (
                <>
                    <p>Scheduled at {formatDateToDMYHM(appointment.testDate)}</p>
                    {appointment.testTypeInfo.type != enTestTypes.theory && <button onClick={() => { setTakeTestVisible(true); clickedBtnAppointmentId.current = appointment.id }} className={`main-page-button ${styles["appointment-button"]}`}>Take Test</button>}
                </>
            )
        }

        switch (appointment) {
            case appointments.medical:
                if (takenTests.medical) {
                    if (takenTests.medical.result) {
                        return (
                            <p>Passed at {formatDateToDMYHM(appointment.testDate)}</p>
                        )
                    }
                    else {
                        isRetake.current = true;

                        return (
                            <>
                                <p>Failed at {formatDateToDMYHM(appointment.testDate)}</p>
                                <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.medical }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                            </>
                        )
                    }

                }
                break;

            case appointments.theory:
                if (takenTests.theory) {
                    if (takenTests.theory.result) {
                        return (
                            <p>Passed at {formatDateToDMYHM(appointment.testDate)}</p>
                        )
                    }
                    else {
                        isRetake.current = true;

                        return (
                            <>
                                <p>Failed at {formatDateToDMYHM(appointment.testDate)}</p>
                                <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.theory }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                            </>
                        )
                    }

                }
                break;

            case appointments.practical:
                if (takenTests.practical) {
                    if (takenTests.practical.result) {
                        onAllTestsPassed?.();
                        return (
                            <p>Passed at {formatDateToDMYHM(appointment.testDate)}</p>
                        )
                    }
                    else {
                        isRetake.current = true;

                        return (
                            <>
                                <p>Failed at {formatDateToDMYHM(appointment.testDate)}</p>
                                <button onClick={() => { setBookAppointmentVisible(true); clickedBtnTestType.current = enTestTypes.practical }} className={`main-page-button ${styles["appointment-button"]}`}>Book</button>
                            </>
                        )
                    }

                }
                break;
        }
    }

    return (
        <div className={styles["appointments-container"]}>
            <h2>Medical Test:</h2>
            <div className={styles["appointment-info-container"]}>
                {appointments && renderAppointmentInfo(appointments.medical, enTestTypes.medical)}
            </div>

            <h2>Theory Test:</h2>
            <div className={styles["appointment-info-container"]}>
                {appointments && renderAppointmentInfo(appointments.theory, enTestTypes.theory)}
            </div>
            
            <h2>Practical Test:</h2>
            <div className={styles["appointment-info-container"]}>
                {appointments && renderAppointmentInfo(appointments.practical, enTestTypes.practical)}
            </div>

            {bookAppointmentVisible && 
            <BookAppointment 
            localLicenseApplicationId={localLicenseApplicationId} 
            testType={clickedBtnTestType.current} 
            isRetake={isRetake.current} 
            onAppointmentBooked={() => setTestBooked(true)}
            onRequestClose={() => setBookAppointmentVisible(false)} />}
            {takeTestVisible && <TakeTest appointmentId={clickedBtnAppointmentId.current} onTestTaken={() => setTestTaken(true)} onRequestClose={() => setTakeTestVisible(false)} />}
        </div>
    )
}

export default BookTests;