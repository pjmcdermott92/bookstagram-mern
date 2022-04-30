import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAppContext, useAlerts } from '../../providers/BookstagramProvider';
import { EMAIL_PATTERN } from '../../constants';
import { FormField, Loader } from '../layout';

const INIT_STATE = { email: '', password: '' };

const LoginForm = ({ toggleForm, close }) => {
    const { authService, isLoading, setIsLoading, setContext } = useAppContext();
    const { setAlert } = useAlerts();
    const [values, setValues] = useState(INIT_STATE);
    const [errors, setErrors] = useState(INIT_STATE);

    const onChange = ({ target: {name, value} }) => {
        setValues({ ...values, [name]: value });
    }

    const checkErrors = () => {
        let fieldErrors = {};
        if (!EMAIL_PATTERN.test(values.email)) fieldErrors = {
            ...fieldErrors,
            email: 'Please provide a valid Email'
        };
        if (values.password.length < 1) fieldErrors = {
            ...fieldErrors,
            password: 'Please enter your Password'
        };
        if (Object.keys(fieldErrors).length) {
            setErrors(fieldErrors);
            return true;
        }
        return false;
    }

    const onSubmit = async e => {
        e.preventDefault();
        setErrors(INIT_STATE);
        const hasErrors = checkErrors();
        if (hasErrors) return;
        setIsLoading(true);

        const logInUser = await authService.logInUser(values);
        if (!logInUser.success) {
            setAlert(logInUser.message, 'danger');
            setIsLoading(false);
            setValues({ ...values, password: '' });
            return;
        }
        close();
        setContext();
    }

    if (isLoading) return <Loader />
    return (
        <>
        <p>Enter your Email Address and password below to log in.</p>
        <form onSubmit={onSubmit} noValidate>
            <FormField
                name='email'
                label='Email Address'
                type='email'
                value={values.email}
                error={errors.email}
                onChange={onChange}
                required
            />
            <FormField
                name='password'
                label='Password'
                type='password'
                value={values.password}
                error={errors.password}
                onChange={onChange}
                required
            />
            <button className='btn btn-block btn-lg btn-primary'>
                Log In
            </button>
        </form>
        <div className='altOption'>
            <p>Don't have an account yet?</p>
            <button
                className='btn btn-gradient'
                onClick={toggleForm}
            >
                Sign Up
            </button>
        </div>
        </>
    );
}

LoginForm.propTypes = {
    toggleForm: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
}

export default LoginForm;
