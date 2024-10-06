import {useEffect, useState} from "react";
import * as PersonsRequests from '../../APIRequests/PersonsRequests'
import styles from './PersonInfo.module.css'
import { PulseLoader } from 'react-spinners';


function PersonInfo({identifier, onPersonFound, onFetchError}) {

    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchPerson() {
            setLoading(true);
            setError(false);

            try {
                let response = null;

                if (typeof identifier === 'number') {
                    response = await PersonsRequests.getPersonById(identifier);

                } 
                else if (typeof identifier === 'string') {
                    response = await PersonsRequests.getPersonByNationalNumber(identifier);
                }

                setPerson(response.data);
                onPersonFound?.(response.data.id);
            }
            catch (error) {
                console.log(error);
                setLoading(false);
                setError(true);
            }
            finally {
                setLoading(false);
            }
        }

        if (!identifier) {
            console.log(identifier)
            setLoading(false);
            return;
        }

        fetchPerson();
    }, [identifier])

    if (loading) 
        return <PulseLoader color='#87cefa' />;
    
    if (error) {
        onFetchError?.();
        return null;
    }

    const renderInfo = () => {
        if (!identifier) {
            return (
                <div className={styles['container']}>
                    <div className={styles['person-info']}>
                        <div className={styles['left-p']}>
                            <p><b>National number: </b></p>
                            <p><b>Gender: </b></p>
                            <p><b>Age: </b></p>
                            <p><b>Email: </b></p>
                        </div>

                        <div className={styles['right-p']}>
                            <p><b>Full name: </b></p>
                            <p><b>Date of birth: </b></p>
                            <p><b>Phone: </b></p>
                            <p><b>Address: </b></p>
                        </div>
                    </div>
                </div>
            )
        }

        if (person) {
            return (
                <div className={styles['container']}>
                    <div className={styles['person-info']}>
                        <div className={styles['left-p']}>
                            <p><b>National number: </b>{person.nationalNumber}</p>
                            <p><b>Gender: </b>{person.gender == 'M' ? 'Male' : 'Female'}</p>
                            <p><b>Age: </b>{person.age}</p>
                            <p><b>Email: </b>{person.email}</p>
                        </div>

                        <div className={styles['right-p']}>
                            <p><b>Full name: </b>{person.fullName}</p>
                            <p><b>Date of birth: </b>{person.dateOfBirth}</p>
                            <p><b>Phone: </b>{person.phone}</p>
                            <p><b>Address: </b>{person.address}</p>
                        </div>
                    </div>
                </div>
            )
        }

        return null;
    }

    return (
        <>
            {renderInfo()}
        </>
    )
}

export default PersonInfo;