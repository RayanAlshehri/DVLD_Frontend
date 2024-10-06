import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AddUpdateUser from "../AddUpdateUser/AddUpdateUser";
import UserInfo from "../UserInfo/UserInfo";


function UsersListContextMenu({userId, cursorPosition, onUserUpdate, onDeleteRequest}) {
    const [userInfoVisible, setUserInfoVisible] = useState(false);
    const [updateUserComponentVisible, setUpdateUserComponentVisible] = useState(false);

    return (
        <>
            <div className="context-menu" style={{ left: cursorPosition.x, top: cursorPosition.y }} onClick={e => e.stopPropagation()}>
                <ul>
                    <div onClick={() => setUserInfoVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <li>User Information</li>
                    </div>
                    <div onClick={() => setUpdateUserComponentVisible(true)} className="list-item-container">
                        <FontAwesomeIcon icon={faPenToSquare} />
                        <li>Update User</li>
                    </div>
                    <div onClick={() => onDeleteRequest?.()} className="list-item-container">
                        <FontAwesomeIcon icon={faUserMinus} />
                        <li>Delete User</li>
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
            </div>

            {updateUserComponentVisible &&
                (<AddUpdateUser
                    userId={userId}
                    onUserUpdate={() => onUserUpdate?.()}
                    onRequestClose={() => setUpdateUserComponentVisible(false)} />)}

            {userInfoVisible &&
                <UserInfo
                    userId={userId}
                    onRequestClose={() => setUserInfoVisible(false)} />
            }
        </>
    )
}

export default UsersListContextMenu;