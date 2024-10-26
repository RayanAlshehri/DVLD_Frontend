import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UpdateService from "../../UpdateService/UpdateService";

function ServicesListContextMenu({serviceId, cursorPosition, onServiceUpdate}) {
    const [updateServiceVisible, setUpdateServiceVisible] = useState(false);

    return (
        <>
            <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
                <ul>
                    <div onClick={() => setUpdateServiceVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <li>Update Service</li>
                    </div>              
                </ul>

                {updateServiceVisible && 
                <UpdateService serviceId={serviceId} onServiceUpdate={onServiceUpdate} onRequestClose={() => setUpdateServiceVisible(false)} />}
                
            </div>        
        </>
    )
}

export default ServicesListContextMenu;