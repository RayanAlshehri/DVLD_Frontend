import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTable } from 'react-table';
import styles from './PersonsList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import AddUpdatePerson from '../AddUpdatePerson/AddUpdatePerson'; 
import PersonContextMenu from './PersonContextMenu';
import * as PersonsRequests from '../../APIRequests/PersonsRequests';
import { formatDateToDMY } from '../../Global/Util';
import MessageBox from '../../MessageBox/MessageBox'; 
import { PulseLoader } from 'react-spinners';
import useMessageBox from '../../Global/MessageBox';


function PersonsList() {
    const [isLoading, setIsLoading] = useState(true);
    const isListFetched = useRef(false);
    const [persons, setPersons] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getAllPersons() {
            try {
                const response = await PersonsRequests.getAllPersons();
                setPersons(response.data);
                setIsLoading(false);
                isListFetched.current = true;
                console.log('Persons list fetched');
            }
            catch (error) {
                setIsLoading(false)
                console.log(error);
                showMessageBox("Error in fetching persons", "error");
            }
        }
        getAllPersons();
    }, []);

    const filteredPersons = useMemo(() => {
        if (!filterValue) {
            return persons;
        }

        return persons.filter(person =>
            person.nationalNumber.startsWith(filterValue)
        );
    }, [persons, filterValue]);


    const columns = useMemo(
        () => [
            {
                Header: 'National Number',
                accessor: 'nationalNumber',
            },
            {
                Header: 'First Name',
                accessor: 'firstName',
            },
            {
                Header: 'Second Name',
                accessor: 'secondName',
            },
            {
                Header: 'Third Name',
                accessor: 'thirdName',
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
            },
            {
                Header: 'Gender',
                accessor: 'gender',
            },
            {
                Header: 'Date of Birth',
                accessor: 'dateOfBirth',
            },
            {
                Header: 'Nationality',
                accessor: 'nationality',
            },
            {
                Header: 'Phone',
                accessor: 'phone',
            },
            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Address',
                accessor: 'address',
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
    } = useTable({ columns, data: filteredPersons });

    const convertPersonObjToRow = (person) => {
        return {
            nationalNumber: person.nationalNumber,
            firstName: person.firstName,
            secondName: person.secondName,
            thirdName: person.thirdName,
            lastName: person.lastName,
            gender: person.gender == 'M' ? 'Male' : 'Female',
            dateOfBirth: formatDateToDMY(new Date(person.dateOfBirth)),
            nationality: person.country.name,
            phone: person.phone,
            email: person.email,
            address: person.address
        }
    }

    const handleNationalNumberInputChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);
    };


    const handleContextMenu = (e) => {
        if (!isListFetched.current) {
            return;
        }

        e.preventDefault();
        setCursorPosition({ x: e.clientX, y: e.clientY })
        setIsContextMenuVisible(true)
    }

    const handleTableClick = () => setIsContextMenuVisible(false);

    const handleRowClick = (row) => setSelectedRowId(row.id);

    const handleAddPersonClick = () => setIsPersonModalOpen(true);

    const handleAddPersonCloseRequest = () => setIsPersonModalOpen(false);


    const handlePersonAdded = async (addedPersonID) => {
        console.log(`New person ID is ${addedPersonID}`)

        try {
            const response = await PersonsRequests.getPersonById(addedPersonID);
            console.log("New person fetched")
            setPersons([...persons, convertPersonObjToRow(response.data)]);
        }
        catch (error) {
            console.log(error);
        }
    };


    const handlePersonUpdate = async () => {
        const row = rows.find(r => r.id == selectedRowId);

        try {
            const response = await PersonsRequests.getPersonByNationalNumber(row.original.nationalNumber);
            console.log(`Person info fetched with national number ${row.original.nationalNumber}`)

            const updatedPersonInfo = convertPersonObjToRow(response.data)
            const newPersons = persons.map(p => p.nationalNumber == updatedPersonInfo.nationalNumber ?
                updatedPersonInfo : p);

            setPersons(newPersons);
        }
        catch (error) {
            console.log(error);
        }
    }


    const handleDeleteRequest = async () => {
        const nationalNumber = rows.find(r => r.id == selectedRowId).original.nationalNumber;

        try {
            await PersonsRequests.deletePersonByNationalNumber(nationalNumber);
            showMessageBox("Person deleted successfully", "success");
            setSelectedRowId(selectedRowId - 1);
            setPersons(persons.filter(p => p.nationalNumber != nationalNumber));
        }
        catch (error) {
            console.log(error);
            showMessageBox("Failed to delete person", "error");
        }
    }


    return (
        <>
            <h1>Persons List</h1>

            {isListFetched.current && (
                <div className={styles[`input-button-container`]}>
                    <div className={styles['national-number-field']}>
                        <label>Find:</label>
                        <input
                            type="text"
                            id="nationalNumberInput"
                            placeholder="National Number"
                            value={filterValue}
                            onChange={handleNationalNumberInputChange}
                        />
                    </div>
                    <button onClick={handleAddPersonClick} className='main-page-button'><FontAwesomeIcon icon={faUserPlus} className={`main-page-button-icon ${styles[`add-button-icon`]}`} /></button>
                </div>
            )}

            <div onContextMenu={handleContextMenu} onClick={handleTableClick} className={`table-container ${isLoading ? `table-container-loading` : ''}`}>
                {isLoading ? (<PulseLoader color='#87cefa' />) : isListFetched.current && (
                    <>
                        {isContextMenuVisible && (
                            <PersonContextMenu
                                nationalNumber={rows.find(r => r.id == selectedRowId).original.nationalNumber}
                                cursorPosition={cursorPosition}
                                callBacks={{ onPersonUpdate: handlePersonUpdate, onDeleteRequest: handleDeleteRequest }}
                            />
                        )}

                        <table {...getTableProps()} className='table'>
                            <thead>
                                {headerGroups.map(headerGroup => {
                                    const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
                                    return (
                                        <tr key={headerGroupKey} {...headerGroupProps} className='table-header'>
                                            {headerGroup.headers.map(column => {
                                                const { key: columnKey, ...columnProps } = column.getHeaderProps();
                                                return (
                                                    <th key={columnKey} {...columnProps} className='table-cell'>
                                                        {column.render('Header')}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    );
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
                                            className={row.id == selectedRowId ? 'selected' : ''}
                                            onClick={() => handleRowClick(row)}
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
                    </>
                )}
            </div>

            {isPersonModalOpen && (
                <AddUpdatePerson
                    isOpen={true}
                    onRequestClose={handleAddPersonCloseRequest}
                    onPersonAddition={handlePersonAdded}
                />
            )}

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </>
    );
}

export default PersonsList;



