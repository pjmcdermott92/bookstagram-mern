import { ADD_ALERT, REMOVE_ALERT } from './actions';
import uuid from '../utils/uuid';

const alertReducer = (state, action) => {
    const { type, payload } = action;

    switch(type) {
        case ADD_ALERT:
            const { message, type } = payload;
            const id = uuid();
            const alert = { id, message, type };
            return [alert, ...state];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}

export default alertReducer;
