import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LicenseInfo from '../LicenseInfo/LicenseInfo'
import styles from './FindLicense.module.css'

function FindLicense({findDirectlyLicenseId, findEnabled = true, onLicenseFound}) {
    const [licenseId, setLicenseId] = useState("");
    const [query, setQuery] = useState(0);

    useEffect(() => {
        if (findDirectlyLicenseId) {
            setLicenseId(findDirectlyLicenseId);
            setQuery(findDirectlyLicenseId);
        }

    }, [findDirectlyLicenseId])

    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        console.log("Setting licenseId to: " + numericValue);
        setLicenseId(numericValue);
    };

    return (
        <div>
            <div className={styles["find-license-container"]}>
                <label>License ID:</label>
                <input
                    id="licenseId"
                    type="text"
                    value={licenseId}
                    onChange={handleInputChange}
                    title="Please enter a valid license ID"
                    disabled={findDirectlyLicenseId || !findEnabled}
                />
                <button onClick={() => {console.log("Setting query to: " + licenseId); setQuery(licenseId)}} className='modal-button' disabled={!findEnabled}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles["find-icon"]} />
                </button>
            </div>

            <LicenseInfo licenseId={query} onLicenseFound={(foundLicenseId) => onLicenseFound?.(foundLicenseId)} />
        </div>
    )
}

export default FindLicense;