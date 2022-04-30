import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './FormField.scss';

const FormField = ({
    type, name, value, label, onChange, error, ...props
}) => {
    const [revealPassword, setRevealPassword] = useState(false);
    const inputField = useRef(null);

    const getFieldType = type => {
        if (type === 'password' && revealPassword) return 'text';
        return type;
    }

    const toggleRevealPassword = e => {
        e.preventDefault();
        setRevealPassword(!revealPassword);
        inputField.current.focus();
    }

    return (
        <div className={`formGroup${error ? ' error' : ''}`}>
            <input
                ref={inputField}
                type={getFieldType(type)}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={label}
                autoComplete='false'
                {...props}
            />

            {error && <span className='formGroup--error'>{error}</span>}

            {type === 'password' && (
                <div
                    className='formGroup--toggle-password-btn'
                    role='button'
                    onClick={toggleRevealPassword}
                >
                    <FontAwesomeIcon icon={revealPassword ? faEyeSlash : faEye} />
                </div>
            )}
        </div>
    );
}

FormField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    props: PropTypes.object
}

export default FormField;
