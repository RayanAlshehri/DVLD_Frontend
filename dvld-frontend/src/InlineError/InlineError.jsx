import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './InlineError.module.css'

function InlineError({message}) {

    return (
        <div className={styles["inlineError-container"]}>
            {
                message ?
                    <>
                        < Tooltip title={message} >
                            <FontAwesomeIcon icon={faCircleExclamation} className={styles["error-icon"]}/>
                        </Tooltip >
                    </>
                    :
                    <FontAwesomeIcon icon={faCircleExclamation} />
            }
        </div>
    )
}

export default InlineError;