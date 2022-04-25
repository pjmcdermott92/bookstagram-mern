import { useState, useEffect } from 'react';
import { useAlerts } from '../../../providers/BookstagramProvider';
import './ToasterAlert.scss';

const ToasterAlert = ({ id, type, message }) => {
    const [percent, setPercent] = useState(100);
    const [countDown, setCountDown] = useState(true);
    const { clearAlert } = useAlerts();

    const startCount = () => setCountDown(true);
    const stopCount = () => {
        setCountDown(false);
        setPercent(100);
    }

    useEffect(() => {
        let interval;
        if (countDown) interval = setInterval(() => {
            if (percent < 1) {
                setCountDown(false);
                clearInterval(interval);
                clearAlert(id);
            };
            setPercent(percent - .2);
        }, 5);
        return () => clearInterval(interval);
    });

    return (
        <div
            className={`ToasterAlert ${type ? `${type}` : '' }`}
            onMouseOver={stopCount}
            onMouseOut={startCount}
        >
            <div
                className='ToasterAlert__closeBtn'
                onClick={() => clearAlert(id)}
            >
                &times;
            </div>
            <p className='ToasterAlert__message'>{message}</p>
            <div className='ToasterAlert__progressBar' style={{'--progress': percent}} />
        </div>
    )
}

export default ToasterAlert;
