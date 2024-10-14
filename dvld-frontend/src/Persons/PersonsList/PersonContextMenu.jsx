import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import PersonInfoModal from "../PersonInfoModal/PersonInfoModal"; 
import AddUpdatePerson from "../AddUpdatePerson/AddUpdatePerson"; 
import useMessageBox from '../../Global/MessageBox';
import MessageBox from '../../MessageBox/MessageBox';


function PersonContextMenu({nationalNumber, cursorPosition, callBacks}) {
    const [personInfoVisible, setPersonInfoVisible] = useState(false);
    const [updatePersonModalVisible, setUpdatePersonModalVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    const handlePersonInfoModalClose = () => {
        setPersonInfoVisible(false);
    }

    const handleUpdatePersonModalClose = () => {
        setUpdatePersonModalVisible(false)
    }

    const hadnleDeletePersonConfirmation = (answer) => {
        if (answer == "yes")
            callBacks.onDeleteRequest();
    }
    
    return (
        <>
            <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
                <ul>
                    <div onClick={() => setPersonInfoVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <li>Person Information</li>
                    </div>
                    <div onClick={() => setUpdatePersonModalVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <li>Update Person</li>
                    </div>
                    <div onClick={() => showMessageBox("Are you sure that you want to delete this person?", "confirmation")} className="list-item-container">
                        <FontAwesomeIcon icon={faUserMinus} />
                        <li>Delete Person</li>
                    </div>

                    <hr className="context-menu-separator" />

                    <div className="list-item-container">
                        <FontAwesomeIcon icon={faPhone} />
                        <li> Call</li>
                    </div>
                    <div className="list-item-container">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <li> Send Email</li>
                    </div>
                </ul>


                {personInfoVisible && (
                    <PersonInfoModal identifier={nationalNumber} modalProps={{ isOpen: personInfoVisible, onRequestClose: handlePersonInfoModalClose }} />
                )}

                {updatePersonModalVisible && (
                    <AddUpdatePerson
                        identifier={nationalNumber}
                        onRequestClose={handleUpdatePersonModalClose}
                        onPersonUpdate={callBacks.onPersonUpdate}
                    />
                )
                }

                {messageBoxVisible &&
                    <MessageBox
                        message={messageBoxMessage.current}
                        messageType={messageBoxType.current}
                        onConfirmation={hadnleDeletePersonConfirmation}
                        onClose={handleMessageBoxClose} />
                }
            </div>
        </>
    )

}

export default PersonContextMenu;