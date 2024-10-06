import {useState, useEffect } from 'react';
import Modal from 'react-modal';
import {doesUserExistByUsername, getUserByUsernameAndPassword, updatePassword} from '../../APIRequests/UsersRequests';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import { PulseLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import InlineError from '../../InlineError/InlineError';
import styles from './UpdatePassword.module.css'

function UpdatePassword({username, onRequestClose}) {
    console.log("Username: " + username)
    const [loading, setLoading] = useState(true);
    const [errorOccured, setErrorOccured] = useState(false);
    const [oldPasswordErrorVisible, setOldPasswordErrorVisible] = useState(false);
    const [newPasswordErrorVisible, setNewPasswordErrorVisible] = useState(false);
    const [confirmPasswordErrorVisible, setConfirmPasswordErrorVisible] = useState(false);
    const [usernameExists, setUsernameExists] = useState(false);
    const [user, setUser] = useState(null);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const inputsInitialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
    const [inputsValues, setInputsValues] = useState(inputsInitialValues);

    useEffect(() => {
        async function verifyUsername() {
            try {
                const response = await doesUserExistByUsername(username);
                
                if (response.data) {
                    setUsernameExists(true);
                }
            }
            catch (error) {
                console.log(error);
                showMessageBox("Error in fetching user", "error");
                setErrorOccured(true);
            }
            finally {
                setLoading(false);
            }
        }

        verifyUsername();
    }, [])

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setInputsValues((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOldPasswordInputBlur = async () => {
        try {
            const response = await getUserByUsernameAndPassword(username, inputsValues.oldPassword);
            setUser(response.data);
            
            if (oldPasswordErrorVisible)
                setOldPasswordErrorVisible(false);
        }
        catch(error) {
            setOldPasswordErrorVisible(true);
        }
    }

    const handleNewPasswordBlur = () => {
        if (inputsValues.newPassword == inputsValues.oldPassword) {
            setNewPasswordErrorVisible(true);
        }
        else {
            if (newPasswordErrorVisible)
                setNewPasswordErrorVisible(false);
        }
    }

    const handleConfirmwPasswordBlur = () => {
        if (inputsValues.newPassword != inputsValues.confirmPassword) {
            setConfirmPasswordErrorVisible(true);
        }
        else {
            if (confirmPasswordErrorVisible)
                setConfirmPasswordErrorVisible(false);
        }
    }

    function validateData() {
       return !oldPasswordErrorVisible && !newPasswordErrorVisible && !confirmPasswordErrorVisible;
    }

    function clearData() {
        setInputsValues(inputsInitialValues);
        setUser(null);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateData())
            return;

        try {
            await updatePassword(user.id, inputsValues.newPassword);
            showMessageBox("Password updated successfully", "success");
            clearData();
        }
        catch(error) {
            console.log(error);
            showMessageBox("Failed to update password", "error");
        }
    }

    function renderContent() {
        if (loading)
            return <PulseLoader color='#87cefa' />;

        if (usernameExists) {
            return (
                <>
                    <p><b>User: </b>{username}</p>
                    <div className={styles["container"]}>
                        <form action="submit" onSubmit={handleFormSubmit}>
                            <label>Old Password</label>
                            <br />
                            <input type="password" name="oldPassword" id="oldPassword" value={inputsValues.oldPassword} onChange={handleInputChange} onBlur={handleOldPasswordInputBlur} required />
                            {oldPasswordErrorVisible && <InlineError message="Old password is wrong."/>}

                            <br />

                            <label>New Password</label>
                            <br />
                            <input type="password" name="newPassword" id="newPassword" value={inputsValues.newPassword} onChange={handleInputChange} onBlur={handleNewPasswordBlur} required />
                            {newPasswordErrorVisible && <InlineError message="New password matches the old one."/>}

                            <br />

                            <label>Confirm Password:</label>
                            <br />
                            <input type="password" name="confirmPassword" id="confirmPassword" value={inputsValues.confirmPassword} onChange={handleInputChange} onBlur={handleConfirmwPasswordBlur} required />
                            {confirmPasswordErrorVisible && <InlineError message="New password and confirmation don't match."/>}

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
                    </div>
                </>
            )
        }
    }

    return (
        <Modal
        isOpen={true}
        onRequestClose={() => onRequestClose()}
        className={`modal ${styles["update-password-modal"]}`}
        overlayClassName='modal-overlay'
        >
            <h1>Update Password</h1>

            {renderContent()}

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {errorOccured && !messageBoxVisible && onRequestClose()}
        </Modal>
    )

}

export default UpdatePassword;