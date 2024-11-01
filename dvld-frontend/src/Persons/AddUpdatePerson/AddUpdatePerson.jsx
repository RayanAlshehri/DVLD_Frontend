import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './AddUpdatePerson.module.css';
import { PulseLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import * as PersonsRequests from '../../APIRequests/PersonsRequests';
import * as CountriesRequests from '../../APIRequests/CountriesRequests';

Modal.setAppElement('#root');

const modalModes = {
    add: 0,
    update: 1,
};

function AddUpdatePerson({identifier= null, onRequestClose, onPersonAddition, onPersonUpdate}) {
    const mode = identifier == null ? modalModes.add : modalModes.update;
    let minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);

    const initialPersonState = {
        nationalNumber: '',
        countryID: 194,
        firstName: '',
        secondName: '',
        thirdName: '',
        lastName: '',
        gender: '',
        dateOfBirth: minDate,
        phone: '',
        email: '',
        address: '',
        image: null
    };

    const [loading, setLoading] = useState(true);
    const [person, setPerson] = useState(initialPersonState);
    const [fileSelectorValue, setFileSelectorValue] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [countries, setCountries] = useState([]);
    const [fetchErrorOccured, setFetchErrorOccured] = useState(false);
    const personId = useRef(-1);
    const oldNationalNumber = useRef(null);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const isAdded = useRef(false);
    const isUpdated = useRef(false);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const response = await CountriesRequests.getAllCountries();
                setCountries(response.data);
            } catch (error) {
                console.error(error);
                showMessageBox("Failed to fetch countries", "error");
                setFetchErrorOccured(true);
            }
        }
        fetchCountries();
    }, []);

    useEffect(() => {
        async function fetchPerson() {
            try {
                if (typeof identifier === 'number') {
                    const response = await PersonsRequests.getPersonById(identifier);
                    loadPersonInfoToVariables(response.data);
                } else if (typeof identifier === 'string') {
                    const response = await PersonsRequests.getPersonByNationalNumber(identifier);
                    loadPersonInfoToVariables(response.data);
                }
            } catch (error) {
                console.error(error);
                showMessageBox("Failed to fetch person information", "error");
                setFetchErrorOccured(true);
            }
            finally {
                setLoading(false);
            }
        }

        if (identifier != null) {
            fetchPerson();
        }
        else {
            setLoading(false);
        }
    }, []);

    function loadPersonInfoToVariables(personData) {
        setPerson({
            nationalNumber: personData.nationalNumber,
            countryID: personData.country.id,
            firstName: personData.firstName,
            secondName: personData.secondName,
            thirdName: personData.thirdName,
            lastName: personData.lastName,
            gender: personData.gender,
            dateOfBirth: new Date(personData.dateOfBirth),
            phone: personData.phone,
            email: personData.email,
            address: personData.address,
            image: null
        });

        if (personData.imageURL)
            setImageURL(`data:image/png;base64,${personData.imageURL}`);

        personId.current = personData.id;
        oldNationalNumber.current = personData.nationalNumber;
    }

    function clearForm() {
        setPerson(initialPersonState);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('firstName', person.firstName);
        formData.append('secondName', person.secondName);

        if (person.thirdName)
            formData.append('thirdName', person.thirdName);

        formData.append('lastName', person.lastName);
        formData.append('gender', person.gender);
        formData.append('dateOfBirth', person.dateOfBirth.toISOString());
        formData.append('nationalNumber', person.nationalNumber);
        formData.append('countryID', person.countryID);   
        formData.append('phone', person.phone);

        if (person.email)
            formData.append('email', person.email);

        formData.append('address', person.address);

        if (person.image)
            formData.append('image', person.image);

        
        try {
            if (mode === modalModes.add || (mode === modalModes.update && person.nationalNumber !== oldNationalNumber.current)) {
                const response = await PersonsRequests.doesPersonExistByNationalNumber(person.nationalNumber);
                if (response.data) {
                    showMessageBox("National number is for another person", "error");
                    return;
                }
            }
       
            if (mode === modalModes.add) {              
                const response = await PersonsRequests.addNewPerson(formData);
                onPersonAddition(response.data);
                showMessageBox("Person added successfully", "success");
                isAdded.current = true;
            } else {            
                formData.append('deleteImage', person.image == null);   
                await PersonsRequests.updatePerson(personId.current, formData);
                onPersonUpdate?.();
                showMessageBox("Person updated successfully", "success");
                isUpdated.current = true;
            }
        } catch (error) {
            console.error(error);
            showMessageBox(`Failed to ${mode === modalModes.add ? 'add' : 'update'} person`, "error");
        }
    };

    const handleClose = () => {
        clearForm();
        onRequestClose();

        if (isUpdated.current)
            onPersonUpdate();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerson((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGenderChange = (gender) => {
        setPerson((prev) => ({
            ...prev,
            gender,
        }));
    };

    const handleImageChange = (e) => {
        const image = e.target.files[0];

        setPerson((prev) => ({
            ...prev,
            image: image
        }));

        const reader = new FileReader();

        reader.onloadend = () => {
            setImageURL(reader.result);
        };

        reader.readAsDataURL(image);

        setFileSelectorValue(e.target.value);
    }

    const handleRemoveImageClick = (e) => {
        e.preventDefault();

        setPerson((prev) => ({
            ...prev,
            image: null
        }));

        setImageURL("");
        setFileSelectorValue("");
    }

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />
        }
        else if (!fetchErrorOccured) {
            return (
                <>
                    {mode === modalModes.add ? <h1>Add New Person</h1> : <h1>Update Person</h1>}
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className={styles['fields-container']}>
                            <div className={`${styles['field-container']} ${styles['left-field']}`}>
                                <label>National number <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="nationalNumber"
                                        value={person.nationalNumber}
                                        onChange={handleChange}
                                        maxLength="5"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['right-field']}`}>
                                <label>Nationality <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <select
                                        name="countryID"
                                        value={person.countryID}
                                        onChange={handleChange}
                                        className={styles['countries-select']}
                                    >
                                        {countries.map((country) => (
                                            <option key={country.countryID} value={country.countryID}>
                                                {country.countryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['left-field']}`}>
                                <label>First name <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={person.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['right-field']}`}>
                                <label>Second name <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="secondName"
                                        value={person.secondName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['left-field']}`}>
                                <label>Third name</label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="thirdName"
                                        value={person.thirdName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['right-field']}`}>
                                <label>Last name <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={person.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['left-field']}`}>
                                <label>Gender <span className={styles.required}>*</span></label>
                                <div className={`${styles['input-container']} ${styles['radio-buttons-container']}`}>
                                    <label>Male</label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={person.gender === 'M'}
                                        onChange={() => handleGenderChange('M')}
                                        required
                                        className={styles['input-radio']}
                                    />
                                    <label>Female</label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={person.gender === 'F'}
                                        onChange={() => handleGenderChange('F')}
                                        required
                                        className={styles['input-radio']}
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['right-field']}`}>
                                <label>Date of birth <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <DatePicker
                                        selected={person.dateOfBirth}
                                        onChange={(date) => setPerson((prev) => ({ ...prev, dateOfBirth: date }))}
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select your date of birth"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        className={styles['date-picker']}
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['left-field']}`}>
                                <label>Phone <span className={styles.required}>*</span></label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={person.phone}
                                        onChange={(e) => handleChange({ target: { name: 'phone', value: e.target.value.replace(/[^0-9]/g, '') } })}
                                        maxLength="10"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`${styles['field-container']} ${styles['right-field']}`}>
                                <label>Email</label>
                                <div className={styles['input-container']}>
                                    <input
                                        type="email"
                                        name="email"
                                        value={person.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className={styles['address-field']}>
                                <label>Address <span className={styles.required}>*</span></label>
                                <div className={`${styles['input-container']} ${styles['address-text-area-container']}`}>
                                    <textarea
                                        name="address"
                                        className={styles['address-text-area']}
                                        value={person.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles['file-selector-container']}>
                                <label>Photo</label>
                                <div className={styles['input-container']}>
                                    <input type="file" value={fileSelectorValue} onChange={handleImageChange} className={styles['input-file']} />
                                </div>                            
                            </div>
                            
                                <div className={styles["image-container"]}>
                                    {(person.gender || imageURL) &&
                                    <img src={
                                        imageURL ? imageURL
                                            : person.gender == 'M' ? '../../public/Images/Person_Male.png'
                                                : person.gender == 'F' ? '../../public/Images/Person_Female.png'
                                                    : ''} />
                                    }

                                </div>
                                
                            
                        </div>

                        {imageURL && <a href="#" onClick={handleRemoveImageClick} className={styles["remove-image"]}>Remove Image</a>}

                        <br />

                        <div className={styles['buttons-container']}>
                            <button type="button" onClick={handleClose} className="modal-button">
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
        <div>
            <Modal
                isOpen={true}
                onRequestClose={onRequestClose}
                className={`modal ${styles['add-update-person-modal']}`}
                overlayClassName="modal-overlay"
            >            
                {renderContent()}

                {messageBoxVisible && (
                    <MessageBox
                        message={messageBoxMessage.current}
                        messageType={messageBoxType.current}
                        onClose={handleMessageBoxClose}
                    />
                )}

                {(isAdded.current || isUpdated.current || fetchErrorOccured) && !messageBoxVisible && onRequestClose()}
            </Modal>
        </div>
    );
}

export default AddUpdatePerson;

