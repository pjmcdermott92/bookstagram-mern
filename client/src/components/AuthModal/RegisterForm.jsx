import { useState } from 'react';
import { useAppContext } from '../../providers/BookstagramProvider';
import { useAlerts } from '../../providers/BookstagramProvider';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../constants';
import FormField from '../../components/layout/FormField/FormField';
import Loader from '../layout/Loader/Loader';

const INIT_STATE = { firstName: '', lastName: '', email: '', password: '', password2: '' };

const RegisterForm = ({ toggleForm, close }) => {
    const { authService, isLoading, setIsLoading, setContext } = useAppContext();
    const { setAlert } = useAlerts();
    const [values, setValues] = useState(INIT_STATE);
    const [errors, setErrors] = useState(INIT_STATE);

    const onChange = ({ target: {name, value} }) => {
        setValues({ ...values, [name]: value });
    }


    const checkErrors = () => {
        let fieldErrors = {};
        if (values.firstName.length < 2) fieldErrors = {
            ...fieldErrors,
            firstName: 'Please enter your First Name'
        };
        if (values.lastName.length < 2) fieldErrors = {
            ...fieldErrors,
            lastName: 'Please enter your Last Name'
        };
        if (!EMAIL_PATTERN.test(values.email)) fieldErrors = {
            ...fieldErrors,
            email: 'Please enter a valid Email'
        };
        if (!PASSWORD_PATTERN.test(values.password)) fieldErrors = {
            ...fieldErrors,
            password: 'Please enter a valid password'
        };
        if (values.password2 !== values.password) fieldErrors = {
            ...fieldErrors,
            password2: 'Passwords do not match'
        }
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

        const registerUser = await authService.registerUser(values);
        if (!registerUser.success) {
            setAlert(registerUser.message, 'danger');
            setIsLoading(false);
            setValues({ ...values, password: '', password2: '' });
            return;
        }
        close();
        setContext();
    }

    if (isLoading) return <Loader />
    return (
        <>
        <p>Enter your information below to start sharing your reads!</p>
        <form onSubmit={onSubmit} noValidate>
            <FormField
                name='firstName'
                label='First Name'
                type='text'
                value={values.firstName}
                error={errors.firstName}
                onChange={onChange}
                required
            />
            <FormField
                name='lastName'
                label='Last Name'
                type='text'
                value={values.lastName}
                error={errors.lastName}
                onChange={onChange}
                required
            />
            <p className='formHint'>
                This site uses Gravatar. If you would like to have a profile picture, use a Gravatar email address. <a href='https://en.gravatar.com/support/what-is-gravatar/' target='_blank' rel='noreferrer'>Learn More</a>
            </p>
            <FormField
                name='email'
                label='Email Address'
                type='email'
                value={values.email}
                error={errors.email}
                onChange={onChange}
                required
            />
            <p className='formHint'>
                Password must be between 8 and 20 characters and contain at least one uppercase letter, one lowercase letter, one number, and one of the following: <strong>! @ # $ % & * ( )</strong>
            </p>
            <FormField
                name='password'
                label='Password'
                type='password'
                value={values.password}
                error={errors.password}
                onChange={onChange}
                required
            />
            <FormField
                name='password2'
                label='Confirm Password'
                type='password'
                value={values.password2}
                error={errors.password2}
                onChange={onChange}
                required
            />
            <button className='btn btn-block btn-lg btn-primary'>
                Register
            </button>
        </form>
        <div className='altOption'>
            <p>Already have an account?</p>
            <button
                className='btn btn-gradient'
                onClick={toggleForm}
            >
                Log In
            </button>
        </div>
        </>
    );
}

export default RegisterForm;
