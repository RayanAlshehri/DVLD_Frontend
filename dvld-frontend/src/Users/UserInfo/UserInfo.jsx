import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import PersonInfo from '../../Persons/PersonInfo/PersonInfo';
import {getUserById} from '../../APIRequests/UsersRequests';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import { PulseLoader } from 'react-spinners';
import styles from './UserInfo.module.css';

function UserInfo({userId, onRequestClose}) {
    const [loading, setLoading] = useState(true);
    const [errorOccured, setErrorOccured] = useState(false);
    const [user, setUser] = useState(null);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getUser() {
            try {
                const response = await getUserById(userId);
                setUser(response.data);
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

        getUser();
    }, [])

   

    function renderContent() {
        if (loading) {
            return <PulseLoader color='#87cefa' />;
        }

        if (user) {
            return (
                <div className={styles["person-user-info-container"]}>
                    <h1>Person Information:</h1>
                    <PersonInfo identifier={user.person.id} />

                    <h1 className={styles["user-info-h1"]}>User Infromation:</h1>
                    <div className={styles["user-info-container"]}>
                        <p><b>Username: </b>{user.username}</p>
                        <p><b>Account Status: </b>{user.isActive ? "Active" : "Inactive"}</p>
                    </div>
                </div>
            )
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                isOpen={true}
                onRequestClose={() => onRequestClose()}
                className={`modal`}
                overlayClassName="modal-overlay"
            >
                {renderContent()}

                {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
                {errorOccured && !messageBoxVisible && onRequestClose()}
            </Modal>
        </div>
    )
}

export default UserInfo;