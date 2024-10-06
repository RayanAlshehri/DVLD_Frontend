import { useState } from 'react';
import PersonInfo from '../PersonInfo/PersonInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './FindPerson.module.css'

function FindPerson({findEnabled = true, onPersonFound}) {
    const [nationalNumber, setNationalNumber] = useState("");
    const [query, setQuery] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        setNationalNumber(numericValue);
    };

    return (
        <div>
            <div className={styles["find-person-container"]}>
                <label>National number:</label>
                <input 
                    id="nationalNumber" 
                    type="text" 
                    maxLength="5"
                    value={nationalNumber} 
                    onChange={handleInputChange} 
                    title="Please enter a valid number"
                    disabled={!findEnabled}
                />
                <button onClick={() => setQuery(nationalNumber)} className='modal-button' disabled={!findEnabled}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles["find-icon"]} />
                </button>
            </div>
            <PersonInfo identifier={query} onPersonFound={(personId) => onPersonFound?.(personId)}/>
        </div>
    );
}

export default FindPerson;
