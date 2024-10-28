import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UpdateLicenseClass from "../../UpdateLicenseClass/UpdateLicenseClass";

function LicenseClassesContextMenu({licenseClassId, cursorPosition, onLicenseClassUpdate}) {
    const [updateLicenseClass, setUpdateLicenseClass] = useState(false);

    return (
        <>
            <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
                <ul>
                    <div onClick={() => setUpdateLicenseClass(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <li>Update Class</li>
                    </div>              
                </ul>

                {updateLicenseClass && 
                <UpdateLicenseClass licenseClassId={licenseClassId} onLicenseClassUpdate={onLicenseClassUpdate} onRequestClose={() => setUpdateLicenseClass(false)} />}
                
            </div>        
        </>
    )
}

export default LicenseClassesContextMenu;