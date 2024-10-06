import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import styles from "./ApplicationsList.module.css"
import { useEffect, useState, useMemo } from 'react';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import { useTable } from "react-table";
import { PulseLoader } from 'react-spinners';
import { getAllLocalLicenseApplications } from '../../APIRequests/LocalLicenseApplicationsRequests';
import { useNavigate } from "react-router-dom";
import ApplicationsListContextMenu from './ApplicationsListContextMenu';
import { updateApplicationStatus } from '../../APIRequests/Applications';
import { enApplicationStatuses } from '../../Global/GlobalVariables';

function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchErrorOccured, setFetchErrorOccured] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [filterOption, setFilterOption] = useState("applicationId");
    const [filterValue, setFilterValue] = useState("");
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();
    const navigate = useNavigate();

    useEffect(() => {
        async function getApplications() {
            try {
                const response = await getAllLocalLicenseApplications();
                setApplications(response.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch applications", "error");
                setFetchErrorOccured(true);
            }
            finally {
                setLoading(false);
            }
        }

        getApplications();
    }, [])

    const filteredApplications = useMemo(() => {
        if (!filterValue)
            return applications;

        switch (filterOption) {
            case "applicationId":
                return applications.filter(a => a.applicationID == filterValue);

            case "nationalNumber":
                return applications.filter(a => a.nationalNumber.startsWith(filterValue));
        }
    }, [applications, filterValue])

    const columns = useMemo(
        () => [
            {
                Header: 'Application ID',
                accessor: 'applicationID',
            },
            {
                Header: 'Class',
                accessor: 'className',
            },
            {
                Header: 'Applicant National Number',
                accessor: 'nationalNumber',
            },
            {
                Header: 'Full Name',
                accessor: 'fullName',
            },
            {
                Header: 'Application Date',
                accessor: 'applicationDate',
            },
            {
                Header: 'Status',
                accessor: 'status',
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
    } = useTable({ columns, data: filteredApplications});

    const handleFilterOptionChange = (e) => {
        setFilterOption(e.target.value);
        setFilterValue("");
    }

    const handleFilterChange = (e) => {
        setFilterValue(e.target.value);
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

    const handleApplicationCancelClick = async () => {
        try {
            await updateApplicationStatus(rows.find(r => r.id == selectedRowId).original.applicationID, enApplicationStatuses.cancelled);
            showMessageBox("Application cancelled successfully", "success");
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to cancel application", "error");
        }
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
        <div className="page-content-container">
            <h1>Applications List</h1>
            {!loading && !fetchErrorOccured && 
                <div className={styles["filter-button-container"]}>
                    <div className={styles["filter-container"]}>
                        <label>Filter:</label>
                        <input
                            id="filter"
                            type={filterOption == "applicationId" ? "number" : "text"}
                            placeholder={filterOption == "applicationId" ? "Application ID" : "National Number"}
                            value={filterValue} onChange={handleFilterChange} />

                        <select onChange={handleFilterOptionChange}>
                            <option value="applicationId">Application ID</option>
                            <option value="nationalNumber">National Number</option>
                        </select>
                    </div>

                    <button onClick={() => navigate("/app/local-license-application")} className='main-page-button'>
                        <FontAwesomeIcon icon={faFileCirclePlus} className={`main-page-button-icon ${styles[`add-button-icon`]}`} />
                    </button>
                </div>}
            <div onContextMenu={handleContextMenu} onClick={handleTabelContainerClick} className={`table-container ${loading ? "table-container-loading" : ""}`}>
                {!fetchErrorOccured && renderTableContent()}

                {contextMenuVisible &&
                    <ApplicationsListContextMenu
                        applicationId={rows.find(r => r.id == selectedRowId).original.applicationID}
                        applicationStatus={rows.find(r => r.id == selectedRowId).original.status}
                        cursorPosition={cursorPosition}
                        onCancelApplicationClick={handleApplicationCancelClick} />}
            </div>

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </div>
       
    )
}

export default ApplicationList;