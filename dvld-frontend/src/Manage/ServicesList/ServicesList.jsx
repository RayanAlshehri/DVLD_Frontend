import { useState, useEffect, useMemo } from 'react';
import { getAllServices, getService } from '../../APIRequests/ServicesRequests';
import { PulseLoader } from 'react-spinners';
import Table from '../../Table/Table';
import useMessageBox from "../../Global/MessageBox";
import MessageBox from "../../MessageBox/MessageBox";
import ServicesListContextMenu from './ServicesListContextMenu';

function ServicesList() {
    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});
    const [selectedRowId, setSelectedRowId] = useState(0);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose } = useMessageBox();

    useEffect(() => {
        async function getServices() {
            try {
                const response = await getAllServices();
                setServices(response.data);
            }
            catch (error) {
                console.log(error);
                showMessageBox("Failed to fetch Services", "error");
            }
            finally {
                setLoading(false);
            }
        }

        getServices();
    }, [])

    const columns = useMemo(
        () => [
            {
                Header: 'Service ID',
                accessor: 'service',
            },
            {
                Header: 'Service Name',
                accessor: 'serviceName',
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

        if (services)
            return <Table columns={columns} tableData={services} onSelectedRowChange={(rowId) => {setSelectedRowId(rowId); console.log(rowId)}} />;

        return <></>;
    }

    const handleTabelContainerClick = () => {
        if (contextMenuVisible)
            setContextMenuVisible(false);
    }

    const handleContextMenu = (e) => {
        e.preventDefault();

        if (!services) 
            return;

        setCursorPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    }

    const handleServiceUpdate = async () => {
        try {
            const response = await getService(Number(selectedRowId) + 1);
            console.log(response.data);
            setServices(prevItems => {
                const updatedServices = [...prevItems];
                updatedServices[selectedRowId] = response.data;
                return updatedServices;
              });
        }
        catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <h1>Services</h1>
            
            <div  onContextMenu={handleContextMenu} onClick={handleTabelContainerClick} className={`table-container ${loading ? "table-container-loading" : ""}`}>
                {renderTableContent()}

                {contextMenuVisible &&
                    <ServicesListContextMenu
                    serviceId={services[selectedRowId].service}
                    onServiceUpdate={handleServiceUpdate}
                    cursorPosition={cursorPosition}
                        />}
            </div>

            {messageBoxVisible && <MessageBox message={messageBoxMessage.current} messageType={messageBoxType.current} onClose={handleMessageBoxClose} />}
        </>
    )
}

export default ServicesList;