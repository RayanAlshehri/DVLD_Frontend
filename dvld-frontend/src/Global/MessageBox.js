import { useState, useRef } from 'react';

const useMessageBox = () => {
    const [messageBoxVisible, setMessageBoxVisible] = useState(false);
    const messageBoxMessage = useRef("");
    const messageBoxType = useRef("");

    const showMessageBox = (message, messageType) => {
        messageBoxMessage.current = message;
        messageBoxType.current = messageType;
        setMessageBoxVisible(true);
    };

    const handleMessageBoxClose = () => {
        messageBoxMessage.current = "";
        messageBoxType.current = "";
        setMessageBoxVisible(false);
    };

    return { messageBoxVisible, messageBoxMessage, messageBoxType, showMessageBox, handleMessageBoxClose };
};

export default useMessageBox;
