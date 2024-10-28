import { useState, useEffect, useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import Table from '../../Table/Table';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import { getAllTestTypes, getTestType } from '../../APIRequests/TestTypesRequests';
import TestTypesContextMenu from './TestTypesContextMenu';

function TestTypesList() {
    const [testTypes, setTestTypes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getTestTypes() {
            try {
                const response = await getAllTestTypes();
                setTestTypes(response.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch test types", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getTestTypes();
    }, [])

    
    const columns = useMemo(
        () => [
            {
                Header: 'Type ID',
                accessor: 'type',
            },
            {
                Header: 'Type Name',
                accessor: 'testName',
            },
            {
                Header: 'Fee',
                accessor: 'fee',
            },
        ],
        []
    );

    function renderTableContent() {
        if (loading)
            return <PulseLoader color='#87cefa' />;

        if (testTypes)
            return <Table columns={columns} tableData={testTypes} onSelectedRowChange={(rowId) => setSelectedRowId(rowId)} />;

        return <></>;
    }

    const handleTabelContainerClick = () => {
        if (contextMenuVisible)
            setContextMenuVisible(false);
    }

    const handleContextMenu = (e) => {
        e.preventDefault();

        if (!testTypes) 
            return;

        setCursorPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    }


    const handleTestTypeUpdate = async () => {
        try {
            const response = await getTestType(Number(selectedRowId) + 1);
            setTestTypes(prevItems => {
                const updatedTestTypes = [...prevItems];
                updatedTestTypes[selectedRowId] = response.data;
                return updatedTestTypes;
              });
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <>
        <h1>Test Types</h1>
            
            <div  onContextMenu={handleContextMenu} onClick={handleTabelContainerClick} className={`table-container ${loading ? "table-container-loading" : ""}`}>
                {renderTableContent()}

                {contextMenuVisible &&
                    <TestTypesContextMenu
                    testTypeId={testTypes[selectedRowId].type}
                    cursorPosition={cursorPosition}
                    onTestTypeUpdate={handleTestTypeUpdate}
                        />}
            </div>

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}</>
    )
}

export default TestTypesList;