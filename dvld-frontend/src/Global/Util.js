
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDateToDMY(date) {
    // Convert to Date object if it's a string
    const validDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(validDate)) {
        return 'Invalid Date';
    }

    const day = validDate.getDate();
    const month = monthNames[validDate.getMonth()];
    const year = validDate.getFullYear();

    return `${day}/${month}/${year}`;
}

export function formatDateToDMYHM(date) {
    // Convert to Date object if it's a string
    const validDate = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(validDate)) {
        return 'Invalid Date';
    }

    const day = validDate.getDate();
    const month = monthNames[validDate.getMonth()];
    const year = validDate.getFullYear();
    let hours = validDate.getHours();
    const minutes = validDate.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, set to 12

    // Pad minutes with leading zero if necessary
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}/${month}/${year} ${hours}:${formattedMinutes} ${amPm}`;
}

