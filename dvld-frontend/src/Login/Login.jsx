import styles from './Login.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { getUserByUsernameAndPassword } from '../APIRequests/UsersRequests';
import {useUser} from '../UserContext.jsx';

function Login({onLogin}) {

    const { setUser } = useUser();

    const handleLoginClick = async () => {
        try {
            const response = await getUserByUsernameAndPassword(document.getElementById("username").value, document.getElementById("password").value);
            setUser(response.data);
            onLogin();
        }
        catch (error) {
            if (error.response != null && error.response.status === 404) {
                alert("Invalid credentials")
            }
            else {
                alert(error);
            }
        }
    }

    return (
        <div className={styles['login-container']}>
            <h1 className={styles['login-element']}>Login</h1>
            
            <div className={styles['input-container']}>
                <FontAwesomeIcon icon={faUser} className={styles['input-icon']} />
                <input type="text" id='username' placeholder="Username"/>
            </div>

            <div className={styles['input-container']}>
                <FontAwesomeIcon icon={faKey} className={styles['input-icon']} />
                <input type="password" id='password' placeholder="Password"/>
            </div>

            <button onClick={handleLoginClick} className='main-page-button'>Login</button>
        </div>
    )
}

export default Login;
