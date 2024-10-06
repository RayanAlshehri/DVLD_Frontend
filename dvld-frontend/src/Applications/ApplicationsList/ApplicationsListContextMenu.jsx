import { useNavigate } from "react-router-dom";
import { getApplicationByApplicationId } from "../../APIRequests/LocalLicenseApplicationsRequests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen } from '@fortawesome/free-solid-svg-icons';
import { faFileCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";

function ApplicationsListContextMenu({applicationId, applicationStatus, cursorPosition, onCancelApplicationClick}) {
    const navigate = useNavigate();
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    const handleUpdateApplicationClick = async () => {
        try {
            const response = await getApplicationByApplicationId(applicationId);
            navigate(`/app/local-license-application/${response.data.localLicenseApplicationID}`)
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to fetch application", "error");
        }   
    }

    function renderMenuItems() {
        switch (applicationStatus) {
            case "New":
                return (
                    <>
                        <div onClick={handleUpdateApplicationClick} className="list-item-container">
                            <FontAwesomeIcon icon={faFilePen} />
                            <li>Update Application</li>
                        </div>
                        <div onClick={() => onCancelApplicationClick?.()} className="list-item-container">
                            <FontAwesomeIcon icon={faFileCircleXmark} />
                            <li>Cancel Application</li>
                        </div>
                    </>
                )

            case "Complete":
                return (
                    <>
                        <div onClick={handleUpdateApplicationClick} className="list-item-container">
                            <FontAwesomeIcon icon={faFilePen} />
                            <li>View Application</li>
                        </div>
                    </>
                )
        }
    }

    return (
        <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
            <ul>
                {renderMenuItems()}
            </ul>

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </div>
    )
}

export default ApplicationsListContextMenu;