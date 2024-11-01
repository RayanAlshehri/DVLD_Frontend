import { useEffect, useState, useMemo, useRef } from "react"
import {deleteUser, getAllUsers, getUserById} from "../../APIRequests/UsersRequests";
import { useTable } from "react-table";
import { PulseLoader } from 'react-spinners';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AddUpdateUser from "../AddUpdateUser/AddUpdateUser";
import styles from "./UsersList.module.css"
import UsersListContextMenu from "./UsersListContextMenu";

function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchErrorOccured, setFetchErrorOccured] = useState(false);
    const [filterOption, setFilterOption] = useState("userId");
    const [filterValue, setFilterValue] = useState("");
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [addUserVisible, setAddUserVisible] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getUsers() {
            try {
                const response = await getAllUsers();
                setUsers(response.data);
            }
            catch (error) {
                setFetchErrorOccured(true);
                showMessageBox("Failed to fetch users", "error");
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        }

        getUsers();
    }, [])

    const filteredUsers = useMemo(() => {
        if (!filterValue)
            return users;

        switch (filterOption) {
            case "userId":
                console.log("Filtering with userID: " + filterValue)
                return users.filter(u => u.userID == filterValue);

            case "username":
                return users.filter(u => u.username.startsWith(filterValue));
        }
    }, [users, filterValue])

    const columns = useMemo(
        () => [
            {
                Header: 'User ID',
                accessor: 'userID',
            },
            {
                Header: 'Full Name',
                accessor: 'fullName',
            },
            {
                Header: 'Username',
                accessor: 'username',
            },
            {
                Header: 'Account Status',
                accessor: 'accountStatus',
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: filteredUsers });

    const handleFilterOptionChange = (e) => {
        setFilterOption(e.target.value);
        setFilterValue("");
    }

    const handleFilterChange = (e) => {
        setFilterValue(e.target.value);
    }

    function convertUserObjToRow(user) {
        console.log(user)
        return {
            userID: user.id,
            fullName: user.person.fullName,
            username: user.username,
            accountStatus: user.isActive ? "Active" : "Inactive"
        };
    }


    const hadnleUserAdded = async (addedUserID) => {
        console.log("User added with ID " + addedUserID);

        try {
            const response = await getUserById(addedUserID);
            setUsers([...users, convertUserObjToRow((response.data))])
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleUserUpdate = async () => {
        try {
            const response = await getUserById(rows.find(r => r.id == selectedRowId).original.userID);
            const updatedUser = convertUserObjToRow(response.data);
            
            setUsers(users.map(u => u.userID == updatedUser.userID ? updatedUser : u));
        }
        catch(error) {
            console.log(error);
        }
    }

    const handleUserDeleteRequest = async () => {
        const userId = rows.find(r => r.id == selectedRowId).original.userID;

        try {
            await deleteUser(userId);
            setSelectedRowId(selectedRowId - 1);
            setUsers(users.filter(u => u.userID != userId))
            showMessageBox("User deleted successfully", "success");
        }
        catch(error) {
            console.log(error);
            showMessageBox("Failed to delete user because there is data linked to it", "error");
        }
    }

    const handleContextMenu = (e) => {
        e.preventDefault();

        if (fetchErrorOccured) 
            return;

        setCursorPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    }

    const handleTabelContainerClick = () => {
        if (contextMenuVisible)
            setContextMenuVisible(false);
    }

    const renderTableContent = () => {
        if (loading)
            return <PulseLoader color='#87cefa' />;

        return (
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => {
                        const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();

                        return (
                            <tr {...headerGroupProps} key={headerGroupKey} className="table-header">
                                {headerGroup.headers.map(column => {
                                    const { key: columnKey, ...columnProps } = column.getHeaderProps();

                                    return (
                                        <th {...columnProps} key={columnKey} className="table-cell">
                                            {column.render("Header")}
                                        </th>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </thead>         
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        const { key: rowKey, ...rowProps } = row.getRowProps();
                        return (
                            <tr
                                key={rowKey}
                                {...rowProps}
                                className={row.id == selectedRowId ? "selected" : ""}
                                onClick={() => setSelectedRowId(row.id)}
                            >
                                {row.cells.map(cell => {
                                    const { key: cellKey, ...cellProps } = cell.getCellProps();
                                    return (
                                        <td key={cellKey} {...cellProps} className='table-cell'>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }

    return (
        <>
            <h1>Users List</h1>
            <div className={styles["filter-button-container"]}>
                <div className={styles["filter-container"]}>
                    <label>Filter:</label>
                    <input 
                    id="filter" 
                    type={filterOption == "userId" ? "number" : "text"} 
                    placeholder={filterOption == "userId" ? "User ID" : "Username"} 
                    value={filterValue} onChange={handleFilterChange}/>

                    <select onChange={handleFilterOptionChange}>
                        <option value="userId">User ID</option>
                        <option value="username">Username</option>
                    </select>
                </div>

                <button onClick={() => setAddUserVisible(true)} className='main-page-button'>
                    <FontAwesomeIcon icon={faUserPlus} className={`main-page-button-icon ${styles[`add-button-icon`]}`} />
                </button>
            </div>
            <div onContextMenu={handleContextMenu} onClick={handleTabelContainerClick} className={`table-container ${loading ? "table-container-loading" : ""}`}>
                {!fetchErrorOccured && renderTableContent()}

                {contextMenuVisible &&
                    <UsersListContextMenu
                        userId={rows.find(r => r.id == selectedRowId).original.userID}
                        cursorPosition={cursorPosition}
                        onUserUpdate={handleUserUpdate}
                        onDeleteRequest={handleUserDeleteRequest} />}
            </div>

            {addUserVisible && <AddUpdateUser onUserAdded={hadnleUserAdded} onRequestClose={() => setAddUserVisible(false)} />}
            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </>
    )
}


export default UsersList;