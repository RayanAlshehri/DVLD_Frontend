import Modal from 'react-modal';
import PersonInfo from '../PersonInfo/PersonInfo';
import styles from './PersonInfoModal.module.css'
import MessageBox from "../../MessageBox/MessageBox";
import { useState } from 'react';

function PersonInfoModal({identifier, modalProps}) {
    const [failedToFetchInfo, setFailedToFetchInfo] = useState(false);

    if (failedToFetchInfo)
        return <MessageBox message="Failed to fetch person information" messageType="error"/>

    return (
        <div> 
            <Modal
                isOpen={modalProps.isOpen} className={styles['person-info-modal']}
                onRequestClose={modalProps.onRequestClose}
                overlayClassName={styles.overlay}
            >
                <h1>Person Information:</h1>
                <PersonInfo identifier={identifier} onFetchError={() => setFailedToFetchInfo(true)}/>
            </Modal>
        </div>
    )
}

export default PersonInfoModal;