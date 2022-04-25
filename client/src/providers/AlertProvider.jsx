import { createContext, useReducer } from 'react';
import alertReducer from '../reducers/alertReducer';
import { ADD_ALERT, REMOVE_ALERT } from '../reducers/actions';
import ToasterAlert from '../components/layout/ToasterAlert/ToasterAlert';

export const AlertContext = createContext();

const AlertProvider = ({ children }) => {
    const [alerts, dispatch] = useReducer(alertReducer, []);

    const setAlert = (message, type = null) => dispatch({
        type: ADD_ALERT,
        payload: { message, type }
    });

    const clearAlert = id => dispatch({
        type: REMOVE_ALERT,
        payload: id
    });

    return <AlertContext.Provider value={{
        alerts, setAlert, clearAlert
    }}>
        {alerts?.length ? (
            <div className='AlertContainer'>
                {alerts?.map(alert => 
                    <ToasterAlert key={alert.id} {...alert} />
                )}
            </div>
        ) : null}
        {children}
    </AlertContext.Provider>
};

export default AlertProvider;
