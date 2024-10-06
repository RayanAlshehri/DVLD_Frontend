import Modal from 'react-modal';
import MessageBox from '../../MessageBox/MessageBox';
import useMessageBox from '../../Global/MessageBox';
import LicenseInfo from '../LicenseInfo/LicenseInfo';
import styles from './LicenseInfoModal.module.css';
import { useState } from 'react';

function LicenseInfoModal({licenseId, onRequestClose}) {
    const [closeModal, setCloseModal] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => onRequestClose()}
            className={`modal ${styles["license-info-modal"]}`}
            overlayClassName="modal-overlay"
        >
            <h1>License Information: </h1>
            <LicenseInfo licenseId={licenseId} onFetchError={() => {showMessageBox("Error in fetching data", "error"); setCloseModal(true);}} />
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
            {closeModal && !messageBoxVisible && onRequestClose()}
        </Modal>
    )
}

export default LicenseInfoModal;