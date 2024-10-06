import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import styles from './MessageBox.module.css';

const messageTypes = {
    info: 'info',
    error: 'error',
    success: 'success',
    confirmation: 'confirmation'
};

function MessageBox({message, messageType, onClose}) {

    const handleCloseRequest = () => {
        onClose?.();
    };

    const getContent = () => {
        switch (messageType) {
            case messageTypes.info:
                return (
                    <>
                        <FontAwesomeIcon icon={faCircleInfo} className={`${styles['message-icon']} ${styles['info-icon']}`}/>
                        <p>{message}</p>
                        <button onClick={handleCloseRequest} className={`modal-button`}>OK</button>
                    </>
                )
            case messageTypes.error:
                return (
                    <>
                        <FontAwesomeIcon icon={faCircleXmark} className={`${styles['message-icon']} ${styles['error-icon']}`}/>
                        <p>{message}</p>
                        <button onClick={handleCloseRequest} className={`modal-button`}>OK</button>
                    </>
                )
            case messageTypes.success:
                return (
                    <>
                        <FontAwesomeIcon icon={faCircleCheck} className={`${styles['message-icon']} ${styles['success-icon']}`}/>
                        <p>{message}</p>
                        <button onClick={handleCloseRequest} className={`modal-button`}>OK</button>
                    </>
                )
            case messageTypes.confirmation:
                return (
                    <>
                        <FontAwesomeIcon icon={faCircleQuestion} className={`${styles['message-icon']} ${styles['confirm-icon']}`}/>
                        <p>{message}</p>
                        <div>
                            <button onClick={handleCloseRequest} className={`modal-button ${styles['confirmation-button']} ${styles['cancel-button']}`}>No</button>
                            <button onClick={handleCloseRequest} className={`modal-button ${styles['confirmation-button']}`}>Yes</button>
                        </div>
                    </>
                )

            default:
                return "";
        }
    }

    return (
        <Modal
            isOpen={true}
            onRequestClose={handleCloseRequest}
            className='modal'
            overlayClassName='modal-overlay'
        >
            <div className={styles['content-container']}>
                {getContent()}
            </div>
        </Modal>
    )
}

export default MessageBox;