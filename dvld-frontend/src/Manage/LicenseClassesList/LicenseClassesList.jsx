import { useState, useEffect, useMemo } from 'react';
import { PulseLoader } from 'react-spinners';
import Table from '../../Table/Table';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import { getAllLicenseClasses, getLicenseClass } from '../../APIRequests/LicenseClassesRequests';
import LicenseClassesContextMenu from './LicenseClassesContexMenu';

function LicenseClassesList() {
    const [licenseClasses, setLicenseClasses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getLicenseClasses() {
            try {
                const response = await getAllLicenseClasses();
                setLicenseClasses(response.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch license classes", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getLicenseClasses();
    }, [])

    
    const columns = useMemo(
        () => [
            {
                Header: 'Class ID',
                accessor: 'class',
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Minimum Age',
                accessor: 'minimumAge',
            },
            {
                Header: 'Validity Length',
                accessor: 'validityLength',
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

        if (licenseClasses)
            return <Table columns={columns} tableData={licenseClasses} onSelectedRowChange={(rowId) => setSelectedRowId(rowId)} />;

        return <></>;
    }

    const handleTabelContainerClick = () => {
        if (contextMenuVisible)
            setContextMenuVisible(false);
    }

    const handleContextMenu = (e) => {
        e.preventDefault();

        if (!licenseClasses) 
            return;

        setCursorPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    }


    const handleLicenseClassUpdate = async () => {
        try {
            const response = await getLicenseClass(Number(selectedRowId) + 1);
            setLicenseClasses(prevItems => {
                const updatedLicenseClasses = [...prevItems];
                updatedLicenseClasses[selectedRowId] = response.data;
                return updatedLicenseClasses;
              });
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <>
        <h1>License Classes</h1>
            
            <div  onContextMenu={handleContextMenu} onClick={handleTabelContainerClick} className={`table-container ${loading ? "table-container-loading" : ""}`}>
                {renderTableContent()}

                {contextMenuVisible &&
                   <LicenseClassesContextMenu licenseClassId={licenseClasses[selectedRowId].class} cursorPosition={cursorPosition} onLicenseClassUpdate={handleLicenseClassUpdate}/>}
            </div>

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}</>
    )
}

export default LicenseClassesList;

