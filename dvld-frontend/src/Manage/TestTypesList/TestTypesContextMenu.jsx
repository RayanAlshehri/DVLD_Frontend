import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import UpdateTestType from "../../UpdateTestType/UpdateTestType";


function TestTypesContextMenu({testTypeId, cursorPosition, onTestTypeUpdate}) {
    const [updateTestTypeVisible, setUpdateTestTypeVisible] = useState(false);


    return (
        <>
            <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
                <ul>
                    <div onClick={() => setUpdateTestTypeVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <li>Update Test Type</li>
                    </div>              
                </ul>

                {updateTestTypeVisible && 
                <UpdateTestType testTypeId={testTypeId} onTestTypeUpdate={onTestTypeUpdate} onRequestClose={() => setUpdateTestTypeVisible(false)} />}
                
            </div>        
        </>
    )
}

export default TestTypesContextMenu;