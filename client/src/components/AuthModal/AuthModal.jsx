import { useState } from 'react';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.scss';


const AuthModal = ({ close }) => {
    const [isRegister, setIsRegister] = useState(false);

    const toggleForm = () => setIsRegister(!isRegister);

    return (
        <>
        <div className='modal--header'>
            <h2>{isRegister ? 'Sign Up' : 'Log In'}</h2>
        </div>
        <div className='modal--body'>
            { isRegister
                ? <RegisterForm close={close} toggleForm={toggleForm} />
                : <LoginForm close={close} toggleForm={toggleForm} />
            }
        </div>
        </>
    )
}

AuthModal.propType = {
    close: PropTypes.func.isRequired
}

export default AuthModal;
