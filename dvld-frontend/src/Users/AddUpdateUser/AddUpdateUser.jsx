import { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { PulseLoader } from 'react-spinners';
import FindPerson from "../../Persons/FindPerson/FindPerson";
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import UpdatePassword from '../UpdatePassword/UpdatePassword'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFloppyDisk, faLock } from '@fortawesome/free-solid-svg-icons';
import { addNewUser, doesUserExistByPersonId, doesUserExistByUsername, getUserById, updateUser } from '../../APIRequests/UsersRequests';
import styles from './AddUpdateUser.module.css'
import PersonInfo from '../../Persons/PersonInfo/PersonInfo';

const modes = {
    add: 0,
    update: 1,
};

function AddUpdateUser({ userId = 0, onUserAdded, onUserUpdate, onRequestClose }) {
    const mode = userId ? modes.update : modes.add;
    const [loading, setLoading] = useState(true);
    const [fetchErrorOccured, setFetchErrorOccured] = useState(false);
    const [personFound, setPersonFound] = useState(false);
    const [updateModePersonId, setUpdateModePersonId] = useState(0);
    const [accountStatus, setAccountStatus] = useState(true);
    const [updatePasswordVisible, setUpdatePasswordVisible] = useState(false);
    const [viewUserListPermissionChecked, setViewUserListPermissionChecked] = useState(false);
    const [addUserPermissionChecked, setAddUserPermissionChecked] = useState(false);
    const [updateUserPermissionChecked, setUpdateUserPermissionChecked] = useState(false);
    const [deleteUserPermissionChecked, setDeleteUserPermissionChecked] = useState(false);
    const foundPersonID = useRef(0);
    const originalUsername = useRef(null);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const initialUserState = {
        username: "",
        password: "",
        confirmPassword: "",
    };
    const [user, setUser] = useState(initialUserState);
    const isAdded = useRef(false);
    const isUpdated = useRef(false);

    useEffect(() => {
        async function getUser() {
            try {
                const response = await getUserById(userId);
                loadUserInfoToInputs(response.data);
                originalUsername.current = response.data.username;
            }
            catch (error) {
                showMessageBox("Failed to fetch user information", "error");
                setFetchErrorOccured(true);
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        if (mode == modes.update)
            getUser();
        else
            setLoading(false);
    }, [])

    function loadPermissions(permissions) {
        if (permissions == -1) {
            setViewUserListPermissionChecked(true);
            setAddUserPermissionChecked(true);
            setUpdateUserPermissionChecked(true);
            setDeleteUserPermissionChecked(true);
            return;
        }

        if ((1 & permissions) == 1)
            setViewUserListPermissionChecked(true);
        if ((2 & permissions) == 2)
            setAddUserPermissionChecked(true);
        if ((4 & permissions) == 4)
            setUpdateUserPermissionChecked(true);
        if ((8 & permissions) == 8)
            setDeleteUserPermissionChecked(true);
    }

    function loadUserInfoToInputs(user) {
        setUpdateModePersonId(user.person.id);
        setUser({
            username: user.username
        });

        setAccountStatus(user.isActive);
        loadPermissions(user.permissionsOnUsers);
    }

    async function validateData() {
        if (mode == modes.add && !foundPersonID.current) {
            showMessageBox("Select a person first", "error");
            return false;
        }

        if (mode == modes.add  || (mode == modes.update && originalUsername.current != user.username)) {
            try {
                const response = await doesUserExistByUsername(user.username);

                if (response.data) {
                    showMessageBox("Username is used", "error");
                    return false;
                }
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }

        if (user.password != user.confirmPassword) {
            showMessageBox("Passwords do not match", "error");
            return false;
        }

        return true;
    }

    function calculatePermissionsNumber() {
        let permissions = 0;

        if (viewUserListPermissionChecked)
            permissions += 1;

        if (addUserPermissionChecked)
            permissions += 2;

        if (updateUserPermissionChecked)
            permissions += 4;

        if (deleteUserPermissionChecked)
            permissions += 8;

        return permissions == 15 ? -1 : permissions;
    }


    const handlePersonFound = async (personId) => {
        try {
            const response = await doesUserExistByPersonId(personId);

            if (response.data) {
                showMessageBox("This person is already a user", "error");
                setPersonFound(false);
                return;
            }
        }
        catch (error) {
            console.log(error);
            setPersonFound(false);
            return;
        }

        setPersonFound(true);
        foundPersonID.current = personId;
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleViewUsersListPermissionChange = () => {
        setViewUserListPermissionChecked(!viewUserListPermissionChecked);

        if (viewUserListPermissionChecked) {
            setAddUserPermissionChecked(false);
            setUpdateUserPermissionChecked(false);
            setDeleteUserPermissionChecked(false);
        }
    }


     const handleSubmit = async (e) => {
        e.preventDefault();

       if (!(await validateData()))
        return;

        if (mode == modes.add) {
            const newUser = {
                personId: foundPersonID.current,
                username: user.username,
                password: user.password,
                isActive: accountStatus,
                permissionsOnUsers: calculatePermissionsNumber()
            };

            try {
                const response = await addNewUser(newUser);
                isAdded.current = true;
                showMessageBox("User added successfully", "success");
                onUserAdded?.(response.data);
            }
            catch (error) {
                showMessageBox("Failed to add user", "error");
                console.log(error);
            }
        }
        else {
            const updatedUser = {
                username: user.username,
                isActive: accountStatus,
                permissionsOnUsers: calculatePermissionsNumber()
            };

            try {
                await updateUser(userId, updatedUser);
                originalUsername.current = updatedUser.username;
                isUpdated.current = true;
                showMessageBox("User updated successfully", "success");
                onUserUpdate?.();
            }
            catch (error) {
                showMessageBox("Failed to update user", "error");
                console.log(error);
            }
        }
    }

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />
        }
        else if (!fetchErrorOccured) {
            return (
                <>
                    {mode == modes.add ?
                        <FindPerson findEnabled={mode == modes.add} onPersonFound={handlePersonFound} />
                        :
                        <>
                        <h2>Person Informartion:</h2>
                            <PersonInfo identifier={updateModePersonId} />
                        </>
                    }
                    
                    {mode == modes.add ?
                        <h4>User Informartion:</h4>
                        :
                        <h2>User Informartion:</h2>
                    }
                    <form onSubmit={handleSubmit}>
                        <div className={styles["user-info-container"]}>
                            <div className={styles["left-fields"]}>
                                <label>Username:</label>
                                <br />
                                <input type="text" id="username" name="username" value={user.username} onChange={handleInputChange} required disabled={mode == modes.add ? !personFound : false} />

                                <br />

                                {mode == modes.add &&
                                    <>
                                        <label>Password:</label>
                                        <br />
                                        <input type="password" id="password" name="password" value={user.password} onChange={handleInputChange} required disabled={mode == modes.add ? !personFound : false} />

                                        <br />

                                        <label>Confirm Password:</label>
                                        <br />
                                        <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={handleInputChange} required disabled={mode == modes.add ? !personFound : false} />

                                        <br />
                                    </>
                                }

                                <label>Account status:</label>
                                <br />
                                <input type="checkbox" id="isActive" name="isActive" checked={accountStatus} onChange={() => setAccountStatus(!accountStatus)} disabled={mode == modes.add ? !personFound : false} />

                                {mode == modes.update && (
                                    <>
                                        <br />
                                        <button type='button'
                                            onClick={() => setUpdatePasswordVisible(true)}
                                            className={`modal-button ${styles["change-password-button"]}`}>
                                            <FontAwesomeIcon icon={faLock} className={`icon ${styles['lock-icon']}`}/>Change password</button>
                                    </>)}
                            </div>

                            <div>
                                <label>Permissions:</label>
                                <br />

                                <div className={styles["check-boxes-container"]}>
                                    <label>View users list</label>
                                    <input
                                        type="checkbox"
                                        id="viewUsersList"
                                        checked={viewUserListPermissionChecked}
                                        onChange={handleViewUsersListPermissionChange}
                                        disabled={mode == modes.add ? !personFound : false} />

                                    <label>Add user</label>
                                    <input
                                        type="checkbox"
                                        id="addUser"
                                        checked={addUserPermissionChecked}
                                        onChange={() => setAddUserPermissionChecked(!addUserPermissionChecked)}
                                        disabled={(mode == modes.add ? !personFound : false) || !viewUserListPermissionChecked} />

                                    <label>Update user</label>
                                    <input
                                        type="checkbox"
                                        id="updateUser"
                                        checked={updateUserPermissionChecked}
                                        onChange={() => setUpdateUserPermissionChecked(!updateUserPermissionChecked)}
                                        disabled={(mode == modes.add ? !personFound : false) || !viewUserListPermissionChecked} />

                                    <label>Delete user</label>
                                    <input
                                        type="checkbox"
                                        id="deleteUser"
                                        checked={deleteUserPermissionChecked}
                                        onChange={() => setDeleteUserPermissionChecked(!deleteUserPermissionChecked)}
                                        disabled={(mode == modes.add ? !personFound : false) || !viewUserListPermissionChecked} />
                                </div>
                            </div>
                        </div>

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
                </>)
        }
    }

    return (
        <div>
            <Modal
                isOpen={true}
                onRequestClose={() => onRequestClose()}
                className={`modal ${styles["add-update-user-modal"]}`}
                overlayClassName="modal-overlay"
            >
                {renderContent()}
                {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
                {console.log(userId)}
                {updatePasswordVisible && <UpdatePassword username={originalUsername.current} onRequestClose={() => setUpdatePasswordVisible(false)} />}
                {(isAdded.current || fetchErrorOccured) && !messageBoxVisible && onRequestClose()}
            </Modal>
        </div>
    )
}

export default AddUpdateUser;