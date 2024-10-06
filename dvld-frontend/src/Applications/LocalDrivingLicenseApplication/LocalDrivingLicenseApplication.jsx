import { useEffect, useRef, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './LocalDrivingLicenseApplication.module.css'
import FindPerson from '../../Persons/FindPerson/FindPerson'
import PersonInfo from '../../Persons/PersonInfo/PersonInfo';
import { getAllLicenseClasses } from '../../APIRequests/LicenseClassesRequests';
import { enLicenseClasses, enServices, enTestTypes } from '../../Global/GlobalVariables';
import { getService } from '../../APIRequests/ServicesRequests';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import { addNewApplication, getApplicationByLocalLicesneApplicationId } from '../../APIRequests/LocalLicenseApplicationsRequests';
import { useUser } from '../../UserContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import BookTests from './BookTests/BookTests.jsx';
import { getLastAppointment } from '../../APIRequests/TestsAppointmentsRequests.js';
import { getTestByAppointmentID } from '../../APIRequests/TakenTestsRequests.js';
import IssueLicense from './IssueLicense/IssueLicense.jsx';

const modes = {
  add: 0,
  update: 1
};

function LocalDrivingLicenseApplication({ onApplicationCreated }) {
  const { localLicenseApplicationId } = useParams();
  const mode = localLicenseApplicationId ? modes.update : modes.add;
  const [application, setApplication] = useState(null);
  const [selectedTab, setSelectedTab] = useState("application");
  const [licenseClasses, setLicenseClasses] = useState([]);
  const [selectedLicenseClass, setSelectedLicenseClass] = useState('');
  const [serviceFee, setServiceFee] = useState(0);
  const [createBtnEnabled, setCreateBtnEnabled] = useState(false);
  const [applicationCreated, setApplicationCreated] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);
  const applicantPersonId = useRef(-1);
  const newApplicationId = useRef(0);
  const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function getLastPracticalTest() {
      try {
        const appointmentResponse = await getLastAppointment(localLicenseApplicationId, enTestTypes.practical);

        if (appointmentResponse.data.isTaken) {
          const takenTestResponse = await getTestByAppointmentID(appointmentResponse.data.id);
          setAllTestsPassed(takenTestResponse.data.result);
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    getLastPracticalTest();
  }, [])

  useEffect(() => {
    async function getLicenseClasses() {
      try {
        const response = await getAllLicenseClasses();
        setLicenseClasses(response.data);
        setSelectedLicenseClass(response.data[enLicenseClasses.normal].name);
      }
      catch (error) {
        console.log(error);
      }
    }

    getLicenseClasses();
  }, [])

  useEffect(() => {
    async function getServiceFee() {
      try {
        const response = await getService(enServices.issueDrivingLicenseForTheFirstTime);
        setServiceFee(response.data.fee);
      }
      catch (error) {
        console.log(error);
      }
    }

    if (mode == modes.add)
      getServiceFee();

  }, [])

  useEffect(() => {
    async function getApplication() {
      try {
        const response = await getApplicationByLocalLicesneApplicationId(localLicenseApplicationId);
        setApplication(response.data);
        loadApplicationInfo(response.data);
      }
      catch (error) {
        console.log(error);
      }
    }

    if (mode == modes.update) {
      getApplication();
    }
  }, [])

  function loadApplicationInfo(application) {
    setSelectedLicenseClass(application.licenseClassInfo.name);
    setServiceFee(application.paidFee);
  }

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
  };


  const handleCreateClick = async () => {
    const application = {
      applicantPersonID: applicantPersonId.current,
      paidFee: serviceFee,
      licenseClassID: licenseClasses.find(c => c.name == selectedLicenseClass).class,
      createdByUserID: user.id
    };

    try {
      const response = await addNewApplication(application);

      showMessageBox("Application created successfully with ID " + response.data, "success");
      setApplicationCreated(true);
      newApplicationId.current = response.data;
    }
    catch (error) {
      console.log(error);
      showMessageBox(error.response.data, "error");
    }
  }

  function renderContent() {
    switch (selectedTab) {

      case "application":
        return (
          <div className={styles["application-tab-content"]}>
            <div className={styles["person-container"]}>
              {mode == modes.add ?
                <FindPerson findEnabled={mode == modes.add} onPersonFound={(foundPersonID) => { applicantPersonId.current = foundPersonID; setCreateBtnEnabled(true) }} />
                :
                application ?
                  <>
                    <h2>Person Information:</h2>
                    <PersonInfo identifier={application.applicantPerson.id} />
                  </>
                  :
                  <></>
              }
            </div>

            <label className={styles["application-tab-label"]}>Class:</label>
            <select value={selectedLicenseClass} onChange={(e) => { setSelectedLicenseClass(e.target.value) }} disabled={mode == modes.update}>
              {licenseClasses && licenseClasses.map(l => (
                <option>{l.name}</option>
              ))}
            </select>

            <br />

            <label className={styles["application-tab-label"]}>{mode == modes.add ? "Fee: " : "Paid fee: "} {serviceFee}</label>

            {mode == modes.add && <button onClick={handleCreateClick} className={`main-page-button ${styles["create-button"]}`} disabled={!createBtnEnabled}>Create</button>}
          </div>
        )

      case "tests":
        return (
          <BookTests localLicenseApplicationId={localLicenseApplicationId} onAllTestsPassed={() => setAllTestsPassed(true)} />
        )

      case "license":
        return (
          <IssueLicense localLicenseApplicationId={localLicenseApplicationId} />
        )
    }
  }

  return (
    <>
      {!messageBoxVisible && applicationCreated && navigate(`/app/local-license-application/${newApplicationId.current}`)}

      <div className={styles["driving-license-application-container"]}>
        <h1>Driving License Application</h1>
        <div className={styles["tabs-container"]}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="application" label="Create Application" className={styles["tab"]} />
            <Tab value="tests" label="Book Tests" className={styles["tab"]} disabled={mode == modes.add} />
            <Tab value="license" label="Issue License" disabled={!allTestsPassed} />
          </Tabs>
        </div>

        <div className={styles["tab-content-container"]}>
          {renderContent()}
        </div>

        {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
      </div>
    </>
  );
}

export default LocalDrivingLicenseApplication;